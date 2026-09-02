import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import type { Club } from '@/payload-types'

export const ClubCard = ({ club }: { club: Club }) => (
  <Link
    className="group relative flex min-h-11 flex-col justify-end overflow-hidden bg-ink-deep"
    data-club={club.accent ?? club.slug}
    href={`/clubs/${club.slug}`}
  >
    <div className="relative aspect-[4/5] w-full">
      <MediaImage
        className="transition-transform duration-500 group-hover:scale-105"
        fill
        media={club.hero ?? club.logo}
        placeholderLabel={club.name}
        sizes="(max-width: 640px) 50vw, 33vw"
      />
      {/* Keeps the club name legible over whatever photo lands here later. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/25 to-transparent" />
    </div>

    <div className="absolute inset-x-0 bottom-0 border-b-4 border-accent p-4">
      <h3 className="text-card text-paper">{club.name}</h3>
      {club.tagline ? <p className="text-meta text-paper/80">{club.tagline}</p> : null}
    </div>
  </Link>
)
