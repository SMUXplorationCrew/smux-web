import { SignupControl } from '@/components/SignupControl'
import { getSignupStatus, type SignupInput } from '@/lib/signupState'

interface SignupButtonProps {
  event: SignupInput & { signupUrl?: string | null }
  className?: string
}

/**
 * The two-tap destination. Its label is derived from dates every time it renders —
 * there is no status field to fall out of date.
 *
 * The server computes the initial state so the pre-rendered HTML is meaningful without
 * JavaScript; SignupControl then keeps it live against the viewer's clock, because a
 * static page cannot notice a sign-up window opening on its own.
 */
export const SignupButton = ({ event, className = '' }: SignupButtonProps) => (
  <SignupControl className={className} event={event} initial={getSignupStatus(event)} />
)
