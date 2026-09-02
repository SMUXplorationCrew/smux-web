import type { Metadata } from 'next'
import { EventFilter } from '@/components/EventFilter'
import { EmptyState, Section } from '@/components/Section'
import { getClubs, getEvents } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Every upcoming SMUX trip, session and social across the six clubs.',
}

export default async function EventsPage() {
  const [events, clubs] = await Promise.all([getEvents({ upcoming: true, limit: 100 }), getClubs()])

  return (
    <Section eyebrow="What's on" title="Events">
      {events.length > 0 ? (
        <EventFilter clubs={clubs} events={events} />
      ) : (
        <EmptyState>
          No events have been published yet. They will appear here as clubs add them.
        </EmptyState>
      )}
    </Section>
  )
}
