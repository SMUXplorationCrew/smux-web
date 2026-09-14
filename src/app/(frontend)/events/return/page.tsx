import { notFound, redirect } from 'next/navigation'
import { publicDocuments } from '@/lib/payload'
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
}) {
  const { event } = await searchParams
  const doc = (await publicDocuments('events', { id: { equals: Number(event) || 0 } }))[0]
  if (!doc) notFound()
  redirect(`/events/${doc.slug}`)
}
