import Link from 'next/link'
import { Blocks } from '@/components/Blocks'
import { ClubCard } from '@/components/ClubCard'
import { EventCard } from '@/components/EventCard'
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/Reveal'
import { Container, EmptyState, Section } from '@/components/Section'
import { SmartLink } from '@/components/SmartLink'
import { SocialRow } from '@/components/SocialRow'
import { getClubs, getEvents, getSiteSettings } from '@/lib/payload'

/** The buttons the hero ships with, used until the committee sets their own. */
const DEFAULT_BUTTONS = [
  { label: 'Join us', url: '/join', tone: 'primary' as const, id: 'default-join' },
  { label: 'What’s on', url: '/events', tone: 'secondary' as const, id: 'default-events' },
]

export default async function HomePage() {
  const [settings, clubs, events] = await Promise.all([
    getSiteSettings(),
    getClubs(),
    getEvents({ upcoming: true, limit: 6 }),
  ])

  const heroImages = Array.isArray(settings?.heroImages) ? settings.heroImages : []
  const mottoWords = settings?.mottoWords ?? []
  const labels = settings?.homeLabels
  const buttons = settings?.heroButtons?.length ? settings.heroButtons : DEFAULT_BUTTONS

  return (
    <>
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink-deep">
        <div className="absolute inset-0">
          <HeroCarousel images={heroImages} placeholderLabel="SMUX" />
          {/* Sits above the carousel so the headline stays legible on every frame. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/50 to-ink-deep/20" />
        </div>

        <Container className="relative py-16">
          <div className="hero-enter">
            <h1 className="max-w-4xl text-hero-sm text-paper md:text-hero">
              {settings?.heroHeading ?? 'SMUXploration Crew'}
            </h1>
            <p className="mt-4 max-w-xl text-lead text-paper/85">
              {settings?.motto ?? 'Six clubs. One crew. Get outside.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {buttons.map((button) => (
                <SmartLink
                  className={`inline-flex min-h-11 items-center px-6 font-display text-meta tracking-button uppercase transition-transform duration-200 hover:-translate-y-0.5 ${
                    button.tone === 'secondary'
                      ? 'border border-paper/40 text-paper hover:bg-paper/10'
                      : 'bg-orange text-ink'
                  }`}
                  href={button.url}
                  key={button.id ?? button.url}
                >
                  {button.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {settings?.stats?.length ? (
        <section className="border-b border-line bg-off">
          <Container className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
            {settings.stats.map((stat, index) => (
              <Reveal delay={index * 60} key={stat.id ?? stat.label}>
                <p className="font-display text-section text-ink tabular-nums">{stat.value}</p>
                <p className="text-meta text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </Container>
        </section>
      ) : null}

      {mottoWords.length > 0 ? (
        <Section className="bg-off" eyebrow="Our motto">
          <div className="flex flex-col gap-1">
            {mottoWords.map((m, i) => (
              <p
                className={`font-display text-hero-sm leading-[0.9] uppercase md:text-hero ${
                  // Alternating emphasis, so three words read as one composed block
                  // rather than a list.
                  i % 2 === 0 ? 'text-ink' : 'text-orange-text'
                }`}
                key={m.id ?? m.word}
              >
                {m.word}
              </p>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        eyebrow={labels?.clubsEyebrow ?? 'Six clubs'}
        title={labels?.clubsTitle ?? 'Find your thing'}
      >
        {clubs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard club={club} key={club.id} />
            ))}
          </div>
        ) : (
          <EmptyState>The six clubs will appear here once they are added in the CMS.</EmptyState>
        )}
      </Section>

      <Section
        className="bg-off"
        eyebrow={labels?.eventsEyebrow ?? "What's on"}
        title={labels?.eventsTitle ?? 'Upcoming'}
      >
        {events.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
            <Link
              className="group mt-8 inline-flex min-h-11 items-center font-display text-meta tracking-button text-orange-text uppercase"
              href="/events"
            >
              All events
              <span aria-hidden="true" className="arrow ml-2 inline-block">
                &rarr;
              </span>
            </Link>
          </>
        ) : (
          <EmptyState>No upcoming events yet. Check the calendar for what is planned.</EmptyState>
        )}
      </Section>

      <Blocks blocks={settings?.homeBlocks} />

      <Section title={labels?.socialsTitle ?? 'And more from our socials'}>
        <SocialRow extra={settings?.extraSocials} socials={settings?.socials} variant="chip" />
      </Section>
    </>
  )
}
