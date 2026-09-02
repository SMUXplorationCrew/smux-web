import type { Metadata } from 'next'
import { ClubCard } from '@/components/ClubCard'
import { EmptyState, Section } from '@/components/Section'
import { getClubs } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Clubs',
  description: 'The six SMUX clubs: diving, kayaking, trekking, biking, skating and XSeed.',
}

export default async function ClubsPage() {
  const clubs = await getClubs()

  return (
    <Section eyebrow="Six clubs" title="Pick your crew">
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
  )
}
