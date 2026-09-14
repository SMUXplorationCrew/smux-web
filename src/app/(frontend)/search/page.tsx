import { SearchList } from '@/components/Discovery'
import { Section } from '@/components/Section'
import { getClubs, getEvents, getStories, publicDocuments } from '@/lib/payload'
export const metadata = { title: 'Search SMUX', alternates: { canonical: '/search' } }
export default async function Page() {
  const [clubs, events, stories, pages] = await Promise.all([
    getClubs(),
    getEvents(),
    getStories(),
    publicDocuments('pages'),
  ])
  return (
    <Section title="What are you looking for?" titleAs="h1">
      <SearchList
        items={[
          ...clubs.map((c) => ({
            id: `club-${c.id}`,
            title: c.name,
            description: c.tagline,
            href: `/clubs/${c.slug}`,
            category: 'Clubs',
          })),
          ...events.map((e) => ({
            id: `event-${e.id}`,
            title: e.title,
            description: e.location,
            href: `/events/${e.slug}`,
            category: 'Events',
          })),
          ...stories.map((s) => ({
            id: `story-${s.id}`,
            title: s.title,
            description: s.summary,
            href: `/stories/${s.slug}`,
            category: 'Stories',
          })),
          ...pages
            .filter((p) => ['about', 'join', 'contact'].includes(p.slug))
            .map((p) => ({
              id: `page-${p.id}`,
              title: p.title,
              href: `/${p.slug}`,
              category: 'Information',
            })),
        ]}
      />
    </Section>
  )
}
