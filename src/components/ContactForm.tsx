'use client'
import { useState } from 'react'
import { operate } from '@/components/AccountTools'
export function ContactForm({ clubs }: { clubs: { id: number; name: string }[] }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="grid max-w-2xl gap-5"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        try {
          await operate({ action: 'contact', ...Object.fromEntries(new FormData(e.currentTarget)) })
          setMessage(
            'Your message is in the committee inbox. For time-sensitive event questions, use the listed club contact.',
          )
        } catch (err) {
          setMessage((err as Error).message)
        } finally {
          setBusy(false)
        }
      }}
    >
      <label className="field">
        Who is this for?
        <select className="input" name="club">
          <option value="">Main committee</option>
          {clubs.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Your email
        <input className="input" name="email" type="email" required />
      </label>
      <label className="field">
        Subject
        <input className="input" name="subject" required maxLength={120} />
      </label>
      <label className="field">
        Message
        <textarea
          className="input min-h-40"
          name="message"
          required
          minLength={10}
          maxLength={4000}
        />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="text-meta">
        Your message and email are shared with the selected committee to handle your request.{' '}
        <a className="underline" href="/privacy">
          Privacy details
        </a>
        .
      </p>
      <button className="button button-primary" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Send message'}
      </button>
      <p role="status">{message}</p>
    </form>
  )
}
