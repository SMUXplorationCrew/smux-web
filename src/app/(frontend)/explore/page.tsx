import { AdventureFinder } from '@/components/Discovery'
import { Section } from '@/components/Section'
import { getClubs } from '@/lib/payload'
export const metadata = {
  title: 'Find your adventure',
  description: 'Compare SMUX clubs and find an activity that fits your interests.',
  alternates: { canonical: '/explore' },
}
export default async function Page() {
  return (
    <Section
      title="Find your kind of adventure"
      titleAs="h1"
      intro="Six ways to get outside. Start with what excites you."
    >
      <AdventureFinder clubs={await getClubs()} />
    </Section>
  )
}
