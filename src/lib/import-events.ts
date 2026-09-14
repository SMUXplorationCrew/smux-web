import type { Payload } from 'payload'
import { resolveClubId } from '@/access'
import { eventReadiness } from '@/lib/readiness'
import { httpUrl } from '@/lib/url'
import type { Event, User } from '@/payload-types'
export interface ImportRow {
  externalId: string
  title: string
  date: string
  endDate?: string
  signupUrl?: string
  url?: string
  location?: string
  cost?: string
}
export const validateImport = (rows: ImportRow[]) => {
  const seen = new Set<string>()
  return rows.map((row, index) => {
    const errors: string[] = []
    if (!row.externalId || seen.has(row.externalId))
      errors.push('External ID is missing or duplicated.')
    seen.add(row.externalId)
    if (!row.title?.trim()) errors.push('Title is required.')
    if (
      !row.date ||
      !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(
        row.date,
      ) ||
      !Number.isFinite(Date.parse(row.date))
    )
      errors.push('Use an ISO date (YYYY-MM-DD) or timestamp with timezone.')
    if (
      row.endDate &&
      (!Number.isFinite(Date.parse(row.endDate)) || Date.parse(row.endDate) < Date.parse(row.date))
    )
      errors.push('End date must be valid and after the start.')
    if ((row.signupUrl || row.url) && !httpUrl(row.signupUrl || row.url))
      errors.push('Signup URL is invalid.')
    return { row, index: index + 1, errors }
  })
}
export const importedData = (row: ImportRow, club: number | null): Partial<Event> => ({
  externalId: row.externalId,
  title: row.title,
  slug: `${club || 'smux'}-${row.externalId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
  startsAt: row.date.length === 10 ? `${row.date}T00:00:00+08:00` : row.date,
  endsAt: row.endDate
    ? row.endDate.length === 10
      ? `${row.endDate}T00:00:00+08:00`
      : row.endDate
    : null,
  timeTbc: row.date.length === 10,
  signupUrl: httpUrl(row.signupUrl || row.url),
  location: row.location,
  cost: row.cost,
  club,
  _status: 'draft',
  reviewState: 'draft',
})
export async function importEvents(
  payload: Payload,
  user: User,
  rows: ImportRow[],
  clubId: number | null,
  apply = false,
) {
  if (rows.length > 200) throw new Error('Import at most 200 rows at a time.')
  const club = user.role === 'editor' ? Number(resolveClubId(user.club)) : clubId
  const checked = validateImport(rows)
  if (checked.some((r) => r.errors.length)) return { rows: checked, applied: false }
  const results = []
  for (const { row, index } of checked) {
    const externalId = `${club || 'smux'}:${row.externalId}`
    // ID is globally namespaced by club; scope-check existing matches before any write.
    const existing = await payload.find({
      collection: 'events',
      where: { externalId: { equals: externalId } },
      limit: 1,
      user,
      overrideAccess: false,
      depth: 0,
    })
    const doc = existing.docs[0]
    if (doc && user.role === 'editor' && resolveClubId(doc.club) !== resolveClubId(user.club))
      throw new Error('Cannot overwrite another club.')
    const data = { ...importedData(row, club), externalId }
    if (!data.slug) throw new Error(`Row ${index}: choose a usable external ID.`)
    let id = doc?.id
    if (apply) {
      if (doc)
        id = (
          await payload.update({
            collection: 'events',
            id: doc.id,
            data,
            user,
            overrideAccess: false,
          })
        ).id
      else
        id = (
          await payload.create({
            collection: 'events',
            data: data as Event,
            user,
            overrideAccess: false,
          })
        ).id
    }
    results.push({
      index,
      externalId,
      id,
      action: doc ? 'update draft' : 'create draft',
      title: row.title,
      issues: eventReadiness(data),
    })
  }
  return { rows: results, applied: apply }
}
