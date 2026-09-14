import { nextDateKey } from '@/lib/event-time'
import { sgDateKey } from '@/lib/format'
import type { Event } from '@/payload-types'

const stamp = (value: string | Date) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
const escapeICal = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/[;,]/g, (m) => `\\${m}`)
/** Fold by UTF-8 octets without cutting a Unicode code point. Continuation includes its leading space. */
export const foldICal = (line: string): string => {
  const encoder = new TextEncoder()
  const lines: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    if (bytes + size > 75) {
      lines.push(current)
      current = ' '
      bytes = 1
    }
    current += char
    bytes += size
  }
  lines.push(current)
  return lines.join('\r\n')
}
export const calendarFile = (events: Event[], origin: string, title = 'SMUX events'): string => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SMUXploration Crew//Events//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeICal(title)}`,
    'X-WR-TIMEZONE:Asia/Singapore',
  ]
  for (const event of events) {
    const start = new Date(event.startsAt)
    if (!Number.isFinite(start.getTime())) continue
    const url = `${origin}/events/${encodeURIComponent(event.slug)}`
    lines.push(
      'BEGIN:VEVENT',
      `UID:event-${event.id}@smux`,
      `DTSTAMP:${stamp(event.updatedAt || event.startsAt)}`,
      `LAST-MODIFIED:${stamp(event.updatedAt || event.startsAt)}`,
    )
    if (event.timeTbc) {
      lines.push(
        `DTSTART;VALUE=DATE:${sgDateKey(start).replaceAll('-', '')}`,
        `DTEND;VALUE=DATE:${nextDateKey(sgDateKey(event.endsAt || start)).replaceAll('-', '')}`,
      )
    } else {
      lines.push(`DTSTART:${stamp(start)}`)
      if (event.endsAt) lines.push(`DTEND:${stamp(event.endsAt)}`)
    }
    lines.push(
      `SUMMARY:${escapeICal(event.title)}`,
      `DESCRIPTION:${escapeICal(`${event.timeTbc ? 'Time to be confirmed. ' : ''}${url}`)}`,
      `URL:${url}`,
      `STATUS:${event.cancelled ? 'CANCELLED' : 'CONFIRMED'}`,
    )
    if (event.location) lines.push(`LOCATION:${escapeICal(event.location)}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return `${lines.map(foldICal).join('\r\n')}\r\n`
}
