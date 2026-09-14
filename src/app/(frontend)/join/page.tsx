import Link from 'next/link'
import { Blocks } from '@/components/Blocks'
import { RichText } from '@/components/RichText'
import { Section } from '@/components/Section'
import { SmartLink } from '@/components/SmartLink'
import { joinAction } from '@/lib/join'
import { getClubs, getPageBySlug } from '@/lib/payload'
export const metadata = {
  title: 'Join SMUX',
  description: 'Find your club, ask about a session and start your next adventure.',
  alternates: { canonical: '/join' },
}
export default async function Page() {
  const [page, clubs] = await Promise.all([getPageBySlug('join'), getClubs()])
  return (
    <>
      <Section
        title={page?.title || 'Find your crew. Take the first step.'}
        titleAs="h1"
        intro={
          page?.intro ||
          'Choose a club below and connect with its committee. Each activity has its own joining details.'
        }
      >
        <Link className="button button-quiet" href="/explore">
          Not sure? Find your adventure
        </Link>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => {
            const action = joinAction(c)
            return (
              <article
                key={c.id}
                className="border-t-2 border-accent py-6"
                data-club={c.accent || c.slug}
              >
                <h2 className="text-card">{c.name}</h2>
                <p className="mt-3 text-copy">{c.tagline}</p>
                <div className="my-5">
                  <RichText data={c.howToJoin} />
                </div>
                <SmartLink className="button button-primary" href={action.href}>
                  {action.label}
                </SmartLink>
                <Link className="mt-3 block py-3 underline" href={`/clubs/${c.slug}#start`}>
                  Sessions, experience and costs
                </Link>
              </article>
            )
          })}
        </div>
      </Section>
      <Blocks blocks={page?.blocks} />
    </>
  )
}
