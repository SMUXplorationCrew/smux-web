'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useClock } from '@/components/Clock'
import { EventCard } from '@/components/EventCard'
import { eventLifecycle } from '@/lib/event-time'
import { getRegistrationStatus } from '@/lib/signupState'
import type { Club, Event } from '@/payload-types'

interface Filters {
  q: string
  club: string
  range: string
  status: string
  signup: string
  view: string
}
const empty: Filters = {
  q: '',
  club: '',
  range: 'all',
  status: 'upcoming',
  signup: 'all',
  view: 'grid',
}
const fromUrl = (): Filters => {
  const query = new URLSearchParams(location.search)
  return {
    ...empty,
    ...Object.fromEntries(
      Object.keys(empty).map((key) => [key, query.get(key) || empty[key as keyof Filters]]),
    ),
  }
}
export function EventFilter({
  events,
  clubs,
  initialNow,
}: {
  events: Event[]
  clubs: Club[]
  initialNow: number
}) {
  const [filters, setFilters] = useState(empty),
    [page, setPage] = useState(1)
  const now = useClock(initialNow)
  useEffect(() => {
    const restore = () => {
      setFilters(fromUrl())
      setPage(1)
    }
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    setPage(1)
    const url = new URL(location.href)
    for (const [key, value] of Object.entries(next)) {
      if (value === empty[key as keyof Filters]) url.searchParams.delete(key)
      else url.searchParams.set(key, value)
    }
    history.pushState(null, '', url)
  }
  const filtered = useMemo(
    () =>
      events.filter((event) => {
        const club = typeof event.club === 'object' ? event.club : null,
          lifecycle = eventLifecycle(event, now)
        if (filters.club && (filters.club === 'smux' ? !!club : club?.slug !== filters.club))
          return false
        if (filters.status === 'upcoming' && !['upcoming', 'ongoing'].includes(lifecycle))
          return false
        if (
          filters.status !== 'all' &&
          filters.status !== 'upcoming' &&
          lifecycle !== filters.status
        )
          return false
        const horizon = filters.range === 'week' ? 7 : filters.range === 'month' ? 31 : null
        if (
          horizon &&
          (Date.parse(event.startsAt) > now + horizon * 86400000 || lifecycle === 'past')
        )
          return false
        if (
          filters.signup === 'open' &&
          getRegistrationStatus(event, new Date(now)).state !== 'open'
        )
          return false
        return `${event.title} ${club?.name || ''} ${event.location || ''} ${event.activity || ''}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      }),
    [events, filters, now],
  )
  return (
    <>
      <div className="grid gap-4 rounded-lg bg-off p-5 md:grid-cols-3">
        <label className="field md:col-span-2">
          Search activities
          <input
            className="input"
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Try hiking, diving or a place"
          />
        </label>
        <label className="field">
          Club
          <select
            className="input"
            value={filters.club}
            onChange={(e) => update({ club: e.target.value })}
          >
            <option value="">All clubs</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value="smux">SMUX-wide</option>
          </select>
        </label>
        <label className="field">
          When
          <select
            className="input"
            value={filters.range}
            onChange={(e) => update({ range: e.target.value })}
          >
            <option value="all">Any time</option>
            <option value="week">Next 7 days</option>
            <option value="month">Next 31 days</option>
          </select>
        </label>
        <label className="field">
          Event status
          <select
            className="input"
            value={filters.status}
            onChange={(e) => update({ status: e.target.value })}
          >
            <option value="upcoming">Upcoming & ongoing</option>
            <option value="ongoing">Happening now</option>
            <option value="past">Past events</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All events</option>
          </select>
        </label>
        <label className="field">
          Registration
          <select
            className="input"
            value={filters.signup}
            onChange={(e) => update({ signup: e.target.value })}
          >
            <option value="all">All availability</option>
            <option value="open">Open for signup</option>
          </select>
        </label>
      </div>
      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-meta text-copy">
          {filtered.length} event{filtered.length === 1 ? '' : 's'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="filter-chip"
            aria-pressed={filters.view === 'grid'}
            onClick={() => update({ view: 'grid' })}
          >
            Cards
          </button>
          <button
            type="button"
            className="filter-chip"
            aria-pressed={filters.view === 'list'}
            onClick={() => update({ view: 'list' })}
          >
            List
          </button>
          <button type="button" className="button button-quiet" onClick={() => update(empty)}>
            Reset
          </button>
          <Link className="button button-quiet" href="/calendar">
            Calendar
          </Link>
        </div>
      </div>
      {filtered.length ? (
        <>
          <div
            className={
              filters.view === 'list' ? 'grid gap-4' : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
            }
          >
            {filtered.slice(0, page * 12).map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
          {filtered.length > page * 12 ? (
            <button
              className="button button-quiet mt-8"
              type="button"
              onClick={() => setPage((p) => p + 1)}
            >
              Show more events
            </button>
          ) : null}
        </>
      ) : (
        <div className="notice">No events match. Try another club or reset your filters.</div>
      )}
    </>
  )
}
