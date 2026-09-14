import { notFound, permanentRedirect } from 'next/navigation'
import { ClubCard } from '@/components/ClubCard'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { ShareButton } from '@/components/ShareButton'
import { canonicalSlugFor, getCampaign, getCampaigns, slugParams } from '@/lib/payload'
export async function generateStaticParams() {
  return slugParams(await getCampaigns())
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await getCampaign(slug)
  return {
    title: c?.title,
    description: c?.intro,
    alternates: { canonical: `/recruitment/${slug}` },
  }
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const campaign = await getCampaign(slug)
  if (!campaign) {
    // The address may be a slug this document used to live at.
    const canonical = await canonicalSlugFor('campaigns', slug)
    if (canonical) permanentRedirect(`/recruitment/${canonical}`)
    notFound()
  }
  return (
    <Section title={campaign.title} titleAs="h1" intro={campaign.intro}>
      <p className="text-lead">{campaign.venue}</p>
      <RichText data={campaign.body} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {campaign.clubs?.map((c) =>
          typeof c === 'object' ? <ClubCard key={c.id} club={c} /> : null,
        )}
      </div>
      <div className="mt-8">
        <ShareButton title={campaign.title} />
      </div>
    </Section>
  )
}
