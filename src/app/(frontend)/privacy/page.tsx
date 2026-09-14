import { Section } from '@/components/Section'
export const metadata = { title: 'Privacy & your data', alternates: { canonical: '/privacy' } }
export default function Page() {
  return (
    <Section title="Your data on SMUX" titleAs="h1">
      <div className="grid max-w-3xl gap-6 text-copy">
        <p>
          Saved adventures use local storage in this browser. Signing in uses an authentication
          cookie. The site does not use advertising trackers.
        </p>
        <h2 className="text-card">Accounts and participation</h2>
        <p>
          Invited accounts store your email, name, access role and club assignment. Native event
          registration stores your place or waitlist status and check-in time. Your event organizers
          and the main committee can access the records needed to run their events.
        </p>
        <h2 className="text-card">Reminders and enquiries</h2>
        <p>
          Email reminders require your opt-in. Unsubscribe in your account. Contact messages are
          visible to the selected committee. Avoid including sensitive personal or medical
          information in website forms.
        </p>
        <h2 className="text-card">Aggregate usage</h2>
        <p>
          Where enabled, club views, signup clicks, calendar downloads and recruitment views are
          counted by day without storing visitor identifiers. Request rate limits use short-lived
          hashes and expire after two minutes. Aggregate metrics are retained for up to 13 months.
        </p>
        <h2 className="text-card">Questions or corrections</h2>
        <p>
          Use the{' '}
          <a className="underline" href="/contact">
            committee contacts
          </a>{' '}
          to request corrections or account removal. Club photographs and stories should be
          published with the participants’ permission. Report any photograph you would like
          reviewed.
        </p>
      </div>
    </Section>
  )
}
