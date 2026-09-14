import Link from 'next/link'
import { redirect } from 'next/navigation'
import { resolveClubId } from '@/access'
import { LogoutButton, ReminderCancel } from '@/components/AccountTools'
import { Section } from '@/components/Section'
import { session } from '@/lib/auth'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Your account', robots: { index: false, follow: false } }
export default async function Page() {
  const { payload, user } = await session()
  if (!user) redirect('/login?returnTo=/account')
  const [registrations, interests] = await Promise.all([
    payload.find({
      collection: 'registrations',
      where: { user: { equals: user.id } },
      user,
      overrideAccess: false,
      limit: 100,
      depth: 1,
    }),
    payload.find({
      collection: 'interests',
      where: { and: [{ user: { equals: user.id } }, { active: { equals: true } }] },
      user,
      overrideAccess: false,
      limit: 100,
      depth: 1,
    }),
  ])
  return (
    <Section title={`Hello, ${user.name || 'adventurer'}`} titleAs="h1">
      <div className="flex flex-wrap gap-3">
        <Link className="button button-primary" href="/resources">
          Member resources
        </Link>
        {user.role !== 'member' && (
          <Link className="button button-quiet" href="/manage">
            Editor workspace
          </Link>
        )}
        <LogoutButton />
      </div>
      <h2 className="mt-10 text-card">Your registrations</h2>
      <ul className="divide-y divide-line">
        {registrations.docs.map((r) => (
          <li className="py-4" key={r.id}>
            {typeof r.event === 'object' ? (
              <Link className="underline" href={`/events/${r.event.slug}`}>
                {r.event.title}
              </Link>
            ) : (
              'Event'
            )}{' '}
            — {r.status}
            {r.checkedInAt ? ' · Checked in' : ''}
          </li>
        ))}
      </ul>
      {!registrations.docs.length && (
        <p className="notice mt-4">
          No registrations yet.{' '}
          <Link href="/events" className="underline">
            Find your next event.
          </Link>
        </p>
      )}
      <h2 className="mt-10 text-card">Email reminders</h2>
      <p className="text-copy">
        Reminders use your account email. You can withdraw consent below at any time.
      </p>
      <ul className="divide-y divide-line">
        {interests.docs.map((i) => (
          <li className="flex items-center justify-between gap-4 py-4" key={i.id}>
            <span>
              {typeof i.event === 'object' && i.event
                ? i.event.title
                : typeof i.club === 'object' && i.club
                  ? i.club.name
                  : 'Adventure reminder'}
            </span>
            <ReminderCancel
              eventId={Number(resolveClubId(i.event)) || undefined}
              clubId={Number(resolveClubId(i.club)) || undefined}
            />
          </li>
        ))}
      </ul>
      {!interests.docs.length && <p className="mt-4 text-copy">No active reminders.</p>}
    </Section>
  )
}
