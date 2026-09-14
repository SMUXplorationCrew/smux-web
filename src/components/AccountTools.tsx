'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { safeReturnPath } from '@/lib/url'
export async function operate(data: Record<string, unknown>) {
  const res = await fetch('/api/operations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error || 'Request failed. Please try again.')
  return body
}
export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'forgot-password' | 'reset-password'>('login')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (new URLSearchParams(location.search).has('token')) setMode('reset-password')
  }, [])
  return (
    <form
      className="grid max-w-md gap-5"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        setMessage('')
        const values = Object.fromEntries(new FormData(e.currentTarget))
        try {
          const response = await fetch(`/api/users/${mode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...values,
              token: new URLSearchParams(location.search).get('token'),
            }),
          })
          if (!response.ok)
            throw new Error(
              mode === 'login'
                ? 'Unable to sign in. Check your details or try again later.'
                : 'Unable to process this request.',
            )
          if (mode === 'forgot-password')
            setMessage('If that account exists, a reset link has been requested.')
          else
            location.assign(
              safeReturnPath(new URLSearchParams(location.search).get('returnTo'), '/account'),
            )
        } catch (error) {
          setMessage((error as Error).message)
        } finally {
          setBusy(false)
        }
      }}
    >
      <h2 className="text-card">
        {mode === 'login'
          ? 'Welcome back'
          : mode === 'forgot-password'
            ? 'Reset your password'
            : 'Choose a new password'}
      </h2>
      {mode !== 'reset-password' && (
        <label className="field">
          Email
          <input className="input" required name="email" type="email" autoComplete="email" />
        </label>
      )}
      {mode !== 'forgot-password' && (
        <label className="field">
          Password
          <input
            className="input"
            required
            minLength={mode === 'reset-password' ? 12 : 1}
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>
      )}
      <button className="button button-primary" disabled={busy} type="submit">
        {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Continue'}
      </button>
      <p role="status">{message}</p>
      <button
        className="button button-quiet"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'forgot-password' : 'login')}
      >
        {mode === 'login' ? 'Forgot password?' : 'Back to sign in'}
      </button>
      <p className="text-meta text-copy">
        Accounts are invitation-only. Contact your committee if you need access.
      </p>
    </form>
  )
}
export function LogoutButton() {
  return (
    <button
      className="button button-quiet"
      type="button"
      onClick={async () => {
        await fetch('/api/users/logout', { method: 'POST' })
        location.assign('/login')
      }}
    >
      Sign out
    </button>
  )
}
export function InvitationForm() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="grid max-w-md gap-5"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        try {
          await operate({
            action: 'accept-invite',
            ...Object.fromEntries(new FormData(e.currentTarget)),
            token: location.hash.slice(1) || new URLSearchParams(location.search).get('token'),
          })
          history.replaceState(null, '', '/invite')
          location.assign('/login')
        } catch (err) {
          setMessage((err as Error).message)
        } finally {
          setBusy(false)
        }
      }}
    >
      <label className="field">
        Your name
        <input required className="input" name="name" autoComplete="name" />
      </label>
      <label className="field">
        New password
        <input
          required
          className="input"
          name="password"
          type="password"
          minLength={12}
          autoComplete="new-password"
        />
      </label>
      <button disabled={busy} className="button button-primary" type="submit">
        Create account
      </button>
      <p role="status">{message}</p>
    </form>
  )
}
export function InterestButton({ eventId, clubId }: { eventId?: number; clubId?: number }) {
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  return (
    <div className="grid gap-3">
      <label className="flex items-start gap-3 text-meta">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        Email me when {eventId ? 'this event opens for signup' : 'this club publishes an event'}.
        Manage reminders in your account.
      </label>
      <button
        className="button button-quiet"
        type="button"
        disabled={!consent}
        onClick={async () => {
          try {
            await operate({ action: 'interest', eventId, clubId, consent: true })
            setMessage('Reminder saved. Delivery requires the site email service to be enabled.')
          } catch (err) {
            setMessage((err as Error).message)
          }
        }}
      >
        Save reminder
      </button>
      <p role="status">{message}</p>
    </div>
  )
}
export function NativeRegistration({ eventId }: { eventId: number }) {
  const [state, setState] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [token, setToken] = useState('')
  useEffect(() => {
    operate({ action: 'my-registration', eventId })
      .then((r) => setState(r.registration?.status || 'none'))
      .catch(() => setState('signed-out'))
  }, [eventId])
  const action = async (name: string) => {
    setBusy(true)
    try {
      const r = await operate({ action: name, eventId })
      if (r.status) setState(r.status)
      if (r.token) setToken(r.token)
      setMessage(
        name === 'check-in-token'
          ? 'Code expires in 10 minutes. Show it only to the event organizer.'
          : 'Registration updated.',
      )
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setBusy(false)
    }
  }
  if (state === 'signed-out')
    return (
      <Link
        className="button button-primary"
        href={`/login?returnTo=${encodeURIComponent(`/events/return?event=${eventId}`)}`}
      >
        Sign in to register
      </Link>
    )
  return (
    <div className="grid gap-3">
      <p role="status">
        {state === null
          ? 'Checking registration…'
          : state === 'none' || state === 'cancelled'
            ? 'Register here. If capacity is reached, you will join the waitlist.'
            : `You are ${state}.`}
      </p>
      {state !== null && (
        <button
          disabled={busy}
          className="button button-primary"
          type="button"
          onClick={() =>
            action(
              state === 'registered' || state === 'waitlisted' ? 'cancel-registration' : 'register',
            )
          }
        >
          {state === 'registered' || state === 'waitlisted'
            ? 'Cancel my registration'
            : 'Register / join waitlist'}
        </button>
      )}
      {state === 'registered' && (
        <button
          className="button button-quiet"
          type="button"
          disabled={busy}
          onClick={() => action('check-in-token')}
        >
          Show check-in code
        </button>
      )}
      {token && (
        <div className="notice">
          {/* biome-ignore lint/performance/noImgElement: next/image would route a
              short-lived, private check-in token through the image optimizer and cache
              it at the CDN. This is generated per request, not an R2 upload, so the
              upload-time variant pipeline does not apply either. */}
          <img
            width={220}
            height={220}
            alt="Your private check-in QR code"
            src={`/api/qr?value=${encodeURIComponent(token)}`}
          />
          <code className="break-all">{token}</code>
        </div>
      )}
      <p role="status">{message}</p>
    </div>
  )
}
export function ReminderCancel({ eventId, clubId }: { eventId?: number; clubId?: number }) {
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')
  return (
    <>
      <button
        className="button button-quiet"
        disabled={done}
        type="button"
        onClick={async () => {
          try {
            await operate({ action: 'interest', eventId, clubId, active: false })
            setDone(true)
          } catch (e) {
            setMessage((e as Error).message)
          }
        }}
      >
        {done ? 'Unsubscribed' : 'Unsubscribe'}
      </button>
      <span role="status">{message}</span>
    </>
  )
}
