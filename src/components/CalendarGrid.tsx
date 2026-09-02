'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MONTH_NAMES, sgDateKey, WEEKDAY_LABELS } from '@/lib/format'
import type { Club, Event } from '@/payload-types'

/**
 * The third and last client component. Events are pre-rendered and handed over whole;
 * only month navigation is interactive, so no month change touches the network.
 */

interface CalendarGridProps {
  events: Event[]
  /** Month to open on, as {year, month} with month 0-indexed. */
  initialYear: number
  initialMonth: number
}

const clubOf = (event: Event): Club | null =>
  typeof event.club === 'object' && event.club !== null ? (event.club as Club) : null

export const CalendarGrid = ({ events, initialYear, initialMonth }: CalendarGridProps) => {
  const [cursor, setCursor] = useState({ year: initialYear, month: initialMonth })

  /** Events bucketed by the Singapore calendar day they start on. */
  const byDay = useMemo(() => {
    const map = new Map<string, Event[]>()
    for (const event of events) {
      if (!event.startsAt) continue
      const key = sgDateKey(event.startsAt)
      const list = map.get(key)
      if (list) list.push(event)
      else map.set(key, [event])
    }
    return map
  }, [events])

  const { year, month } = cursor
  const firstOfMonth = new Date(Date.UTC(year, month, 1))
  // Monday-first, matching how a Singapore student reads a week.
  const leadingBlanks = (firstOfMonth.getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const step = (delta: number) => {
    setCursor((c) => {
      const next = new Date(Date.UTC(c.year, c.month + delta, 1))
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() }
    })
  }

  const keyFor = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <button
          aria-label="Previous month"
          className="flex size-11 items-center justify-center border border-line hover:border-ink"
          onClick={() => step(-1)}
          type="button"
        >
          ←
        </button>
        <h2 className="font-display text-card uppercase">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          aria-label="Next month"
          className="flex size-11 items-center justify-center border border-line hover:border-ink"
          onClick={() => step(1)}
          type="button"
        >
          →
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-px border border-line bg-line">
        {WEEKDAY_LABELS.slice(1)
          .concat(WEEKDAY_LABELS[0])
          .map((label) => (
            <div className="bg-off p-2 text-center" key={label}>
              <span className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                {label}
              </span>
            </div>
          ))}

        {days.map((day) => {
          const dayEvents = byDay.get(keyFor(day)) ?? []
          return (
            <div
              className="min-h-24 bg-paper p-2"
              key={keyFor(day)}
              // The first of the month is offset into its weekday column instead of
              // being preceded by blank cells, which would need array-index keys.
              style={day === 1 ? { gridColumnStart: leadingBlanks + 1 } : undefined}
            >
              <span className="text-meta text-muted">{day}</span>
              <ul className="mt-1 flex flex-col gap-1">
                {dayEvents.map((event) => {
                  const club = clubOf(event)
                  return (
                    <li data-club={club?.accent ?? club?.slug} key={event.id}>
                      <Link
                        className="block bg-accent-tint px-1.5 py-1 text-eyebrow text-ink hover:bg-accent hover:text-paper"
                        href={`/events/${event.slug}`}
                      >
                        {event.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
