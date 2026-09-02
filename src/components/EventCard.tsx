import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { formatEventWhen } from '@/lib/format'
import { getSignupStatus } from '@/lib/signupState'
import type { Club, Event } from '@/payload-types'

const clubOf = (club: Event['club']): Club | null =>
  club && typeof club === 'object' ? (club as Club) : null

interface EventCardProps {
  event: Event
  /** Club pages already sit inside a themed wrapper and don't need the club named. */
  showClub?: boolean
}

export const EventCard = ({ event, showClub = true }: EventCardProps) => {
  const club = clubOf(event.club)
  const { state, label } = getSignupStatus(event)

  return (
    <article
      className="group flex flex-col bg-paper ring-1 ring-line"
      // Themes the card to its own club when it appears in a mixed list.
      data-club={showClub ? (club?.accent ?? undefined) : undefined}
    >
      <Link className="relative block overflow-hidden" href={`/events/${event.slug}`}>
        <div className="relative aspect-[3/2] w-full">
          <MediaImage
            fill
            media={event.cover}
            placeholderLabel={club?.name ?? 'SMUX'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {showClub ? (
          <span className="font-display text-eyebrow tracking-eyebrow text-accent uppercase">
            {/* No club means the main committee runs it for all of SMUX. */}
            {club?.name ?? 'SMUX'}
          </span>
        ) : null}

        <h3 className="text-card">
          <Link className="hover:text-accent" href={`/events/${event.slug}`}>
            {event.title}
          </Link>
        </h3>

        <p className="text-meta text-muted">
          {formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)}
        </p>
        {event.location ? <p className="text-meta text-muted">{event.location}</p> : null}

        <p
          className={`mt-auto pt-2 font-display text-eyebrow tracking-eyebrow uppercase ${
            state === 'open' ? 'text-orange-text' : 'text-muted'
          }`}
        >
          {label}
        </p>
      </div>
    </article>
  )
}
