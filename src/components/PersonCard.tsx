import { MediaImage } from '@/components/MediaImage'
import { socialHref } from '@/lib/socials'
import type { Person } from '@/payload-types'

/**
 * A committee member, on both the club pages and the main committee page.
 *
 * The `contact` field is free text because a club writes either an email or a Telegram
 * handle there, so which one it is has to be inferred rather than declared.
 */
export const PersonCard = ({ person }: { person: Person }) => {
  const contact = person.contact?.trim()

  /**
   * Clubs write either an email or a Telegram handle in this one field, so which it is
   * has to be inferred — but only from something that actually looks like one. The
   * previous guess sent anything containing an @ to mailto:, which turned
   * "Telegram: @jo" into `mailto:Telegram: @jo`. Anything unrecognised, a bracketed
   * placeholder included, is now shown as plain text instead of guessed into a link
   * that goes nowhere.
   */
  const isEmail = Boolean(contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))
  const isHandle = Boolean(contact && /^@?[\w.]{2,}$/.test(contact))
  const href =
    contact && (isEmail || isHandle) ? socialHref(isEmail ? 'email' : 'telegram', contact) : null

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-accent-tint">
        <MediaImage
          className="transition-transform duration-500 group-hover:scale-[1.04]"
          fill
          media={person.photo}
          placeholderLabel={person.name}
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      </div>
      <p className="mt-3 font-display text-lead uppercase">{person.name}</p>
      <p className="text-meta text-muted">{person.role}</p>
      {href ? (
        <a
          className="mt-1 inline-flex min-h-11 items-center text-meta break-words text-accent-text transition-colors hover:underline underline-offset-4"
          href={href}
          rel="noopener noreferrer"
          target={href.startsWith('mailto:') ? undefined : '_blank'}
        >
          {contact}
        </a>
      ) : null}
    </div>
  )
}
