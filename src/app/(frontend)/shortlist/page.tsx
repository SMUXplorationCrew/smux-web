import { Section } from '@/components/Section'
import { Shortlist } from '@/components/Shortlist'
import { getClubs, getEvents } from '@/lib/payload'
export const metadata = { title: 'Saved adventures', robots: { index: false, follow: true } }
export default async function Page() {
  const [events, clubs] = await Promise.all([getEvents(), getClubs()])
  return (
    <Section title="Your next adventures" titleAs="h1">
      <Shortlist events={events} clubs={clubs} />
    </Section>
  )
}
