import type { Metadata } from 'next'
import { headers as nextHeaders } from 'next/headers'
import Link from 'next/link'
import { Container, EmptyState, Section } from '@/components/Section'
import { getPayloadClient } from '@/lib/payload'
import type { Club, Resource } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Resources',
  robots: { index: false, follow: false },
}

/**
 * The single deliberate exception to the pre-render rule.
 *
 * Everything else on this site is static, but a cached members-only page would be
 * handed to whoever asked for it next. This route reads the signed-in user per request
 * and must never be stored, so it is explicitly dynamic.
 */
export const dynamic = 'force-dynamic'

/**
 * Resolves the signed-in user, treating any failure as "not signed in".
 *
 * Failing closed is the only safe direction here: if the database is unreachable we
 * must never fall through to rendering members-only material, and a signed-out prompt
 * is a better answer than a 500.
 */
const currentUser = async () => {
  try {
    const payload = await getPayloadClient()
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    return { payload, user }
  } catch (error) {
    console.warn(
      '[resources] auth check failed, treating as signed out:',
      (error as Error)?.message,
    )
    return { payload: null, user: null }
  }
}

export default async function ResourcesPage() {
  const { payload, user } = await currentUser()

  if (!user || !payload) {
    return (
      <Section eyebrow="Members only" title="Resources">
        <div className="max-w-2xl">
          <p className="text-body text-copy">
            This area is for SMUX members. Sign in with your SMUX account to see safety briefs,
            packing lists and committee handovers.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center bg-orange px-6 font-display text-meta tracking-button text-ink uppercase hover:opacity-90"
            href="/admin/login"
          >
            Sign in
          </Link>
        </div>
      </Section>
    )
  }

  // Access control does the filtering: `read` on resources requires a signed-in user,
  // and the query runs as that user rather than as an unrestricted admin.
  const { docs } = await payload.find({
    collection: 'resources',
    limit: 200,
    depth: 2,
    sort: '-updatedAt',
    user,
    overrideAccess: false,
  })

  const resources = docs as Resource[]

  return (
    <Section eyebrow="Members only" title="Resources">
      <Container className="px-0">
        <p className="text-meta text-muted">
          Signed in as {user.email}. {resources.length} item
          {resources.length === 1 ? '' : 's'} available.
        </p>
      </Container>

      <div className="mt-8">
        {resources.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">
            {resources.map((resource) => {
              const club =
                typeof resource.club === 'object' && resource.club !== null
                  ? (resource.club as Club)
                  : null

              return (
                <li data-club={club?.accent ?? club?.slug} key={resource.id}>
                  <a
                    className="flex min-h-11 flex-col gap-1 py-4 hover:bg-off"
                    href={resource.url ?? '#'}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="font-display text-lead uppercase">{resource.title}</span>
                    {resource.description ? (
                      <span className="text-meta text-copy">{resource.description}</span>
                    ) : null}
                    <span className="font-display text-eyebrow tracking-eyebrow text-accent-text uppercase">
                      {club?.name ?? 'All clubs'}
                      {resource.ay ? ` · ${resource.ay}` : ''}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState>No resources have been uploaded yet.</EmptyState>
        )}
      </div>
    </Section>
  )
}
