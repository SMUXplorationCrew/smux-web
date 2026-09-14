import Link from 'next/link'
import { SearchList } from '@/components/Discovery'
import { Section } from '@/components/Section'
import { session } from '@/lib/auth'
import { safeUrl } from '@/lib/url'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Member resources', robots: { index: false, follow: false } }
export default async function Page() {
  const { payload, user } = await session()
  if (!user)
    return (
      <Section
        title="Member resources"
        titleAs="h1"
        intro="Safety briefs, packing lists and useful documents for your next adventure."
      >
        <Link className="button button-primary" href="/login?returnTo=/resources">
          Sign in to view resources
        </Link>
      </Section>
    )
  const docs = []
  for (let page = 1; ; page++) {
    const result = await payload.find({
      collection: 'resources',
      user,
      overrideAccess: false,
      limit: 100,
      page,
      depth: 1,
      sort: '-updatedAt',
    })
    docs.push(...result.docs)
    if (!result.hasNextPage) break
  }
  return (
    <Section title="Ready for your next adventure" titleAs="h1" eyebrow="Member resources">
      <SearchList
        label="Find a resource"
        items={docs.flatMap((r) => {
          const href = safeUrl(r.url)
          return href
            ? [
                {
                  id: String(r.id),
                  title: r.title,
                  description: r.description,
                  href,
                  category: r.category || 'other',
                  meta: [typeof r.club === 'object' && r.club ? r.club.name : 'All clubs', r.ay]
                    .filter(Boolean)
                    .join(' · '),
                },
              ]
            : []
        })}
      />
      <Link className="button button-quiet mt-8" href="/account">
        Your account
      </Link>
    </Section>
  )
}
