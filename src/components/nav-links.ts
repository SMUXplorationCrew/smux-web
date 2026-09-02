export interface NavLink {
  href: string
  label: string
}

/**
 * Shared between the desktop header and the mobile panel so the two can never drift.
 * /resources is intentionally absent: it is members-only, and advertising it to every
 * visitor invites a redirect to a login they cannot use.
 */
export const NAV_LINKS: NavLink[] = [
  { href: '/clubs', label: 'Clubs' },
  { href: '/events', label: 'Events' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/committee', label: 'Committee' },
  { href: '/join', label: 'Join' },
  { href: '/contact', label: 'Contact' },
]
