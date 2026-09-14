import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { Section } from '@/components/Section'
import { getStories } from '@/lib/payload'
export const metadata = { title: 'Adventure stories', alternates: { canonical: '/stories' } }
export default async function Page() {
  const stories = await getStories()
  const places = stories.filter(
    (s): s is (typeof stories)[number] & { latitude: number; longitude: number } =>
      s.latitude != null && s.longitude != null,
  )
  return (
    <Section
      title="Out there, together"
      titleAs="h1"
      intro="Trip journals, useful lessons and the people behind the adventures."
    >
      {stories.length ? (
        <div className="grid gap-8 md:grid-cols-2">
          {stories.map((s) => (
            <article key={s.id}>
              {s.cover && (
                <Link
                  className="relative block aspect-[3/2] overflow-hidden"
                  href={`/stories/${s.slug}`}
                >
                  <MediaImage media={s.cover} fill sizes="(max-width:768px) 100vw,50vw" />
                </Link>
              )}
              <p className="mt-4 text-meta text-accent-text">{s.destination || 'SMUX stories'}</p>
              <h2 className="mt-1 text-card">
                <Link href={`/stories/${s.slug}`}>{s.title}</Link>
              </h2>
              <p className="mt-2 text-copy">{s.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="notice">
          The next chapter is being written.{' '}
          <Link className="underline" href="/gallery">
            Explore past adventures in the gallery.
          </Link>
        </div>
      )}
      {places.length > 0 && (
        <section className="mt-16">
          <h2 className="text-section">Places we’ve explored</h2>
          <div
            className="relative mt-6 aspect-[2/1] overflow-hidden border border-line bg-off"
            role="img"
            aria-label="World map of published trip destinations"
          >
            <svg
              viewBox="0 0 360 180"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <title>Destination coordinates</title>
              {[30, 60, 90, 120, 150].map((y) => (
                <path key={y} d={`M0 ${y}H360`} stroke="#d8d1cb" />
              ))}
              {[60, 120, 180, 240, 300].map((x) => (
                <path key={x} d={`M${x} 0V180`} stroke="#d8d1cb" />
              ))}
            </svg>
            {places.map((s) => (
              <Link
                key={s.id}
                href={`/stories/${s.slug}`}
                title={s.destination || s.title}
                aria-label={s.destination || s.title}
                className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{
                  left: `${((s.longitude + 180) / 360) * 100}%`,
                  top: `${((90 - s.latitude) / 180) * 100}%`,
                }}
              >
                <span className="size-3 rounded-full bg-orange ring-2 ring-ink" />
              </Link>
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-5">
            {places.map((s) => (
              <li key={s.id}>
                <Link className="underline" href={`/stories/${s.slug}`}>
                  {s.destination || s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Section>
  )
}
