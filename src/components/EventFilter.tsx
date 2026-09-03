'use client'

import { useMemo, useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { EmptyState } from '@/components/Section'
import type { Club, Event } from '@/payload-types'

/**
 * The second deliberate client component. The event list itself is pre-rendered on the
 * server and passed in whole; only the chip selection lives in the browser, so
 * filtering never costs a round trip and the page still works before hydration.
 */
export const EventFilter = ({ events, clubs }: { events: Event[]; clubs: Club[] }) => {
  const [active, setActive] = useState<string | null>(null)
  const [range, setRange] = useState<'all' | 'week' | 'month'>('all')

  const filtered = useMemo(() => {
    // Date first: with 133 events the club chips alone still leave a long list.
    const now = Date.now()
    const horizon =
      range === 'week' ? now + 7 * 86400000 : range === 'month' ? now + 31 * 86400000 : null

    const byDate = horizon
      ? events.filter((e) => {
          const t = e.startsAt ? new Date(e.startsAt).getTime() : null
          return t !== null && t <= horizon
        })
      : events

    if (!active) return byDate
    return byDate.filter((event) => {
      const club = event.club
      const slug = typeof club === 'object' && club !== null ? (club as Club).slug : null
      // Club-less events belong to the main committee, filtered under "SMUX".
      return active === 'smux' ? slug === null : slug === active
    })
  }, [events, active, range])

  const hasSmuxWide = events.some((e) => !e.club)

  return (
    <>
      <fieldset className="flex flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">Filter events by club</legend>
        <button
          aria-pressed={active === null}
          className={`min-h-11 border px-4 font-display text-eyebrow tracking-eyebrow uppercase transition-colors ${
            active === null
              ? 'border-ink bg-ink text-paper'
              : 'border-line text-ink hover:border-ink'
          }`}
          onClick={() => setActive(null)}
          type="button"
        >
          All
        </button>

        {clubs.map((club) => (
          <button
            aria-pressed={active === club.slug}
            className={`min-h-11 border px-4 font-display text-eyebrow tracking-eyebrow uppercase transition-colors ${
              active === club.slug
                ? 'border-accent bg-accent text-paper'
                : 'border-line text-ink hover:border-accent'
            }`}
            data-club={club.accent ?? club.slug}
            key={club.id}
            onClick={() => setActive(club.slug)}
            type="button"
          >
            {club.name}
          </button>
        ))}

        {hasSmuxWide ? (
          <button
            aria-pressed={active === 'smux'}
            className={`min-h-11 border px-4 font-display text-eyebrow tracking-eyebrow uppercase transition-colors ${
              active === 'smux'
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-ink hover:border-ink'
            }`}
            onClick={() => setActive('smux')}
            type="button"
          >
            SMUX-wide
          </button>
        ) : null}
      </fieldset>

      <fieldset className="mt-3 flex flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">Filter events by date</legend>
        {(
          [
            ['all', 'Any time'],
            ['week', 'Next 7 days'],
            ['month', 'Next month'],
          ] as const
        ).map(([value, label]) => (
          <button
            aria-pressed={range === value}
            className={`min-h-11 border px-4 font-display text-eyebrow tracking-eyebrow uppercase transition-colors ${
              range === value
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-ink hover:border-ink'
            }`}
            key={value}
            onClick={() => setRange(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </fieldset>

      <div className="mt-8">
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        ) : (
          <EmptyState>No events match that filter yet.</EmptyState>
        )}
      </div>
    </>
  )
}
