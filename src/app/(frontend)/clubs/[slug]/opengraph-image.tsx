import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'
import { getClubBySlug, getClubs } from '@/lib/payload'

export const alt = 'SMUX club'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const clubs = await getClubs()
  return clubs.map((club) => ({ slug: club.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const club = await getClubBySlug(slug)

  return ogImage({
    eyebrow: 'SMUX',
    title: club?.name ?? 'SMUX',
    meta: club?.tagline ?? undefined,
    accent: club?.accent ?? club?.slug,
  })
}
