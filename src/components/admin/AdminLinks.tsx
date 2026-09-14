import Link from 'next/link'
export function AdminLinks() {
  return (
    <div style={{ display: 'grid', gap: 12, padding: '16px 0' }}>
      <strong>SMUX workspace</strong>
      <Link href="/manage">Tasks & tools</Link>
      <Link href="/">View website</Link>
    </div>
  )
}
