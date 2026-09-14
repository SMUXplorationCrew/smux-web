import ExcelJS from 'exceljs'
import { session } from '@/lib/auth'
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return Response.json({ error: 'Origin rejected' }, { status: 403 })
  const { user } = await session()
  if (!user || !['editor', 'mc'].includes(user.role))
    return Response.json({ error: 'Editor access required' }, { status: 403 })
  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size > 1_000_000 || !file.name.endsWith('.xlsx'))
      throw new Error('Choose an XLSX file under 1 MB.')
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(await file.arrayBuffer())
    const sheet = workbook.worksheets[0]
    if (!sheet || sheet.rowCount > 201 || sheet.columnCount > 20)
      throw new Error('Use one header row and at most 200 event rows, with at most 20 columns.')
    const columns = new Map<number, string>()
    sheet.getRow(1).eachCell((cell, column) => {
      const value = String(cell.value || '').trim()
      if (['externalId', 'title', 'date', 'endDate', 'url', 'location', 'cost'].includes(value))
        columns.set(column, value)
    })
    const rows: Record<string, string>[] = []
    sheet.eachRow((row, n) => {
      if (n === 1) return
      const data: Record<string, string> = {}
      for (const [column, name] of columns) {
        const value = row.getCell(column).value
        if (value && typeof value === 'object' && !(value instanceof Date))
          throw new Error(
            'Formula, hyperlink and rich-text cells must be converted to plain values.',
          )
        data[name] =
          value instanceof Date ? value.toISOString().slice(0, 10) : String(value || '').trim()
      }
      rows.push(data)
    })
    return Response.json({ rows }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unable to read workbook' },
      { status: 400 },
    )
  }
}
