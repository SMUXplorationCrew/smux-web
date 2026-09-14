import Link from 'next/link'
import { MediaImage, resolveMedia } from '@/components/MediaImage'
import { SaveButton } from '@/components/Shortlist'
import { SignupLabel } from '@/components/SignupControl'
import { formatDay, formatEventWhen } from '@/lib/format'
import { getRegistrationStatus } from '@/lib/signupState'
import type { Event } from '@/payload-types'
export function EventCard({ event, showClub = true }: { event: Event; showClub?: boolean }) {
  const club = typeof event.club === 'object' ? event.club : null
  const cover = resolveMedia(event.cover)
  return (
    <article
      data-club={showClub ? club?.accent : undefined}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper"
    >
      {cover ? (
        <Link href={`/events/${event.slug}`} className="relative block aspect-[16/9]">
          <MediaImage fill media={cover} sizes="(max-width:640px) 100vw, 33vw" />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded bg-accent-tint px-3 py-2 font-display text-lead text-accent-text">
            {formatDay(event.startsAt)}
          </span>
          {showClub ? (
            <span className="text-meta text-copy">{club?.name || 'SMUX-wide'}</span>
          ) : null}
        </div>
        <h3 className="text-card">
          <Link className="hover:underline" href={`/events/${event.slug}`}>
            {event.title}
          </Link>
        </h3>
        <p className="text-meta text-copy">
          {formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)}
          {event.timeTbc ? ' · Time to be confirmed' : ''}
        </p>
        {event.location ? <p className="text-meta text-copy">{event.location}</p> : null}
        <SignupLabel event={event} initial={getRegistrationStatus(event)} className="mt-auto" />
        <div className="flex flex-wrap gap-2">
          <Link className="button button-primary" href={`/events/${event.slug}`}>
            View event
          </Link>
          <SaveButton kind="event" id={event.id} />
        </div>
      </div>
    </article>
  )
}
