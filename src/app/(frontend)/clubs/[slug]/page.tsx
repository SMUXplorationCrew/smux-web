import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EventCard } from '@/components/EventCard'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Container, EmptyState, Section } from '@/components/Section'
import { getAlbums, getClubBySlug, getClubs, getEvents, getPeople } from '@/lib/payload'
import type { Media } from '@/payload-types'

/** Pre-renders all six club pages at build time. Nothing is fetched per request. */
export async function generateStaticParams() {
  const clubs = await getClubs()
  return clubs.map((club) => ({ slug: club.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) return { title: 'Club not found' }

  return { title: club.name, description: club.tagline ?? undefined }
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) notFound()

  const [events, albums, people] = await Promise.all([
    getEvents({ clubId: club.id, upcoming: true, limit: 6 }),
    getAlbums(club.id),
    getPeople(club.id),
  ])

  const photos = albums
    .flatMap((album) => (Array.isArray(album.photos) ? album.photos : []))
    .filter((p): p is Media => typeof p === 'object' && p !== null)
    .slice(0, 8)

  const socials = club.socials
  const telegramHref = socials?.telegram
    ? `https://${socials.telegram.replace(/^https?:\/\//, '')}`
    : null

  return (
    // One attribute themes the whole page; nothing below reads a club colour directly.
    <div data-club={club.accent ?? club.slug}>
      {/* Photo hero */}
      <section className="relative isolate flex min-h-[60vh] items-end overflow-hidden bg-ink-deep">
        <div className="absolute inset-0">
          <MediaImage fill media={club.hero} placeholderLabel={club.name} priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-ink-deep/20" />
        </div>
        <Container className="relative py-14">
          <h1 className="text-hero-sm text-paper md:text-hero">{club.name}</h1>
          {club.tagline ? (
            <p className="mt-3 max-w-xl text-lead text-paper/85">{club.tagline}</p>
          ) : null}
        </Container>
      </section>

      {/* Quick facts */}
      <section className="border-b border-line bg-off">
        <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          <div>
            <p className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
              Upcoming
            </p>
            <p className="text-card text-ink">{events.length}</p>
          </div>
          <div>
            <p className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
              Committee
            </p>
            <p className="text-card text-ink">{people.length}</p>
          </div>
          <div>
            <p className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
              Experience needed
            </p>
            <p className="text-card text-ink">None</p>
          </div>
          {socials?.email ? (
            <div>
              <p className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                Email
              </p>
              <a
                className="text-meta break-words text-orange-text underline underline-offset-2"
                href={`mailto:${socials.email}`}
              >
                {socials.email}
              </a>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Who we are */}
      {club.whoWeAre ? (
        <Section eyebrow="Who we are" title={`This is ${club.name}`}>
          <div className="max-w-3xl">
            <RichText data={club.whoWeAre} />
          </div>
        </Section>
      ) : null}

      {/* Key events — the club's signature happenings, distinct from dated events */}
      {club.keyEvents?.length ? (
        <Section className="bg-accent-tint" eyebrow="What we do" title="Key events">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {club.keyEvents.map((item) => (
              <div className="bg-paper p-6" key={item.id ?? item.title}>
                <h3 className="text-card">{item.title}</h3>
                <p className="mt-3 text-meta text-copy">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Sessions and joining, side by side — the two things a new student asks */}
      <Section eyebrow="New to this?" title="Start here">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-card">Club sessions</h3>
            <div className="mt-3">
              {club.typicalSession ? (
                <RichText data={club.typicalSession} />
              ) : (
                <p className="text-meta text-muted">[SESSION DETAILS TO BE CONFIRMED]</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-card">How to join</h3>
            <div className="mt-3">
              {club.howToJoin ? (
                <RichText data={club.howToJoin} />
              ) : (
                <p className="text-meta text-muted">[JOINING DETAILS TO BE CONFIRMED]</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Upcoming events */}
      <Section className="bg-off" eyebrow="What's on" title="Upcoming events">
        {events.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard event={event} key={event.id} showClub={false} />
            ))}
          </div>
        ) : (
          <EmptyState>Nothing scheduled right now — check back after recruitment week.</EmptyState>
        )}
      </Section>

      {/* Past trips */}
      {photos.length > 0 ? (
        <Section eyebrow="Past trips" title="Where we have been">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
        </Section>
      ) : null}

      {/* Committee */}
      {people.length > 0 ? (
        <Section className="bg-off" eyebrow="Who runs it" title="The committee">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {people.map((person) => (
              <div key={person.id}>
                <div className="relative aspect-[3/4] overflow-hidden bg-accent-tint">
                  <MediaImage
                    fill
                    media={person.photo}
                    placeholderLabel={person.name}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-3 font-display text-lead uppercase">{person.name}</p>
                <p className="text-meta text-muted">{person.role}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Achievements */}
      {club.achievements?.length ? (
        <Section eyebrow="Track record" title="Achievements">
          <ul className="max-w-3xl divide-y divide-line border-y border-line">
            {club.achievements.map((item) => (
              <li className="py-4 text-body text-copy" key={item.id ?? item.text}>
                {item.text}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* FAQ */}
      {club.faqs?.length ? (
        <Section className="bg-off" eyebrow="Before you ask" title="FAQ">
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {club.faqs.map((item) => (
              <details className="group py-4" key={item.id ?? item.question}>
                <summary className="flex min-h-11 cursor-pointer items-center font-display text-lead uppercase">
                  {item.question}
                </summary>
                <p className="mt-2 text-body text-copy">{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Join CTA */}
      <section className="bg-ink-deep">
        <Container className="py-16">
          <h2 className="text-section text-paper">Come along</h2>
          <p className="mt-3 max-w-xl text-lead text-paper/80">
            You do not need to be a member to join in, and you do not need any experience. Say hello
            first and we will tell you exactly what to bring.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center bg-accent px-6 font-display text-meta tracking-button text-paper uppercase hover:opacity-90"
              href="/join"
            >
              How to join
            </Link>
            {telegramHref ? (
              <a
                className="inline-flex min-h-11 items-center border border-paper/40 px-6 font-display text-meta tracking-button text-paper uppercase hover:bg-paper/10"
                href={telegramHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Telegram
              </a>
            ) : null}
            {socials?.instagram ? (
              <a
                className="inline-flex min-h-11 items-center border border-paper/40 px-6 font-display text-meta tracking-button text-paper uppercase hover:bg-paper/10"
                href={`https://instagram.com/${socials.instagram.replace(/^@/, '')}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            ) : null}
            {socials?.website ? (
              <a
                className="inline-flex min-h-11 items-center border border-paper/40 px-6 font-display text-meta tracking-button text-paper uppercase hover:bg-paper/10"
                href={socials.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                Website
              </a>
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  )
}
