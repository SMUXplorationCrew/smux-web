/**
 * URLs typed into the CMS reach the public site as hrefs, so they are validated here
 * before they get there.
 *
 * The rule is an allow-list, not a block-list: a path, a fragment, http(s), mailto or
 * tel. `javascript:` is the obvious thing that must never survive, but `data:` is worth
 * excluding for the same reason — both turn a text field an editor can fill into a
 * script that runs for every visitor.
 */

const ALLOWED_SCHEME = /^(https?:|mailto:|tel:)/i

export const safeUrl = (raw: string | null | undefined): string | null => {
  const value = raw?.trim()
  if (!value) return null

  // Site-relative paths and in-page anchors.
  if (value.startsWith('/') || value.startsWith('#')) return value

  if (ALLOWED_SCHEME.test(value)) return value

  // A scheme we do not allow. Anything else with a colon before the first slash is
  // treated as a scheme attempt rather than being quietly prefixed with https://.
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null

  // Bare host, e.g. "smux.sg/join" — the most common way an editor writes a link.
  return `https://${value}`
}

/** Internal links get client-side navigation; everything else opens in a new tab. */
export const isInternalUrl = (href: string): boolean => href.startsWith('/') || href.startsWith('#')
