import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { EmptyState, Section } from '@/components/Section'
import { formatDay } from '@/lib/format'
import { getAlbums } from '@/lib/payload'
import type { Club, Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from past SMUX trips and sessions.',
}

export default async function GalleryPage() {
  const albums = await getAlbums()

  return (
    <Section eyebrow="Past trips" title="Gallery">
      {albums.length > 0 ? (
        <div className="flex flex-col gap-14">
          {albums.map((album) => {
            const club =
              typeof album.club === 'object' && album.club !== null ? (album.club as Club) : null
            const photos = (Array.isArray(album.photos) ? album.photos : []).filter(
              (p): p is Media => typeof p === 'object' && p !== null,
            )

            return (
              <article data-club={club?.accent ?? club?.slug} key={album.id}>
                <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                  <h3 className="text-card">{album.title}</h3>
                  <p className="font-display text-eyebrow tracking-eyebrow text-accent uppercase">
                    {club ? (
                      <Link className="hover:underline" href={`/clubs/${club.slug}`}>
                        {club.name}
                      </Link>
                    ) : null}
                    {album.date ? ` · ${formatDay(album.date)}` : ''}
                  </p>
                </header>

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {photos.map((photo) => (
                    <div className="relative aspect-square" key={photo.id}>
                      <MediaImage
                        fill
                        media={photo}
                        placeholderLabel=""
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState>
          No albums yet. They will appear here as clubs upload photos from their trips.
        </EmptyState>
      )}
    </Section>
  )
}
