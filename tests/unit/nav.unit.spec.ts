import { describe, expect, it } from 'vitest'
import { NAV_LINKS, resolveNavLinks } from '@/components/nav-links'

describe('resolveNavLinks', () => {
  it('falls back to the shipped menu when nothing is configured', () => {
    expect(resolveNavLinks(null)).toBe(NAV_LINKS)
    expect(resolveNavLinks([])).toBe(NAV_LINKS)
  })

  it('uses the committee’s menu when there is one', () => {
    expect(resolveNavLinks([{ label: 'Clubs', href: '/clubs' }])).toEqual([
      { label: 'Clubs', href: '/clubs' },
    ])
  })

  it('drops rows missing a label or a destination', () => {
    const links = resolveNavLinks([
      { label: 'Clubs', href: '/clubs' },
      { label: 'Broken', href: '' },
      { label: '', href: '/events' },
    ])
    expect(links).toEqual([{ label: 'Clubs', href: '/clubs' }])
  })

  /**
   * A menu entry is a link on every page of the site, so it goes through the same
   * validation as any other editor-supplied URL.
   */
  it('drops a menu entry with an unsafe URL', () => {
    expect(resolveNavLinks([{ label: 'Bad', href: 'javascript:alert(1)' }])).toBe(NAV_LINKS)
  })

  it('falls back rather than rendering a header with no navigation', () => {
    expect(resolveNavLinks([{ label: '', href: '' }])).toBe(NAV_LINKS)
  })
})
