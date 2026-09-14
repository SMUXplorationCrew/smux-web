import type { Metadata } from 'next'
import { CalendarGrid } from '@/components/CalendarGrid'
import { Section } from '@/components/Section'
import { eventView } from '@/lib/event-view'
import { sgDateKey } from '@/lib/format'
import { getEvents } from '@/lib/payload'
export const metadata: Metadata = {
  title: 'Calendar',
  description:
    'Plan your next SMUX activity. Singapore dates, club filters and calendar subscriptions.',
  alternates: { canonical: '/calendar' },
}
export default async function CalendarPage() {
  const events = await getEvents()
  const now = Date.now()
  const [year, month] = sgDateKey(new Date(now)).split('-').map(Number)
  return (
    <Section title="Make room for adventure" titleAs="h1">
      <CalendarGrid
        events={events.map(eventView)}
        initialNow={now}
        initialYear={year}
        initialMonth={month - 1}
      />
    </Section>
  )
}
