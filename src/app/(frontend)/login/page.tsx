import { LoginForm } from '@/components/AccountTools'
import { Section } from '@/components/Section'
export const metadata = { title: 'Sign in', robots: { index: false, follow: false } }
export default function Page() {
  return (
    <Section title="Your SMUX account" titleAs="h1">
      <LoginForm />
    </Section>
  )
}
