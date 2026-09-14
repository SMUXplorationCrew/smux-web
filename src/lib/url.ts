/** Canonical URL boundary for CMS-authored links. */
export const isInternalUrl = (href: string): boolean =>
  (href.startsWith('/') && !href.startsWith('//') && !href.includes('\\')) || href.startsWith('#')

export const safeUrl = (raw: string | null | undefined): string | null => {
  const value = raw?.trim()
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control characters in CMS URLs.
  if (!value || /[\u0000-\u001f\u007f\\]/.test(value) || /\[[^\]]*\]/.test(value)) return null
  if (isInternalUrl(value)) return value
  if (/^(mailto:|tel:)/i.test(value)) return /\s/.test(value) ? null : value
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null
  const candidate = value.startsWith('//')
    ? `https:${value}`
    : /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`
  try {
    const url = new URL(candidate)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      /\s/.test(candidate)
    )
      return null
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null
    return candidate
  } catch {
    return null
  }
}

export const httpUrl = (raw: string | null | undefined): string | null => {
  const url = safeUrl(raw)
  return url && /^https?:\/\//i.test(url) ? url : null
}

export const safeReturnPath = (raw: string | null | undefined, fallback = '/resources'): string =>
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject whitespace and controls in redirect targets.
  raw?.startsWith('/') && isInternalUrl(raw) && !/[\u0000-\u0020]/.test(raw) ? raw : fallback
