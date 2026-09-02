'use client'

import { useEffect, useState } from 'react'
import { getSignupStatus, type SignupInput, type SignupStatus } from '@/lib/signupState'

/**
 * Keeps sign-up state honest on a pre-rendered page.
 *
 * Sign-up state is derived from dates, and every page here is static — so a server-only
 * computation is frozen at build time. An event whose window opens tomorrow would keep
 * saying "Opens 12 Sep" and stay un-clickable long after sign-ups actually opened, and
 * a closed one would keep linking to a dead form. Nothing about the event changed, so
 * no `afterChange` hook fires to fix it.
 *
 * `initial` is the value the server rendered, so the first client render matches the
 * HTML exactly and hydration is clean; the effect then recomputes against the viewer's
 * real clock. No JavaScript still yields a sensible, if possibly stale, label.
 */
export const useLiveSignupStatus = (event: SignupInput, initial: SignupStatus): SignupStatus => {
  const [status, setStatus] = useState(initial)

  useEffect(() => {
    const update = () => setStatus(getSignupStatus(event))
    update()
    // A page left open across a boundary should still correct itself.
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [event])

  return status
}

interface SignupControlProps {
  event: SignupInput & { signupUrl?: string | null }
  initial: SignupStatus
  className?: string
}

export const SignupControl = ({ event, initial, className = '' }: SignupControlProps) => {
  const { state, label } = useLiveSignupStatus(event, initial)

  // min-h-11 is 44px — the minimum comfortable tap target.
  const base =
    'inline-flex min-h-11 items-center justify-center px-6 font-display text-meta tracking-button uppercase transition-colors'

  // When sign-ups are not open this is deliberately not a link: a disabled-looking
  // anchor that still navigates is worse than no anchor at all.
  if (state !== 'open' || !event.signupUrl) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed bg-line text-muted ${className}`}
      >
        {label}
      </span>
    )
  }

  return (
    <a
      className={`${base} bg-accent text-paper hover:opacity-90 ${className}`}
      href={event.signupUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  )
}

/** The same live state as plain text, for event cards. */
export const SignupLabel = ({
  event,
  initial,
  className = '',
}: {
  event: SignupInput
  initial: SignupStatus
  className?: string
}) => {
  const { state, label } = useLiveSignupStatus(event, initial)
  return (
    <p
      className={`font-display text-eyebrow tracking-eyebrow uppercase ${
        state === 'open' ? 'text-orange-text' : 'text-muted'
      } ${className}`}
    >
      {label}
    </p>
  )
}
