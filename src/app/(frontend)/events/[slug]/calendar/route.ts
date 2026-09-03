import { formatEventWhen } from '@/lib/format'
import { getEventBySlug } from '@/lib/payload'
import { absolute } from '@/lib/site'
import type { Club } from '@/payload-types'

/**
 * An .ics download per event, so "I'll remember" becomes a calendar entry.
 *
 * Built from data already modelled, which is why it is cheap. Events whose time is not
 * confirmed are emitted as all-day entries rather than pinned to the nominal 10am the
 * database stores — that hour is a storage detail and was never meant to be shown.
 */

const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
const day = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`

/** RFC 5545: escape separators, and fold lines longer than 75 octets. */
const esc = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/[;,]/g, (m) => `\\${m}`)
    .replace(/\n/g, '\\n')
const fold = (line: string): string =>
  line.length <= 74 ? line : `${line.slice(0, 74)}\r\n ${fold(line.slice(74)).replace(/^ /, '')}`

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event?.startsAt) return new Response('Not found', { status: 404 })

  const club = typeof event.club === 'object' && event.club !== null ? (event.club as Club) : null
  const start = new Date(event.startsAt)
  const end = event.endsAt ? new Date(event.endsAt) : null

  const when = event.timeTbc
    ? [
        `DTSTART;VALUE=DATE:${day(start)}`,
        `DTEND;VALUE=DATE:${day(new Date(start.getTime() + 86400000))}`,
      ]
    : [`DTSTART:${stamp(start)}`, `DTEND:${stamp(end ?? new Date(start.getTime() + 2 * 3600000))}`]

  const description = [
    club ? `Run by ${club.name}.` : 'A SMUX-wide event.',
    event.timeTbc ? 'Timing not yet confirmed — check the site nearer the date.' : '',
    absolute(`/events/${event.slug}`),
  ]
    .filter(Boolean)
    .join('\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SMUXploration Crew//smux-web//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.slug}@smux`,
    `DTSTAMP:${stamp(new Date())}`,
    ...when,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(description)}`,
    event.location ? `LOCATION:${esc(event.location)}` : '',
    `URL:${absolute(`/events/${event.slug}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  return new Response(lines.map(fold).join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
      // Same reasoning as media: the file only changes when the event does, and the
      // revalidation hook already rebuilds these paths on publish.
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
