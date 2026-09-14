import 'dotenv/config'
import fs from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config'

if (process.env.SMUX_ADOPT_BASELINE !== 'reviewed')
  throw new Error(
    'Review the existing schema and backup first. Set SMUX_ADOPT_BASELINE=reviewed to adopt the baseline.',
  )
const payload = await getPayload({ config })
try {
  const snapshot = JSON.parse(
    await fs.readFile(
      new URL('../src/migrations/20260912_062042_baseline.json', import.meta.url),
      'utf8',
    ),
  )
  const actual = await payload.db.pool.query(
    "SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='public'",
  )
  const columns = new Set(
    actual.rows.map(
      (r: { table_name: string; column_name: string }) => `${r.table_name}.${r.column_name}`,
    ),
  )
  const missing: string[] = []
  for (const table of Object.values(snapshot.tables) as {
    name: string
    columns: Record<string, unknown>
  }[]) {
    for (const column of Object.keys(table.columns)) {
      if (!columns.has(`${table.name}.${column}`)) missing.push(`${table.name}.${column}`)
    }
  }
  if (missing.length)
    throw new Error(
      `Baseline schema is missing ${missing.length} columns: ${missing.slice(0, 15).join(', ')}. Use migrations on an empty database instead.`,
    )
  await payload.db.pool.query(
    'INSERT INTO payload_migrations(name,batch,created_at,updated_at) SELECT $1::varchar,0,now(),now() WHERE NOT EXISTS(SELECT 1 FROM payload_migrations WHERE name=$1::varchar)',
    ['20260912_062042_baseline'],
  )
  await payload.db.pool.query('DELETE FROM payload_migrations WHERE batch=-1')
  console.log(
    'Baseline adopted after table/column inventory validation. Run migrate next. No application records were changed.',
  )
} finally {
  await payload.destroy()
}
