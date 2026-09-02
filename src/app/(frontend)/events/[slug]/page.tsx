import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Container, Section } from '@/components/Section'
import { SignupButton } from '@/components/SignupButton'
import { formatEventWhen } from '@/lib/format'
import { getEventBySlug, getEvents } from '@/lib/payload'
import type { Club } from '@/payload-types'

export async function generateStaticParams() {
  const events = await getEvents({ limit: 200 })
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event not found' }

  return { title: event.title, description: event.location ?? undefined }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const club = typeof event.club === 'object' && event.club !== null ? (event.club as Club) : null

  return (
    <div data-club={club?.accent ?? club?.slug}>
      <section className="relative isolate flex min-h-[50vh] items-end overflow-hidden bg-ink-deep">
        <div className="absolute inset-0">
          <MediaImage
            fill
            media={event.cover}
            placeholderLabel={club?.name ?? 'SMUX'}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-ink-deep/20" />
        </div>
        <Container className="relative py-14">
          {club ? (
            <Link
              className="font-display text-eyebrow tracking-eyebrow text-paper/80 uppercase hover:text-orange-lift"
              href={`/clubs/${club.slug}`}
            >
              {club.name}
            </Link>
          ) : null}
          <h1 className="mt-2 max-w-3xl text-hero-sm text-paper">{event.title}</h1>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {event.description ? (
              <RichText data={event.description} />
            ) : (
              <p className="text-meta text-muted">[DESCRIPTION TO COME]</p>
            )}
          </div>

          <aside className="h-fit bg-off p-6">
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                  When
                </dt>
                <dd className="text-meta text-ink">
                  {formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)}
                </dd>
              </div>
              {event.location ? (
                <div>
                  <dt className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                    Where
                  </dt>
                  <dd className="text-meta text-ink">{event.location}</dd>
                </div>
              ) : null}
              {event.cost ? (
                <div>
                  <dt className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                    Cost
                  </dt>
                  <dd className="text-meta text-ink">{event.cost}</dd>
                </div>
              ) : null}
              {typeof event.capacity === 'number' ? (
                <div>
                  <dt className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                    Places
                  </dt>
                  <dd className="text-meta text-ink">
                    {typeof event.spotsTaken === 'number'
                      ? `${Math.max(event.capacity - event.spotsTaken, 0)} of ${event.capacity} left`
                      : `${event.capacity} places`}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6">
              <SignupButton className="w-full" event={event} />
            </div>
          </aside>
        </div>
      </Section>
    </div>
  )
}
