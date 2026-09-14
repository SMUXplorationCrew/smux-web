'use client'
import Link from 'next/link'
import { useClock } from '@/components/Clock'
import { EventCard } from '@/components/EventCard'
import { eventLifecycle } from '@/lib/event-time'
import type { Event } from '@/payload-types'
export function LiveEvents({
  events,
  initialNow,
  limit = 6,
  showClub = true,
  smuxOnly = false,
}: {
  events: Event[]
  initialNow: number
  limit?: number
  showClub?: boolean
  smuxOnly?: boolean
}) {
  const now = useClock(initialNow)
  const upcoming = events
    .filter(
      (e) => ['upcoming', 'ongoing'].includes(eventLifecycle(e, now)) && (!smuxOnly || !e.club),
    )
    .slice(0, limit)
  return upcoming.length ? (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {upcoming.map((event) => (
        <EventCard event={event} key={event.id} showClub={showClub} />
      ))}
    </div>
  ) : (
    <div className="notice">
      Nothing scheduled right now.{' '}
      <Link className="underline" href="/clubs">
        Follow a club for its next activity.
      </Link>
    </div>
  )
}
