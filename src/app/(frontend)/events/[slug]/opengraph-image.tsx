import { formatEventWhen } from '@/lib/format'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'
import { getEventBySlug, getEvents } from '@/lib/payload'
import type { Club } from '@/payload-types'

export const alt = 'SMUX event'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const events = await getEvents({ limit: 500 })
  return events.map((event) => ({ slug: event.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  const club =
    event && typeof event.club === 'object' && event.club !== null ? (event.club as Club) : null

  return ogImage({
    // A club-less event is run by the main committee for all of SMUX.
    eyebrow: club?.name ?? 'SMUX',
    title: event?.title ?? 'SMUX event',
    meta: event ? formatEventWhen(event.startsAt, event.endsAt, event.timeTbc) : undefined,
    accent: club?.accent ?? club?.slug,
  })
}
