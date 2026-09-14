'use client'
import { useFormFields } from '@payloadcms/ui'
import { eventReadiness } from '@/lib/readiness'
import type { Event } from '@/payload-types'
export function Readiness() {
  const values = useFormFields(([fields]) =>
    Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value])),
  )
  const issues = eventReadiness(values as Partial<Event>)
  return (
    <section
      aria-label="Publishing readiness"
      style={{ padding: '1rem', border: '1px solid var(--theme-elevation-200)' }}
    >
      <h3>Publishing readiness</h3>
      {issues.length ? (
        <ul>
          {issues.map((issue) => (
            <li key={issue.field}>
              <strong>{issue.severity === 'error' ? 'Fix required: ' : ''}</strong>
              {issue.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>Core event information is ready. Preview before publishing.</p>
      )}
    </section>
  )
}
