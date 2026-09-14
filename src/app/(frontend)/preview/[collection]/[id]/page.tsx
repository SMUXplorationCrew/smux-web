import { notFound, redirect } from 'next/navigation'
import { resolveClubId } from '@/access'
import { Blocks } from '@/components/Blocks'
import { EditorialPage } from '@/components/EditorialPage'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { session } from '@/lib/auth'
import { formatEventWhen } from '@/lib/format'
export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Private content preview',
  robots: { index: false, follow: false },
}
export default async function Page({
  params,
}: {
  params: Promise<{ collection: string; id: string }>
}) {
  const { collection, id } = await params
  const { payload, user } = await session()
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(`/preview/${collection}/${id}`)}`)
  if (
    user.role === 'member' ||
    !['clubs', 'events', 'pages', 'stories', 'campaigns'].includes(collection)
  )
    notFound()
  const preview = async <T extends 'clubs' | 'events' | 'pages' | 'stories' | 'campaigns'>(
    name: T,
  ) => {
    const doc = await payload
      .findByID({
        collection: name,
        id: Number(id),
        draft: true,
        user,
        overrideAccess: false,
        depth: 2,
      })
      .catch(() => null)
    if (!doc) notFound()
    if (user.role !== 'mc') {
      const owner = name === 'clubs' ? doc.id : 'club' in doc ? resolveClubId(doc.club) : null
      if (owner === null || owner !== resolveClubId(user.club)) notFound()
    }
    return doc
  }
  let content: React.ReactNode = null
  if (collection === 'pages') {
    const d = await preview('pages')
    content = <EditorialPage page={d} fallbackTitle="Page" fallbackNote="" />
  }
  if (collection === 'events') {
    const d = await preview('events')
    content = (
      <Section
        title={d.title}
        titleAs="h1"
        intro={formatEventWhen(d.startsAt, d.endsAt, d.timeTbc)}
      >
        {d.cover && <MediaImage media={d.cover} />}
        <RichText data={d.description} />
        <dl className="my-6">
          <dt>Location</dt>
          <dd>{d.location || 'To be confirmed'}</dd>
          <dt>Cost</dt>
          <dd>{d.cost || 'To be confirmed'}</dd>
        </dl>
        <RichText data={d.itinerary} />
        <RichText data={d.packingList} />
      </Section>
    )
  }
  if (collection === 'clubs') {
    const d = await preview('clubs')
    content = (
      <div data-club={d.accent || d.slug}>
        <Section title={d.name} titleAs="h1" intro={d.tagline}>
          {d.hero && <MediaImage media={d.hero} />}
          <RichText data={d.whoWeAre} />
          <h2 className="mt-8 text-card">Sessions</h2>
          <RichText data={d.typicalSession} />
          <h2 className="mt-8 text-card">Joining</h2>
          <RichText data={d.howToJoin} />
          <RichText data={d.beginnerNotes} />
          <RichText data={d.gearAndCost} />
        </Section>
        <Blocks blocks={d.sections} />
      </div>
    )
  }
  if (collection === 'stories') {
    const d = await preview('stories')
    content = (
      <Section title={d.title} titleAs="h1" intro={d.summary}>
        {d.cover && <MediaImage media={d.cover} />}
        <RichText data={d.body} />
      </Section>
    )
  }
  if (collection === 'campaigns') {
    const d = await preview('campaigns')
    content = (
      <Section title={d.title} titleAs="h1" intro={d.intro}>
        <RichText data={d.body} />
      </Section>
    )
  }
  return (
    <>
      <div className="notice m-5">
        Private draft preview. Refresh after saving to see the latest changes.{' '}
        <a className="underline" href={`/admin/collections/${collection}/${id}`}>
          Return to editor
        </a>
      </div>
      {content}
    </>
  )
}
