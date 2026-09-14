import Link from 'next/link'
import { Blocks } from '@/components/Blocks'
import { ClubCard } from '@/components/ClubCard'
import { HeroCarousel } from '@/components/HeroCarousel'
import { LiveEvents } from '@/components/LiveEvents'
import { MediaImage } from '@/components/MediaImage'
import { Container, Section } from '@/components/Section'
import { eventView } from '@/lib/event-view'
import { getClubs, getEvents, getSiteSettings, getStories } from '@/lib/payload'
export default async function HomePage() {
  const [clubs, events, settings, stories] = await Promise.all([
    getClubs(),
    getEvents(),
    getSiteSettings(),
    getStories(),
  ])
  const story = stories[0]
  return (
    <>
      <section className="relative isolate flex min-h-[min(80vh,48rem)] items-end overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <HeroCarousel images={settings.heroImages || []} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/30 to-transparent" />
        </div>
        <Container className="relative pb-24 pt-36">
          <p className="mb-4 text-lead text-paper">
            SMUXploration Crew · Singapore Management University
          </p>
          {/* The CMS carries heroHeading, motto and heroButtons, and their field
              descriptions tell editors those control this hero. They did not — the
              headline, subline and both buttons were hardcoded, so an editor changing
              them saw nothing happen. The literals below are defaults, not the source. */}
          <h1 className="max-w-4xl text-hero-sm text-paper md:text-hero">
            {settings.heroHeading || 'Your next adventure starts here.'}
          </h1>
          <p className="mt-5 max-w-xl text-lead text-paper">
            {settings.motto || 'Six clubs. A whole world outside the classroom.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(settings.heroButtons?.length
              ? settings.heroButtons
              : [
                  { id: 'default-clubs', label: 'Find your club', url: '#clubs', tone: 'primary' },
                  {
                    id: 'default-events',
                    label: "See what's on",
                    url: '/events',
                    tone: 'secondary',
                  },
                ]
            ).map((button) => (
              <Link
                key={button.id ?? button.url}
                className={
                  button.tone === 'secondary'
                    ? 'button border-paper/50 text-paper hover:bg-paper/10'
                    : 'button bg-orange text-ink'
                }
                href={button.url}
              >
                {button.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <Section
        id="clubs"
        title={settings.homeLabels?.clubsTitle || 'Find your people. Try something new.'}
        intro="From your first session to your next expedition, start with a club that interests you."
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard club={club} key={club.id} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href="/explore" className="button button-quiet">
            Help me choose
          </Link>
          <Link href="/join" className="text-meta underline underline-offset-4">
            How joining works
          </Link>
        </div>
      </Section>
      <Section
        className="bg-off"
        title="Make a plan. Get outside."
        intro="The next sessions, trips and socials across the crew."
      >
        <LiveEvents events={events.map(eventView)} initialNow={Date.now()} limit={3} />
        <div className="mt-7 flex gap-3">
          <Link className="button button-primary" href="/events">
            All events
          </Link>
          <Link className="button button-quiet" href="/calendar">
            Open calendar
          </Link>
        </div>
      </Section>
      {story ? (
        <Section title="From the crew">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <MediaImage media={story.cover} fill />
            </div>
            <div>
              <h3 className="text-section">{story.title}</h3>
              <p className="mt-5 max-w-prose text-body text-copy">{story.summary}</p>
              <Link className="button button-primary mt-6" href={`/stories/${story.slug}`}>
                Read the story
              </Link>
            </div>
          </div>
        </Section>
      ) : null}
      <Section title="A first step is all it takes.">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-card">Find a club</h3>
            <p className="mt-3 text-copy">
              Explore the activities and ask about experience, equipment and commitment.
            </p>
          </div>
          <div>
            <h3 className="text-card">Choose a session</h3>
            <p className="mt-3 text-copy">
              Check the event details, prerequisites and registration link.
            </p>
          </div>
          <div>
            <h3 className="text-card">Meet the crew</h3>
            <p className="mt-3 text-copy">
              Your club will explain what to bring and where to meet.
            </p>
          </div>
        </div>
        <Link className="button button-primary mt-8" href="/join">
          Start here
        </Link>
      </Section>
      <Blocks blocks={settings.homeBlocks} />
      <section className="bg-ink py-14 text-paper">
        <Container className="flex flex-wrap items-center justify-between gap-8">
          <p className="font-display text-section">Fun. Family. Adventure.</p>
          <Link className="button bg-orange text-ink" href="/gallery">
            Meet the crew in photos
          </Link>
        </Container>
      </section>
    </>
  )
}
