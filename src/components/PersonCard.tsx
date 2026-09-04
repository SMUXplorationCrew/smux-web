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
  const isPlaceholder = Boolean(contact?.startsWith('['))
  const href =
    contact && !isPlaceholder
      ? socialHref(
          contact.includes('@') && !contact.startsWith('@') ? 'email' : 'telegram',
          contact,
        )
      : null

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
          className="mt-1 inline-flex min-h-11 items-center text-meta break-all text-accent transition-colors hover:underline underline-offset-4"
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
