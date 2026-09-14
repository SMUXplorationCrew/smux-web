import { SearchList } from '@/components/Discovery'
import { Section } from '@/components/Section'
import { getBenefits } from '@/lib/payload'
import { safeUrl } from '@/lib/url'
export const revalidate = 300
export const metadata = { title: 'Member benefits', alternates: { canonical: '/benefits' } }
export default async function Page() {
  const benefits = (await getBenefits()).filter(
    (b) => !b.expiresAt || Date.parse(b.expiresAt) > Date.now(),
  )
  return (
    <Section
      title="More from your membership"
      titleAs="h1"
      intro="Current offers and eligibility, maintained by the committee."
    >
      <SearchList
        items={benefits.map((b) => ({
          id: String(b.id),
          title: b.title,
          description: b.description,
          href: safeUrl(b.url) || '/contact',
          category: typeof b.club === 'object' && b.club ? b.club.name : 'SMUX',
          meta: b.eligibility,
        }))}
        empty="No current benefits have been published. Ask the committee for membership details."
      />
    </Section>
  )
}
