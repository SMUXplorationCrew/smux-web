import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InterestButton, NativeRegistration } from '@/components/AccountTools'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Container, Section } from '@/components/Section'
import { ShareButton } from '@/components/ShareButton'
import { SaveButton } from '@/components/Shortlist'
import { SignupButton } from '@/components/SignupButton'
import { formatEventWhen } from '@/lib/format'
import { getEventBySlug, getEvents } from '@/lib/payload'
import { absolute } from '@/lib/site'
import { httpUrl } from '@/lib/url'
export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = await getEventBySlug(slug)
  return {
    title: e?.title || 'Event not found',
    description: e?.location || undefined,
    alternates: { canonical: `/events/${slug}` },
  }
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()
  const club = typeof event.club === 'object' ? event.club : null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.timeTbc ? event.startsAt.slice(0, 10) : event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventStatus: event.cancelled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    url: absolute(`/events/${slug}`),
    ...(event.location ? { location: { '@type': 'Place', name: event.location } } : {}),
    ...(club
      ? {
          organizer: {
            '@type': 'Organization',
            name: club.name,
            url: absolute(`/clubs/${club.slug}`),
          },
        }
      : {}),
  }
  return (
    <div data-club={club?.accent || club?.slug}>
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
      <section
        className={`relative overflow-hidden ${event.cover ? 'bg-ink-deep text-paper' : 'border-b border-line bg-off'}`}
      >
        {event.cover && (
          <div className="absolute inset-0">
            <MediaImage fill media={event.cover} priority sizes="100vw" />
            <div className="absolute inset-0 bg-ink-deep/65" />
          </div>
        )}
        <Container className="relative py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-meta">
            <Link className="underline" href="/events">
              Events
            </Link>
            {club && (
              <>
                {' '}
                /{' '}
                <Link className="underline" href={`/clubs/${club.slug}`}>
                  {club.name}
                </Link>
              </>
            )}
          </nav>
          <h1 className="max-w-4xl text-hero-sm">{event.title}</h1>
          <p className="mt-5 text-lead">
            {formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SaveButton kind="event" id={event.id} />
            <ShareButton title={event.title} />
          </div>
        </Container>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {event.cancelled && (
              <p className="notice mb-8">
                This event has been cancelled. {event.cancellationReason}
              </p>
            )}
            {event.description ? (
              <RichText data={event.description} />
            ) : (
              <p className="text-copy">
                The organizer is preparing the full event details. Check the information here before
                making plans.
              </p>
            )}
            {(
              [
                ['Before you join', event.prerequisites],
                ['The plan', event.itinerary],
                ['What to bring', event.packingList],
              ] as const
            ).map(([title, body]) =>
              body ? (
                <section className="mt-10" key={title}>
                  <h2 className="text-card">{title}</h2>
                  <div className="mt-3">
                    {typeof body === 'string' ? (
                      <p className="whitespace-pre-line text-copy">{body}</p>
                    ) : (
                      <RichText data={body} />
                    )}
                  </div>
                </section>
              ) : null,
            )}
            <div className="mt-10">
              <InterestButton eventId={event.id} />
            </div>
          </div>
          <aside className="h-fit border border-line bg-off p-6 lg:sticky lg:top-24">
            <h2 className="text-card">Plan your day</h2>
            <dl className="mt-5 grid gap-4">
              {[
                ['When', formatEventWhen(event.startsAt, event.endsAt, event.timeTbc)],
                ['Where', event.location || 'Location to be confirmed'],
                ['Cost', event.cost || 'Cost to be confirmed'],
                ['Organizer', event.organizerContact || club?.name || 'SMUX'],
                [
                  'Capacity',
                  event.capacity == null ? 'Ask the organizer' : `${event.capacity} places`,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-meta font-semibold">{label}</dt>
                  <dd className="text-copy">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-3" id="registration">
              {event.registrationMode === 'native' ? (
                <NativeRegistration eventId={event.id} />
              ) : (
                <SignupButton event={event} className="w-full" />
              )}
              {event.registrationMode !== 'native' && !httpUrl(event.signupUrl) && (
                <p className="text-meta text-copy">The signup link has not been published yet.</p>
              )}
              <a className="button button-quiet" href={`/events/${slug}/calendar`}>
                Add to calendar
              </a>
              <Link
                className="button button-quiet"
                href={club ? `/contact#club-${club.slug}` : '/contact'}
              >
                Ask the organizer
              </Link>
              <Link className="button button-quiet" href={`/events/${slug}/companion`}>
                Event companion
              </Link>
            </div>
          </aside>
        </div>
      </Section>
      <div className="sticky-action lg:hidden">
        <a className="button button-primary w-full" href="#registration">
          Registration & details
        </a>
      </div>
    </div>
  )
}
