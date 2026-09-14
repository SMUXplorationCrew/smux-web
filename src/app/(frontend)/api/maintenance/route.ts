import { revalidatePath } from 'next/cache'
import { maintenance } from '@/lib/maintenance'
import { constantTimeEqual } from '@/lib/operations'
import { getPayloadClient } from '@/lib/payload'
export const dynamic = 'force-dynamic'
export const maxDuration = 60
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || !constantTimeEqual(request.headers.get('authorization') || '', `Bearer ${secret}`))
    return new Response('Unauthorized', { status: 401 })
  const payload = await getPayloadClient()
  try {
    revalidatePath('/', 'layout')
    return Response.json(await maintenance(payload), { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    payload.logger.error('Scheduled maintenance failed; inspect worker status.')
    return Response.json({ error: 'Maintenance failed' }, { status: 503 })
  }
}
