import { SearchList } from '@/components/Discovery'
import { Section } from '@/components/Section'
import { getCampaigns } from '@/lib/payload'
export const metadata = {
  title: 'Recruitment & open houses',
  alternates: { canonical: '/recruitment' },
}
export default async function Page() {
  const campaigns = await getCampaigns()
  return (
    <Section
      title="Meet your next crew"
      titleAs="h1"
      intro="Open houses, recruitment weeks and ways to get involved."
    >
      <SearchList
        items={campaigns.map((c) => ({
          id: String(c.id),
          title: c.title,
          description: c.intro,
          href: `/recruitment/${c.slug}`,
          category: 'Recruitment',
          meta: c.venue,
        }))}
        empty="No recruitment campaign is published yet. Explore the clubs or visit Join us for a direct contact."
      />
    </Section>
  )
}
