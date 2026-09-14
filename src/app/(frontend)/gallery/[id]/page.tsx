import { notFound } from 'next/navigation'
import { PhotoGallery } from '@/components/PhotoGallery'
import { Section } from '@/components/Section'
import { getAlbum, getAlbums } from '@/lib/payload'
import type { Media } from '@/payload-types'
export async function generateStaticParams() {
  return (await getAlbums()).map((a) => ({ id: String(a.id) }))
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const a = await getAlbum(Number(id))
  return { title: a?.title || 'Album', alternates: { canonical: `/gallery/${id}` } }
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const album = await getAlbum(Number(id))
  if (!album) notFound()
  const photos = (album.photos || []).filter((p): p is Media => typeof p === 'object' && p !== null)
  return (
    <Section title={album.title} titleAs="h1" intro={album.summary}>
      {photos.length ? (
        <PhotoGallery photos={photos} />
      ) : (
        <p className="notice">Photos are being selected for this album.</p>
      )}
      {album.photoCredit && <p className="mt-6 text-meta">Photos: {album.photoCredit}</p>}
    </Section>
  )
}
