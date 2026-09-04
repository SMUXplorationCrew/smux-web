import type { Metadata } from 'next'
import { Blocks } from '@/components/Blocks'
import { EventCard } from '@/components/EventCard'
import { MediaImage } from '@/components/MediaImage'
import { PersonCard } from '@/components/PersonCard'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { Container, EmptyState, Section } from '@/components/Section'
import { getEvents, getPeople, getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Main Committee',
  description:
    'The SMUX main committee — the people who run SMUX itself, and the SMUX-wide events they organise.',
}

export default async function CommitteePage() {
  const [settings, people, allEvents] = await Promise.all([
    getSiteSettings(),
    // People with no club are the main committee, sitting above the six clubs.
    getPeople(),
    getEvents({ upcoming: true, limit: 100 }),
  ])

  const mcPeople = people.filter((p) => !p.club)
  const smuxWide = allEvents.filter((e) => !e.club)
  const copy = settings?.committee
  // The About text stands in until the committee writes an intro of its own.
  const intro = copy?.intro ?? settings?.about

  return (
    <>
      <section className="border-b border-line bg-off py-14">
        <Container>
          <p className="flex items-center gap-3 font-display text-eyebrow tracking-eyebrow text-orange-text uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-orange" />
            {copy?.eyebrow ?? 'Main Committee'}
          </p>
          <h1 className="mt-3 text-section">{copy?.title ?? 'The people behind SMUX'}</h1>
          <div className="mt-4 max-w-3xl">
            {intro ? (
              <RichText data={intro} />
            ) : (
              <p className="text-body text-copy">
                The main committee runs SMUX itself — the events that bring all six clubs together.
              </p>
            )}
          </div>
        </Container>
      </section>

      {settings?.committeePhoto ? (
        <Container className="pt-10">
          <Reveal>
            <MediaImage
              className="w-full"
              media={settings.committeePhoto}
              placeholderLabel="Main committee"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </Reveal>
        </Container>
      ) : null}

      <Section eyebrow="SMUX-wide" title={copy?.eventsTitle ?? 'Events we run'}>
        {smuxWide.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {smuxWide.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        ) : (
          <EmptyState>No SMUX-wide events coming up right now.</EmptyState>
        )}
      </Section>

      <Section className="bg-off" eyebrow="Who we are" title={copy?.peopleTitle ?? 'The committee'}>
        {mcPeople.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {mcPeople.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <EmptyState>
            Main committee photos have not been added yet. Add People in the CMS with the club left
            empty and they will appear here.
          </EmptyState>
        )}
      </Section>

      <Blocks blocks={settings?.committeeBlocks} />
    </>
  )
}
