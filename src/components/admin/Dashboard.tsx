import Link from 'next/link'
export function Dashboard() {
  return (
    <section
      style={{
        padding: '24px',
        marginBottom: '24px',
        borderLeft: '4px solid #f4751f',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <h2>Your next adventure starts here.</h2>
      <p>
        Review upcoming events, check publishing readiness, import a schedule or prepare the next
        committee.
      </p>
      <Link href="/manage">Open your SMUX workspace</Link>
    </section>
  )
}
