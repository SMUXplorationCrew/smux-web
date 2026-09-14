import { PersonCard } from '@/components/PersonCard'
import { Section } from '@/components/Section'
import { publicDocuments } from '@/lib/payload'
export const metadata = {
  title: 'Committee archive',
  alternates: { canonical: '/committee/archive' },
}
export default async function Page() {
  const people = await publicDocuments(
    'people',
    { archived: { not_equals: true } },
    1,
    'displayOrder',
  )
  const years = [...new Set(people.map((p) => p.ay).filter(Boolean))].sort().reverse()
  return (
    <Section title="The crews that got us here" titleAs="h1">
      {years.map((year) => (
        <section key={year} className="mb-12">
          <h2 className="mb-6 text-card">{year}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {people
              .filter((p) => p.ay === year)
              .map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
          </div>
        </section>
      ))}
      {!years.length && (
        <p className="notice">Committee history will appear as records are published.</p>
      )}
    </Section>
  )
}
