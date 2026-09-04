/**
 * One place that turns whatever an editor typed into a link that works.
 *
 * Editors do not type URLs consistently, and they should not have to: "t.me/smuxdiving",
 * "@smuxdiving", "smuxdiving" and the full https:// form all mean the same account. The
 * href-building for that used to live in three components, which drifted — the club page
 * accepted a bare handle for Instagram but not for TikTok, and the footer built its own
 * Telegram URL a fourth way.
 */

export const SOCIAL_KINDS = [
  'telegram',
  'instagram',
  'whatsapp',
  'tiktok',
  'youtube',
  'facebook',
  'linkedin',
  'discord',
  'website',
  'email',
] as const

export type SocialKind = (typeof SOCIAL_KINDS)[number]

/** A custom row an editor added, which has a label instead of a known platform. */
export type LinkKind = SocialKind | 'link'

export interface SocialLink {
  kind: LinkKind
  /** Platform name, or the editor's own label for a custom row. */
  label: string
  href: string
  /** What to show when the link is rendered as text — "@smuxdiving", not the URL. */
  handle: string
}

export const SOCIAL_LABELS: Record<SocialKind, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  discord: 'Discord',
  website: 'Website',
  email: 'Email',
}

const stripAt = (v: string): string => v.replace(/^@/, '')
const stripScheme = (v: string): string => v.replace(/^https?:\/\//i, '')
const hasScheme = (v: string): boolean => /^https?:\/\//i.test(v)

/**
 * Only http(s) and mailto ever reach an href.
 *
 * These values come from a CMS text field, and `javascript:alert(1)` typed into one
 * would otherwise become a working script link on a public page for every visitor.
 * Anything that is not a recognised scheme is treated as a bare handle and given
 * https:// below, so this cannot silently drop a legitimate link either.
 */
const isSafe = (href: string): boolean => /^(https?:|mailto:)/i.test(href)

/** Builds the URL for a platform from whatever form the editor typed. */
export const socialHref = (kind: LinkKind, raw: string): string | null => {
  const value = raw.trim()
  if (!value) return null

  if (kind === 'email') {
    return value.includes('@') ? `mailto:${value}` : null
  }

  // An editor who pasted the full URL always wins — no guessing on top of it.
  if (hasScheme(value)) return isSafe(value) ? value : null

  /**
   * Anything else carrying a scheme is refused outright rather than falling through to
   * the handle branches below, which would otherwise turn `javascript:alert(1)` into
   * `https://javascript:alert(1)` — not dangerous, but a dead link presented as a real
   * one. A colon this early in the value is never part of a handle.
   */
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null

  const bare = stripAt(value)

  switch (kind) {
    case 'telegram':
      // "t.me/x" and "x" are both common; only the second needs a host.
      return bare.includes('/') ? `https://${bare}` : `https://t.me/${bare}`
    case 'instagram':
      return bare.includes('/') ? `https://${bare}` : `https://instagram.com/${bare}`
    case 'tiktok':
      return bare.includes('/') ? `https://${bare}` : `https://tiktok.com/@${bare}`
    case 'facebook':
      return bare.includes('/') ? `https://${bare}` : `https://facebook.com/${bare}`
    case 'youtube':
      return bare.includes('/') ? `https://${bare}` : `https://youtube.com/@${bare}`
    case 'discord':
      return bare.includes('/') ? `https://${bare}` : `https://discord.gg/${bare}`
    case 'whatsapp': {
      // wa.me wants digits only, so a typed "+65 8123 4567" has to be normalised.
      const digits = bare.replace(/[\s()+-]/g, '')
      if (/^\d{6,15}$/.test(digits)) return `https://wa.me/${digits}`
      return bare.includes('/') ? `https://${bare}` : null
    }
    case 'linkedin':
      // A club or society is a LinkedIn *company*, not a person, so a bare name
      // resolves there rather than to /in/.
      return bare.includes('/') ? `https://${bare}` : `https://linkedin.com/company/${bare}`
    default:
      return `https://${bare}`
  }
}

/** The short, human form of the value — what a person recognises at a glance. */
export const socialHandle = (kind: LinkKind, raw: string): string => {
  const value = raw.trim()
  if (kind === 'email') return value
  if (kind === 'website') return stripScheme(value).replace(/\/$/, '')

  const bare = stripAt(stripScheme(value))
  const last = bare.split('/').filter(Boolean).pop() ?? bare
  if (kind === 'whatsapp') return last

  /**
   * Not every link ends in something a person would recognise as a handle. A Telegram
   * invite link ends in `+1bFgrdUz…`, a Facebook page can be a bare numeric id, and
   * rendering those as "@+1bFgrdUz…" reads as a mistake. Those show the address
   * instead, which at least says where the link goes.
   */
  // TikTok and YouTube keep the @ in the path, so it has to come off before the shape
  // is judged — otherwise every one of them falls through to the URL branch below.
  const handle = stripAt(last)
  if (!/^[a-z][a-z0-9._-]*$/i.test(handle)) return stripScheme(value).replace(/\/$/, '')

  return `@${handle}`
}

/** The shape the CMS stores a socials group as, before any of it is guaranteed present. */
export type SocialBag = Partial<Record<SocialKind, string | null>> | null | undefined

export interface ExtraLink {
  label?: string | null
  url?: string | null
  id?: string | null
}

/**
 * Turns a stored socials group into the rows a component can render, in a fixed order
 * so every place on the site lists platforms the same way. Empty fields and values that
 * cannot produce a safe URL are dropped rather than rendered as dead links.
 */
export const toSocialLinks = (socials: SocialBag, extra?: ExtraLink[] | null): SocialLink[] => {
  const rows: SocialLink[] = []

  for (const kind of SOCIAL_KINDS) {
    const value = socials?.[kind]
    if (!value) continue
    const href = socialHref(kind, value)
    if (!href) continue
    rows.push({
      kind,
      label: SOCIAL_LABELS[kind],
      href,
      handle: socialHandle(kind, value),
    })
  }

  for (const row of extra ?? []) {
    if (!row?.label || !row?.url) continue
    const href = socialHref('link', row.url)
    if (!href) continue
    rows.push({ kind: 'link', label: row.label, href, handle: row.label })
  }

  return rows
}
