import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Blocks } from '@/components/Blocks'
import { EventCard } from '@/components/EventCard'
import { MediaImage } from '@/components/MediaImage'
import { PersonCard } from '@/components/PersonCard'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { Container, EmptyState, Section } from '@/components/Section'
import { SmartLink } from '@/components/SmartLink'
import { SocialRow } from '@/components/SocialRow'
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

const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in (value as Media)

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) notFound()

  const [events, albums, people] = await Promise.all([
    getEvents({ clubId: club.id, upcoming: true, limit: 6 }),
    getAlbums(club.id),
    getPeople(club.id),
  ])

  /**
   * The club's own photo picks come first, then anything from its albums. Deduped by id
   * because a photo chosen here is very often also in an album, and the same face
   * appearing twice in an eight-tile strip looks like a mistake.
   */
  const chosen = (Array.isArray(club.gallery) ? club.gallery : []).filter(isMedia)
  const fromAlbums = albums
    .flatMap((album) => (Array.isArray(album.photos) ? album.photos : []))
    .filter(isMedia)
  const seen = new Set<number | string>()
  const photos = [...chosen, ...fromAlbums]
    .filter((photo) => {
      if (seen.has(photo.id)) return false
      seen.add(photo.id)
      return true
    })
    .slice(0, 8)

  const labels = club.labels
  const cta = club.joinCta
  // Falls back to counts we can always compute, rather than to a claim about the club
  // that may not be true of it.
  const quickFacts = club.quickFacts?.length
    ? club.quickFacts
    : [
        { id: 'upcoming', label: 'Upcoming events', value: String(events.length) },
        { id: 'committee', label: 'Committee', value: String(people.length) },
      ]

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
          <div className="hero-enter">
            {club.logo ? (
              <div className="relative mb-5 size-16 overflow-hidden md:size-20">
                <MediaImage fill media={club.logo} placeholderLabel="" sizes="80px" />
              </div>
            ) : null}
            <h1 className="text-hero-sm text-paper md:text-hero">{club.name}</h1>
            {club.tagline ? (
              <p className="mt-3 max-w-xl text-lead text-paper/85">{club.tagline}</p>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Quick facts */}
      <section className="border-b border-line bg-off">
        <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {quickFacts.map((fact) => (
            <div key={fact.id ?? fact.label}>
              <p className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                {fact.label}
              </p>
              <p className="text-card text-ink">{fact.value}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Who we are */}
      {club.whoWeAre ? (
        <Section eyebrow="Who we are" title={labels?.whoWeAre ?? `This is ${club.name}`}>
          <div className="max-w-3xl">
            <RichText data={club.whoWeAre} />
          </div>
        </Section>
      ) : null}

      {/* Key events — the club's signature happenings, distinct from dated events */}
      {club.keyEvents?.length ? (
        <Section
          className="bg-accent-tint"
          eyebrow="What we do"
          title={labels?.keyEvents ?? 'Key events'}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {club.keyEvents.map((item) => (
              <div
                className="border border-line/70 bg-paper p-6 transition-transform duration-200 hover:-translate-y-0.5"
                key={item.id ?? item.title}
              >
                <h3 className="text-card">{item.title}</h3>
                <p className="mt-3 text-meta text-copy">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Sessions and joining — the two things a new student asks */}
      <Section eyebrow="New to this?" title={labels?.startHere ?? 'Start here'}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
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
          {/* Both of these were fields an editor could fill in that appeared nowhere
              on the site until now. */}
          {club.beginnerNotes ? (
            <div>
              <h3 className="text-card">No experience?</h3>
              <div className="mt-3">
                <RichText data={club.beginnerNotes} />
              </div>
            </div>
          ) : null}
          {club.gearAndCost ? (
            <div>
              <h3 className="text-card">Gear and cost</h3>
              <div className="mt-3">
                <RichText data={club.gearAndCost} />
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      {/* Upcoming events */}
      <Section className="bg-off" eyebrow="What's on" title={labels?.events ?? 'Upcoming events'}>
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
        <Section eyebrow="Past trips" title={labels?.gallery ?? 'Where we have been'}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div className="relative aspect-square overflow-hidden" key={photo.id}>
                <MediaImage
                  className="transition-transform duration-500 hover:scale-[1.04]"
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
        <Section
          className="bg-off"
          eyebrow="Who runs it"
          title={labels?.committee ?? 'The committee'}
        >
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
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
              <details className="faq group py-4" key={item.id ?? item.question}>
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-display text-lead uppercase">
                  {item.question}
                  <span aria-hidden="true" className="chevron shrink-0 text-accent">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-body text-copy">{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Anything the fixed sections above do not cover, added by the club itself. */}
      <Blocks blocks={club.sections} />

      {/* Join CTA */}
      <section className="bg-ink-deep">
        <Container className="py-16">
          <Reveal>
            <h2 className="text-section text-paper">{cta?.heading || 'Come along'}</h2>
            <p className="mt-3 max-w-xl text-lead text-paper/80">
              {cta?.body ||
                'You do not need to be a member to join in, and you do not need any experience. Say hello first and we will tell you exactly what to bring.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SmartLink
                className="inline-flex min-h-11 items-center bg-accent px-6 font-display text-meta tracking-button text-paper uppercase transition-transform duration-200 hover:-translate-y-0.5"
                href={cta?.buttonUrl || '/join'}
              >
                {cta?.buttonLabel || 'How to join'}
              </SmartLink>
            </div>
            <SocialRow
              className="mt-8"
              extra={club.extraSocials}
              onDark
              socials={club.socials}
              variant="chip"
            />
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
