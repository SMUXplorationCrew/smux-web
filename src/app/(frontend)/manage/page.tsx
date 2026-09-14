import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Where } from 'payload'
import { resolveClubId } from '@/access'
import { LogoutButton } from '@/components/AccountTools'
import { Workspace } from '@/components/admin/Workspace'
import { Section } from '@/components/Section'
import { session } from '@/lib/auth'
import { eventReadiness } from '@/lib/readiness'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Editor workspace', robots: { index: false, follow: false } }
export default async function Page() {
  const { payload, user } = await session()
  if (!user) redirect('/login?returnTo=/manage')
  if (user.role === 'member') redirect('/account')
  const isMc = user.role === 'mc'
  const clubId = resolveClubId(user.club)
  const where: Where = isMc ? {} : { club: { equals: clubId } }
  const [events, clubs, jobs, metrics] = await Promise.all([
    payload.find({
      collection: 'events',
      where,
      user,
      overrideAccess: false,
      draft: true,
      limit: 200,
      depth: 1,
      sort: '-updatedAt',
    }),
    payload.find({
      collection: 'clubs',
      where: isMc ? {} : { id: { equals: clubId } },
      user,
      overrideAccess: false,
      limit: 20,
      depth: 0,
    }),
    payload.count({
      collection: 'publish-jobs',
      where: { and: [where, { state: { in: ['failed', 'pending'] } }] },
      user,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'metrics',
      where,
      user,
      overrideAccess: false,
      limit: 100,
      depth: 0,
      sort: '-day',
    }),
  ])
  const issues = events.docs.flatMap((e) => eventReadiness(e))
  return (
    <Section
      title={isMc ? 'SMUX master control' : `${clubs.docs[0]?.name || 'Club'} workspace`}
      titleAs="h1"
      intro="Keep the next adventure accurate, welcoming and ready to publish."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <Link className="button button-primary" href="/admin">
          Full CMS
        </Link>
        <Link className="button button-quiet" href="/">
          View website
        </Link>
        <LogoutButton />
      </div>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Events', events.totalDocs],
          ['Readiness items', issues.length],
          ['Publication jobs needing attention', jobs.totalDocs],
          [
            'Recorded interactions (latest 100 counters)',
            metrics.docs.reduce((n, m) => n + (m.count || 0), 0),
          ],
        ].map(([label, value]) => (
          <div className="workspace-panel" key={label}>
            <p className="text-meta text-copy">{label}</p>
            <p className="mt-2 font-display text-section">{value}</p>
          </div>
        ))}
      </div>
      {events.hasNextPage && (
        <p className="notice mb-6">
          Showing the 200 most recently edited events. The full CMS has pagination and all older
          records.
        </p>
      )}
      <Workspace
        isMc={isMc}
        clubs={clubs.docs.map((c) => ({ id: c.id, name: c.name }))}
        events={events.docs.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          clubName: typeof e.club === 'object' && e.club ? e.club.name : 'SMUX',
          status: e._status || 'draft',
          issues: eventReadiness(e).map((i) => i.message),
          startsAt: e.startsAt,
        }))}
      />
    </Section>
  )
}
