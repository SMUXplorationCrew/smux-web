import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { Blocks } from '@/components/Blocks'
import { LiveEvents } from '@/components/LiveEvents'
import { MediaImage } from '@/components/MediaImage'
import { PersonCard } from '@/components/PersonCard'
import { PhotoGallery } from '@/components/PhotoGallery'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { Container, Section } from '@/components/Section'
import { SaveButton } from '@/components/Shortlist'
import { SmartLink } from '@/components/SmartLink'
import { SocialRow } from '@/components/SocialRow'
import { eventLifecycle } from '@/lib/event-time'
import { eventView } from '@/lib/event-view'
import { joinAction } from '@/lib/join'
import {
  canonicalSlugFor,
  getAlbums,
  getClubBySlug,
  getClubs,
  getEvents,
  getPeople,
  slugParams,
} from '@/lib/payload'
import type { Media } from '@/payload-types'

/** Pre-renders all six club pages at build time. Nothing is fetched per request. */
export async function generateStaticParams() {
  return slugParams(await getClubs())
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) return { title: 'Club not found' }

  return {
    title: club.name,
    description: club.tagline ?? undefined,
    alternates: { canonical: `/clubs/${slug}` },
  }
}

const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in (value as Media)

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = await getClubBySlug(slug)
  if (!club) {
    // The address may be a slug this document used to live at.
    const canonical = await canonicalSlugFor('clubs', slug)
    if (canonical) permanentRedirect(`/clubs/${canonical}`)
    notFound()
  }

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
  const action = joinAction(club)
  // Falls back to counts we can always compute, rather than to a claim about the club
  // that may not be true of it.
  const quickFacts = club.quickFacts?.length
    ? club.quickFacts
    : [
        {
          id: 'upcoming',
          label: 'Upcoming events',
          value: String(
            events.filter((e) => ['upcoming', 'ongoing'].includes(eventLifecycle(e))).length,
          ),
        },
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
            <div className="mt-6 flex flex-wrap gap-3">
              <SmartLink className="button button-primary" href={action.href}>
                {action.label}
              </SmartLink>
              <SaveButton kind="club" id={club.id} />
            </div>
            {club.tagline ? (
              <p className="mt-3 max-w-xl text-lead text-paper/85">{club.tagline}</p>
            ) : null}
          </div>
        </Container>
      </section>

      <nav
        aria-label="On this club page"
        className="sticky top-0 z-20 border-b border-line bg-paper"
      >
        <Container className="flex flex-wrap gap-2 py-2">
          {[
            ['start', 'Start here'],
            ['events', 'Events'],
            ['photos', 'Photos'],
            ['committee', 'Committee'],
            ['join', 'Join'],
          ].map(([id, label]) => (
            <a className="button button-quiet" key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </Container>
      </nav>
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
      <Section id="start" eyebrow="New to this?" title={labels?.startHere ?? 'Start here'}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-card">Club sessions</h3>
            <div className="mt-3">
              {club.typicalSession ? (
                <RichText data={club.typicalSession} />
              ) : (
                <p className="text-meta text-muted">
                  Ask the club for its current session schedule.
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-card">How to join</h3>
            <div className="mt-3">
              {club.howToJoin ? (
                <RichText data={club.howToJoin} />
              ) : (
                <p className="text-meta text-muted">
                  Use the contact below to ask about the next opportunity to join.
                </p>
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
      <Section
        id="events"
        className="bg-off"
        eyebrow="What's on"
        title={labels?.events ?? 'Upcoming events'}
      >
        <LiveEvents events={events.map(eventView)} initialNow={Date.now()} limit={6} />
      </Section>

      {/* Past trips */}
      {photos.length > 0 ? (
        <Section id="photos" eyebrow="Past trips" title={labels?.gallery ?? 'Where we have been'}>
          <PhotoGallery photos={photos} />
        </Section>
      ) : null}

      {/* Committee */}
      {people.length > 0 ? (
        <Section
          className="bg-off"
          id="committee"
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
      <section id="join" className="bg-ink-deep">
        <Container className="py-16">
          <Reveal>
            <h2 className="text-section text-paper">{cta?.heading || 'Come along'}</h2>
            <p className="mt-3 max-w-xl text-lead text-paper/80">
              {cta?.body ||
                'Ask the club about its next session, eligibility, costs and what to bring.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SmartLink
                className="inline-flex min-h-11 items-center bg-accent-text px-6 font-display text-meta tracking-button text-paper uppercase transition-transform duration-200 hover:-translate-y-0.5"
                href={action.href}
              >
                {action.label}
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
