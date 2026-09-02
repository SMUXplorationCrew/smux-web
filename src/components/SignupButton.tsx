import { getSignupStatus, type SignupInput } from '@/lib/signupState'

interface SignupButtonProps {
  event: SignupInput & { signupUrl?: string | null }
  className?: string
}

/**
 * The two-tap destination. Its label is derived from dates every time it renders —
 * there is no status field to fall out of date.
 *
 * When sign-ups are not open the control is deliberately not a link: a disabled-looking
 * anchor that still navigates is worse than no anchor at all.
 */
export const SignupButton = ({ event, className = '' }: SignupButtonProps) => {
  const { state, label } = getSignupStatus(event)

  // min-h-11 is 44px — the minimum comfortable tap target.
  const base =
    'inline-flex min-h-11 items-center justify-center px-6 font-display text-meta tracking-button uppercase transition-colors'

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
