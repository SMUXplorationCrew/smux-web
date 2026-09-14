'use client'
import Link from 'next/link'
import { useState } from 'react'
import { operate } from '@/components/AccountTools'
import type { ImportRow } from '@/lib/import-events'
export type WorkspaceEvent = {
  id: number
  title: string
  slug: string
  clubName: string
  status: string
  issues: string[]
  startsAt: string
}
type Choice = { id: number; name: string }
export function Workspace({
  events,
  clubs,
  isMc,
}: {
  events: WorkspaceEvent[]
  clubs: Choice[]
  isMc: boolean
}) {
  const [tab, setTab] = useState('Events')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [rows, setRows] = useState<ImportRow[]>([])
  const [preview, setPreview] = useState<unknown>(null)
  const [step, setStep] = useState(0)
  const run = async (data: Record<string, unknown>) => {
    setBusy(true)
    setMessage('')
    try {
      const result = await operate(data)
      setMessage(JSON.stringify(result, null, 2))
      return result
    } catch (e) {
      setMessage((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const clubSelect = (
    <label className="field">
      Club
      <select className="input" name="clubId">
        {isMc && <option value="">SMUX-wide</option>}
        {clubs.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  )
  const generic = (
    title: string,
    action: string,
    children: React.ReactNode,
    extra: Record<string, unknown> = {},
  ) => (
    <form
      className="workspace-panel grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = Object.fromEntries(new FormData(e.currentTarget))
        await run({ action, ...form, ...extra })
      }}
    >
      <h2 className="text-card">{title}</h2>
      {children}
      <button className="button button-primary" type="submit" disabled={busy}>
        {title}
      </button>
    </form>
  )
  return (
    <div>
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Workspace tools">
        {[
          'Events',
          'Create event',
          'Import',
          'Media',
          'Writing',
          'Check-in',
          ...(isMc ? ['Access & handover'] : []),
        ].map((t) => (
          <button
            type="button"
            className={`button ${tab === t ? 'button-primary' : 'button-quiet'}`}
            aria-pressed={tab === t}
            onClick={() => {
              setTab(t)
              setMessage('')
            }}
            key={t}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === 'Events' && (
        <>
          <div className="flex flex-wrap gap-3">
            {['submit-review', 'archive', ...(isMc ? ['approve'] : [])].map((action) => (
              <button
                key={action}
                className="button button-quiet"
                type="button"
                disabled={busy || !selected.length}
                onClick={() => run({ action, ids: selected })}
              >
                {action === 'submit-review'
                  ? 'Submit selected for review'
                  : action === 'approve'
                    ? 'Approve & publish selected'
                    : 'Archive selected'}
              </button>
            ))}
            <Link className="button button-quiet" href="/admin/collections/events">
              All events in CMS
            </Link>
          </div>
          <p className="mt-3 text-meta">
            {selected.length} selected. Bulk operations report each record separately. Refresh this
            page after changes.
          </p>
          <ul className="mt-5 divide-y divide-line">
            {events.map((e) => (
              <li className="py-5" key={e.id}>
                <div className="flex items-start gap-3">
                  <input
                    aria-label={`Select ${e.title}`}
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={(v) =>
                      setSelected(
                        v.target.checked
                          ? [...selected, e.id]
                          : selected.filter((id) => id !== e.id),
                      )
                    }
                  />
                  <div className="grow">
                    <h2 className="text-card">
                      <Link href={`/admin/collections/events/${e.id}`}>{e.title}</Link>
                    </h2>
                    <p className="text-meta">
                      {e.clubName} · {e.status} · {e.startsAt.slice(0, 10)}
                    </p>
                    {e.issues.length > 0 && (
                      <ul className="mt-2 text-meta text-copy">
                        {e.issues.map((issue) => (
                          <li key={issue}>{issue}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link className="button button-quiet" href={`/preview/events/${e.id}`}>
                        Preview
                      </Link>
                      <button
                        type="button"
                        className="button button-quiet"
                        disabled={busy}
                        onClick={() => run({ action: 'duplicate', eventId: e.id })}
                      >
                        Duplicate draft
                      </button>
                      <button
                        type="button"
                        className="button button-quiet"
                        disabled={busy}
                        onClick={() => run({ action: 'repeat', eventId: e.id, count: 4 })}
                      >
                        Create 4 weekly drafts
                      </button>
                      <button
                        type="button"
                        className="button button-quiet"
                        disabled={busy}
                        onClick={() => run({ action: 'link-check', eventId: e.id })}
                      >
                        Check signup link
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {tab === 'Create event' && (
        <form
          className="workspace-panel grid max-w-2xl gap-5"
          onSubmit={async (e) => {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.currentTarget))
            const result = await run({
              action: 'create-event',
              ...data,
              timeTbc: data.timeTbc === 'on',
            })
            if (result?.url) location.assign(result.url)
          }}
        >
          <h2 className="text-card">New event · {step + 1} / 3</h2>
          <p className="text-copy">
            Create a draft, then add photos and rich text in the CMS. Dates below use Singapore
            time.
          </p>
          <fieldset hidden={step !== 0} className="grid gap-4">
            <legend className="mb-4 font-semibold">The essentials</legend>
            {clubSelect}
            <label className="field">
              Template
              <select className="input" name="template">
                <option value="session">Club session</option>
                <option value="trip">Trip</option>
                <option value="recruitment">Recruitment / open house</option>
              </select>
            </label>
            <label className="field">
              Title
              <input className="input" name="title" required />
            </label>
            <label className="field">
              URL slug
              <input
                className="input"
                name="slug"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="club-welcome-session"
              />
            </label>
          </fieldset>
          <fieldset hidden={step !== 1} className="grid gap-4">
            <legend className="mb-4 font-semibold">When and where</legend>
            <label className="field">
              Start
              <input className="input" type="datetime-local" name="startsAt" required />
            </label>
            <label className="field">
              End
              <input className="input" type="datetime-local" name="endsAt" />
            </label>
            <label>
              <input type="checkbox" name="timeTbc" /> Time to be confirmed
            </label>
            <label className="field">
              Meeting point
              <input className="input" name="location" />
            </label>
          </fieldset>
          <fieldset hidden={step !== 2} className="grid gap-4">
            <legend className="mb-4 font-semibold">Joining details</legend>
            <label className="field">
              Signup URL
              <input className="input" name="signupUrl" type="url" />
            </label>
            <label className="field">
              Cost
              <input className="input" name="cost" placeholder="Enter the verified cost" />
            </label>
            <label className="field">
              Organizer contact
              <input className="input" name="organizerContact" />
            </label>
            <p className="notice">
              Missing details remain visible in the readiness checklist. Creating this draft does
              not publish it.
            </p>
          </fieldset>
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                className="button button-primary"
                onClick={(e) => {
                  const form = e.currentTarget.form
                  const fields = form?.querySelectorAll('fieldset:not([hidden]) input')
                  if (
                    fields &&
                    Array.from(fields).every((x) => (x as HTMLInputElement).reportValidity())
                  )
                    setStep(step + 1)
                }}
              >
                Next
              </button>
            ) : (
              <button className="button button-primary" type="submit" disabled={busy}>
                Create draft
              </button>
            )}
          </div>
        </form>
      )}
      {tab === 'Import' && (
        <form
          className="workspace-panel grid gap-5"
          onSubmit={async (e) => {
            e.preventDefault()
            const clubId = new FormData(e.currentTarget).get('clubId')
            const result = await run({ action: 'import', rows, clubId, apply: false })
            setPreview(result)
          }}
        >
          <h2 className="text-card">Import events safely</h2>
          <p>
            Upload XLSX or JSON with columns externalId, title, date, endDate, url, location, cost.
            Dates must be ISO dates or timestamps with a timezone. At most 200 rows; stable external
            IDs make repeat imports update the same drafts.
          </p>
          {clubSelect}
          <label className="field">
            Event file
            <input
              className="input"
              type="file"
              accept=".xlsx,.json"
              onChange={async (e) => {
                setPreview(null)
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  if (file.size > 1_000_000) throw new Error('File must be under 1 MB.')
                  if (file.name.endsWith('.json')) {
                    const values = JSON.parse(await file.text())
                    if (!Array.isArray(values))
                      throw new Error('JSON must contain an array of rows.')
                    setRows(values)
                  } else {
                    const form = new FormData()
                    form.set('file', file)
                    const response = await fetch('/api/import', { method: 'POST', body: form })
                    const result = await response.json()
                    if (!response.ok) throw new Error(result.error)
                    setRows(result.rows)
                  }
                } catch (err) {
                  setMessage((err as Error).message)
                }
              }}
            />
          </label>
          <p>{rows.length} rows loaded.</p>
          <button className="button button-primary" disabled={!rows.length || busy} type="submit">
            Validate & preview
          </button>
          {preview != null && (
            <>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-meta">
                {JSON.stringify(preview, null, 2)}
              </pre>
              <button
                className="button button-quiet"
                disabled={busy}
                type="button"
                onClick={(e) =>
                  run({
                    action: 'import',
                    rows,
                    clubId: new FormData(e.currentTarget.form!).get('clubId'),
                    apply: true,
                  })
                }
              >
                Apply validated rows as drafts
              </button>
            </>
          )}
        </form>
      )}
      {tab === 'Media' && (
        <div className="workspace-grid">
          <MediaUpload clubs={clubs} isMc={isMc} />
          {generic(
            'Find media usage',
            'media-usage',
            <label className="field">
              Media ID
              <input className="input" type="number" min="1" required name="mediaId" />
            </label>,
          )}
          <div className="workspace-panel">
            <h2 className="text-card">Crop and organize</h2>
            <p className="my-4">
              Use the CMS media editor to set focal points, captions and credits. Saved versions
              preserve metadata changes. Review every reference before deleting a file.
            </p>
            <Link className="button button-quiet" href="/admin/collections/media">
              Open media library
            </Link>
          </div>
        </div>
      )}
      {tab === 'Writing' && (
        <div className="workspace-grid">
          {generic(
            'Review writing',
            'assist',
            <label className="field">
              Draft copy
              <textarea className="input min-h-48" name="text" required maxLength={12000} />
            </label>,
          )}
          {generic(
            'Add a section preset',
            'preset',
            <>
              <label className="field">
                Club
                <select className="input" name="clubId">
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Preset
                <select className="input" name="preset">
                  <option value="beginner">Beginner guide</option>
                  <option value="trip">Trip preparation</option>
                  <option value="recruitment">Recruitment steps</option>
                </select>
              </label>
              <p>
                Appends a draft text section for you to complete. Existing sections are preserved.
              </p>
            </>,
          )}
        </div>
      )}
      {tab === 'Check-in' && (
        <div className="workspace-grid">
          {generic(
            'Check in attendee',
            'check-in',
            <label className="field">
              Scan or paste check-in code
              <input className="input" name="token" required autoComplete="off" />
            </label>,
          )}
          <div className="workspace-panel">
            <h2 className="text-card">Roster</h2>
            <p className="my-4">
              Confirmed attendees, waitlist and check-in timestamps are scoped to your club.
            </p>
            <Link className="button button-primary" href="/admin/collections/registrations">
              Open attendee roster
            </Link>
            <p className="mt-4 text-meta">
              A USB or phone keyboard scanner can enter QR text directly into the check-in field.
            </p>
          </div>
        </div>
      )}
      {tab === 'Access & handover' && isMc && (
        <div className="workspace-grid">
          {generic(
            'Create private invitation',
            'invite',
            <>
              <label className="field">
                Email
                <input className="input" name="email" required type="email" />
              </label>
              <label className="field">
                Role
                <select className="input" name="role">
                  <option value="editor">Club editor</option>
                  <option value="member">Member</option>
                </select>
              </label>
              {clubSelect}
            </>,
          )}
          {generic(
            'Stage next committee',
            'handover',
            <>
              <label className="field">
                From year
                <input
                  className="input"
                  name="fromYear"
                  placeholder="AY26/27"
                  required
                  pattern="AY[0-9]{2}/[0-9]{2}"
                />
              </label>
              <label className="field">
                Next year
                <input
                  className="input"
                  name="year"
                  placeholder="AY27/28"
                  required
                  pattern="AY[0-9]{2}/[0-9]{2}"
                />
              </label>
            </>,
          )}
          {generic(
            'Activate reviewed committee',
            'handover',
            <>
              <label className="field">
                Year
                <input className="input" name="year" required pattern="AY[0-9]{2}/[0-9]{2}" />
              </label>
              <label>
                <input required type="checkbox" /> I reviewed committee records and account
                permissions.
              </label>
            </>,
            { activate: true, reviewed: true },
          )}
          <div className="workspace-panel">
            <h2 className="text-card">Master controls</h2>
            <div className="mt-4 grid gap-3">
              {[
                ['users', 'Accounts & roles'],
                ['campaigns', 'Recruitment campaigns'],
                ['audit-log', 'Audit history'],
                ['publish-jobs', 'Publication jobs'],
                ['metrics', 'Aggregate metrics'],
                ['contact-requests', 'Contact inbox'],
                ['link-checks', 'Link health'],
              ].map(([slug, label]) => (
                <Link
                  className="button button-quiet"
                  key={slug}
                  href={`/admin/collections/${slug}`}
                >
                  {label}
                </Link>
              ))}
              <Link className="button button-quiet" href="/admin/globals/siteSettings">
                Website settings
              </Link>
              <button
                type="button"
                className="button button-primary"
                disabled={busy}
                onClick={() => run({ action: 'refresh' })}
              >
                Retry publication jobs
              </button>
            </div>
          </div>
        </div>
      )}
      <pre
        className="mt-8 max-h-96 overflow-auto whitespace-pre-wrap break-words text-meta"
        role="status"
        aria-live="polite"
      >
        {busy ? 'Working…' : message}
      </pre>
    </div>
  )
}
function MediaUpload({ clubs, isMc }: { clubs: Choice[]; isMc: boolean }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="workspace-panel grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        const input = new FormData(e.currentTarget)
        const results = []
        for (const file of input.getAll('files')) {
          if (!(file instanceof File) || !file.size) continue
          try {
            const form = new FormData()
            form.set('file', file)
            form.set(
              '_payload',
              JSON.stringify({
                alt: `${input.get('alt')} — ${file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
                credit: input.get('credit'),
                club: input.get('club') || null,
              }),
            )
            const response = await fetch('/api/media', { method: 'POST', body: form })
            results.push(
              `${file.name}: ${response.ok ? 'uploaded' : 'failed; check file type and size'}`,
            )
          } catch {
            results.push(`${file.name}: upload failed`)
          }
        }
        setMessage(results.join('\n'))
        setBusy(false)
      }}
    >
      <h2 className="text-card">Batch upload photos</h2>
      <label className="field">
        Photos
        <input
          className="input"
          type="file"
          name="files"
          multiple
          required
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        />
      </label>
      <label className="field">
        Shared description
        <input
          className="input"
          name="alt"
          required
          placeholder="Describe the people, activity and setting"
        />
      </label>
      <label className="field">
        Photo credit
        <input className="input" name="credit" />
      </label>
      <label className="field">
        Club
        <select className="input" name="club">
          {isMc && <option value="">SMUX-wide</option>}
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <p className="text-meta">
        Review each photo’s generated description in the media library after upload. Maximum 15 MB
        per image.
      </p>
      <button className="button button-primary" type="submit" disabled={busy}>
        {busy ? 'Uploading…' : 'Upload photos'}
      </button>
      <p className="whitespace-pre-line" role="status">
        {message}
      </p>
    </form>
  )
}
