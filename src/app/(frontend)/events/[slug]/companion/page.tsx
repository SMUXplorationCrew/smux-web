import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NativeRegistration } from '@/components/AccountTools'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { formatEventWhen } from '@/lib/format'
import { getEventBySlug, getEvents } from '@/lib/payload'
export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }))
}
export const metadata = { title: 'Event companion', robots: { index: false, follow: true } }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = await getEventBySlug(slug)
  if (!e) notFound()
  return (
    <Section title={e.title} titleAs="h1" eyebrow="Your event companion">
      <p className="text-lead">{formatEventWhen(e.startsAt, e.endsAt, e.timeTbc)}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {(
          [
            ['Meet here', e.location],
            ['Contact', e.organizerContact],
            ['Plan', e.itinerary],
            ['Packing list', e.packingList],
            ['Before you go', e.prerequisites],
          ] as const
        ).map(([label, value]) => (
          <section className="workspace-panel" key={label}>
            <h2 className="text-card">{label}</h2>
            <div className="mt-3">
              {typeof value === 'object' && value ? (
                <RichText data={value} />
              ) : (
                <p className="whitespace-pre-line">{value || 'Confirm with your organizer.'}</p>
              )}
            </div>
          </section>
        ))}
      </div>
      {e.registrationMode === 'native' && (
        <div className="mt-8 max-w-md">
          <NativeRegistration eventId={e.id} />
        </div>
      )}
      <Link className="button button-quiet mt-8" href={`/events/${slug}`}>
        Full event details
      </Link>
    </Section>
  )
}
