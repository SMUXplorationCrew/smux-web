import { InvitationForm } from '@/components/AccountTools'
import { Section } from '@/components/Section'
export const metadata = { title: 'Accept invitation', robots: { index: false, follow: false } }
export default function Page() {
  return (
    <Section
      title="You’re invited"
      titleAs="h1"
      intro="Create your SMUX account using your private invitation."
    >
      <InvitationForm />
    </Section>
  )
}
