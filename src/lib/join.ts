import { toSocialLinks } from '@/lib/socials'
import { safeUrl } from '@/lib/url'
import type { Club } from '@/payload-types'
export function joinAction(club: Club) {
  const configured = safeUrl(club.joinCta?.buttonUrl)
  if (configured && configured !== '/join' && configured !== '#')
    return { href: configured, label: club.joinCta?.buttonLabel || `Join ${club.name}` }
  const contacts = toSocialLinks(club.socials, club.extraSocials)
  const contact =
    contacts.find((x) => x.kind === 'telegram') ||
    contacts.find((x) => x.kind === 'email') ||
    contacts[0]
  return contact
    ? { href: contact.href, label: `Connect on ${contact.label}` }
    : { href: `/contact#club-${club.slug}`, label: `Ask about ${club.name}` }
}
