import type { Metadata } from 'next'
import { CalendarGrid } from '@/components/CalendarGrid'
import { EmptyState, Section } from '@/components/Section'
import { getEvents } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Every SMUX session and trip, month by month.',
}

export default async function CalendarPage() {
  const events = await getEvents({ limit: 300 })

  /**
   * The opening month is resolved at build time. Because the page is pre-rendered, a
   * "current month" computed here would freeze to whenever the build ran — so it opens
   * on the month of the next upcoming event instead, which stays useful.
   */
  const now = new Date()
  const nextEvent = events.find((e) => e.startsAt && new Date(e.startsAt) >= now)
  const anchor = nextEvent?.startsAt ? new Date(nextEvent.startsAt) : now

  return (
    <Section eyebrow="Plan ahead" title="Calendar">
      {events.length > 0 ? (
        <CalendarGrid
          events={events}
          initialMonth={anchor.getMonth()}
          initialYear={anchor.getFullYear()}
        />
      ) : (
        <EmptyState>Nothing scheduled yet. Events will appear here once published.</EmptyState>
      )}
    </Section>
  )
}
