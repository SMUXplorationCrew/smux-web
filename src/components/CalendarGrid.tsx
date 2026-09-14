// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The calendar overflow region must support keyboard scrolling.
'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useClock } from '@/components/Clock'
import { eventEnd, eventLifecycle } from '@/lib/event-time'
import { formatEventWhen, MONTH_NAMES, sgDateKey } from '@/lib/format'
import type { Event } from '@/payload-types'
export function CalendarGrid({
  events,
  initialYear,
  initialMonth,
  initialNow,
}: {
  events: Event[]
  initialYear: number
  initialMonth: number
  initialNow: number
}) {
  const [cursor, setCursor] = useState({ year: initialYear, month: initialMonth })
  const [view, setView] = useState('agenda')
  const [club, setClub] = useState('')
  const now = useClock(initialNow)
  useEffect(() => {
    const restore = () => {
      const url = new URL(location.href),
        month = url.searchParams.get('month')
      const key =
        month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : sgDateKey(new Date()).slice(0, 7)
      const [y, m] = key.split('-').map(Number)
      setCursor({ year: y, month: m - 1 })
      setClub(url.searchParams.get('club') || '')
      setView(url.searchParams.get('view') || (window.innerWidth >= 768 ? 'month' : 'agenda'))
    }
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  const sync = (next = cursor, nextView = view, nextClub = club) => {
    setCursor(next)
    setView(nextView)
    setClub(nextClub)
    const url = new URL(location.href)
    url.searchParams.set('month', `${next.year}-${String(next.month + 1).padStart(2, '0')}`)
    url.searchParams.set('view', nextView)
    if (nextClub) url.searchParams.set('club', nextClub)
    else url.searchParams.delete('club')
    history.pushState(null, '', url)
  }
  const clubs = useMemo(
    () => [
      ...new Map(
        events.flatMap((e) =>
          typeof e.club === 'object' && e.club ? [[e.club.slug, e.club] as const] : [],
        ),
      ).values(),
    ],
    [events],
  )
  const { year, month } = cursor
  const start = new Date(
      `${year}-${String(month + 1).padStart(2, '0')}-01T00:00:00+08:00`,
    ).getTime(),
    end = new Date(Date.UTC(year, month + 1, 1) - 8 * 3600000).getTime()
  const visible = events.filter(
    (e) =>
      (eventEnd(e) || Date.parse(e.startsAt)) > start &&
      Date.parse(e.startsAt) < end &&
      (!club || (typeof e.club === 'object' && e.club?.slug === club)),
  )
  const days = Array.from(
    { length: new Date(Date.UTC(year, month + 1, 0)).getUTCDate() },
    (_, i) => i + 1,
  )
  const step = (delta: number) => {
    const date = new Date(Date.UTC(year, month + delta, 1))
    sync({ year: date.getUTCFullYear(), month: date.getUTCMonth() })
  }
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="icon-button"
            type="button"
            aria-label="Previous month"
            onClick={() => step(-1)}
          >
            ←
          </button>
          <h2 className="text-card" aria-live="polite">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Next month"
            onClick={() => step(1)}
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="button button-quiet"
            type="button"
            onClick={() => {
              const [y, m] = sgDateKey(new Date()).split('-').map(Number)
              sync({ year: y, month: m - 1 })
            }}
          >
            Today
          </button>
          {['agenda', 'month'].map((v) => (
            <button
              className="filter-chip"
              type="button"
              key={v}
              aria-pressed={view === v}
              onClick={() => sync(cursor, v)}
            >
              {v === 'agenda' ? 'Agenda' : 'Month'}
            </button>
          ))}
        </div>
      </div>
      <div className="my-6 flex flex-wrap items-end gap-3">
        <label className="field">
          Club
          <select
            className="input"
            value={club}
            onChange={(e) => sync(cursor, view, e.target.value)}
          >
            <option value="">All clubs</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <a
          className="button button-quiet"
          href={`/calendar/feed${club ? `?club=${encodeURIComponent(club)}` : ''}`}
        >
          Download calendar
        </a>
        <button
          className="button button-quiet"
          type="button"
          onClick={() => {
            location.href = `webcal://${location.host}/calendar/feed${club ? `?club=${encodeURIComponent(club)}` : ''}`
          }}
        >
          Subscribe
        </button>
      </div>
      <p className="mb-6 text-meta text-copy">
        All dates are shown in Singapore time. Subscribed calendars refresh on their own schedule.
      </p>
      {view === 'agenda' ? (
        <ul className="divide-y divide-line border-y border-line">
          {visible.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  className="font-display text-card hover:underline"
                  href={`/events/${event.slug}`}
                >
                  {event.title}
                </Link>
                <p className="mt-2 text-meta text-copy">
                  {formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)}
                </p>
              </div>
              <span className="text-meta text-copy">
                {eventLifecycle(event, now) === 'ongoing'
                  ? 'Happening now'
                  : typeof event.club === 'object'
                    ? event.club?.name
                    : 'SMUX-wide'}
              </span>
            </li>
          ))}
          {!visible.length ? (
            <li className="py-8">No events this month. Try another month or club.</li>
          ) : null}
        </ul>
      ) : (
        <section
          className="overflow-x-auto"
          tabIndex={0}
          aria-label="Month calendar; scroll horizontally on small screens"
        >
          <div className="grid min-w-[42rem] grid-cols-7 gap-px border border-line bg-line">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="bg-off p-3 text-center text-meta">
                {d}
              </div>
            ))}
            {days.map((day) => {
              const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const inDay = visible.filter(
                (e) =>
                  sgDateKey(e.startsAt) <= key &&
                  sgDateKey(new Date((eventEnd(e) || Date.parse(e.startsAt)) - 1)) >= key,
              )
              return (
                <div
                  key={key}
                  className="min-h-28 bg-paper p-2"
                  style={
                    day === 1
                      ? {
                          gridColumnStart:
                            ((new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7) + 1,
                        }
                      : undefined
                  }
                >
                  <time
                    dateTime={key}
                    className={
                      key === sgDateKey(new Date(now))
                        ? 'font-semibold text-accent-text'
                        : 'text-meta text-copy'
                    }
                  >
                    {day}
                  </time>
                  <ul className="mt-2 flex flex-col gap-1">
                    {inDay.map((e) => (
                      <li key={e.id}>
                        <Link
                          className="flex min-h-11 items-center rounded bg-off p-2 text-meta hover:underline"
                          href={`/events/${e.slug}`}
                        >
                          {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
