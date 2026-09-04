import { describe, expect, it } from 'vitest'
import { isInternalUrl, safeUrl } from '@/lib/url'

/**
 * Every button label and destination on this site can be set from the CMS, so this is
 * the boundary between what an editor typed and what becomes an href.
 */
describe('safeUrl', () => {
  it('passes site paths through', () => {
    expect(safeUrl('/join')).toBe('/join')
  })

  it('passes in-page anchors through', () => {
    expect(safeUrl('#faq')).toBe('#faq')
  })

  it('passes http and https through', () => {
    expect(safeUrl('https://forms.gle/abc')).toBe('https://forms.gle/abc')
    expect(safeUrl('http://example.org')).toBe('http://example.org')
  })

  it('allows mailto and tel', () => {
    expect(safeUrl('mailto:a@b.com')).toBe('mailto:a@b.com')
    expect(safeUrl('tel:+6581234567')).toBe('tel:+6581234567')
  })

  it('adds a scheme to a bare host, the way editors usually write links', () => {
    expect(safeUrl('forms.gle/abc')).toBe('https://forms.gle/abc')
  })

  it('trims surrounding whitespace from a pasted value', () => {
    expect(safeUrl('  https://smux.sg  ')).toBe('https://smux.sg')
  })

  it('treats empty and missing values as no link at all', () => {
    expect(safeUrl('')).toBeNull()
    expect(safeUrl('   ')).toBeNull()
    expect(safeUrl(null)).toBeNull()
    expect(safeUrl(undefined)).toBeNull()
  })

  it('refuses javascript: however it is cased', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull()
    expect(safeUrl('JavaScript:alert(1)')).toBeNull()
  })

  it('refuses data: and other schemes rather than prefixing them with https', () => {
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
    expect(safeUrl('vbscript:msgbox(1)')).toBeNull()
  })
})

describe('isInternalUrl', () => {
  it('recognises paths and anchors', () => {
    expect(isInternalUrl('/clubs')).toBe(true)
    expect(isInternalUrl('#top')).toBe(true)
  })

  it('treats everything else as external', () => {
    expect(isInternalUrl('https://smux.sg')).toBe(false)
    expect(isInternalUrl('mailto:a@b.com')).toBe(false)
  })
})
