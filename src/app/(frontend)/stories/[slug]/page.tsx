import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { ShareButton } from '@/components/ShareButton'
import { canonicalSlugFor, getStories, getStory, slugParams } from '@/lib/payload'
export async function generateStaticParams() {
  return slugParams(await getStories())
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getStory(slug)
  return {
    title: s?.title || 'Story not found',
    description: s?.summary,
    alternates: { canonical: `/stories/${slug}` },
  }
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) {
    // The address may be a slug this document used to live at.
    const canonical = await canonicalSlugFor('stories', slug)
    if (canonical) permanentRedirect(`/stories/${canonical}`)
    notFound()
  }
  return (
    <Section
      title={story.title}
      titleAs="h1"
      eyebrow={story.destination || 'Adventure journal'}
      intro={story.summary}
    >
      <p className="text-meta text-copy">{story.author ? `By ${story.author}` : ''}</p>
      {story.cover && (
        <div className="relative my-8 aspect-[16/9]">
          <MediaImage fill media={story.cover} sizes="100vw" priority />
        </div>
      )}
      <div className="max-w-3xl">
        <RichText data={story.body} />
      </div>
      {story.photoCredit && <p className="mt-6 text-meta text-copy">Photos: {story.photoCredit}</p>}
      <div className="mt-8 flex gap-3">
        <ShareButton title={story.title} />
        {story.album && (
          <Link
            className="button button-quiet"
            href={`/gallery/${typeof story.album === 'object' ? story.album.id : story.album}`}
          >
            View trip album
          </Link>
        )}
      </div>
    </Section>
  )
}
