import { describe, expect, it } from 'vitest'
import { socialHandle, socialHref, toSocialLinks } from '@/lib/socials'

/**
 * These exist because editors type the same account four different ways, and the site
 * has to produce a working link from all of them. Every case below is a form someone
 * has actually written into a CMS field.
 */
describe('socialHref', () => {
  it('accepts a bare handle', () => {
    expect(socialHref('instagram', 'smuxdiving')).toBe('https://instagram.com/smuxdiving')
  })

  it('accepts a handle written with an @', () => {
    expect(socialHref('instagram', '@smuxdiving')).toBe('https://instagram.com/smuxdiving')
  })

  it('accepts a host-and-path form', () => {
    expect(socialHref('telegram', 't.me/smuxdiving')).toBe('https://t.me/smuxdiving')
  })

  it('leaves a full URL untouched', () => {
    expect(socialHref('telegram', 'https://t.me/smuxdiving')).toBe('https://t.me/smuxdiving')
  })

  it('puts a bare Telegram handle on t.me', () => {
    expect(socialHref('telegram', 'smuxdiving')).toBe('https://t.me/smuxdiving')
  })

  it('keeps the @ TikTok requires in its path', () => {
    expect(socialHref('tiktok', 'smuxdiving')).toBe('https://tiktok.com/@smuxdiving')
  })

  it('treats a bare LinkedIn name as a company, not a person', () => {
    expect(socialHref('linkedin', 'smux')).toBe('https://linkedin.com/company/smux')
  })

  it('strips the punctuation people write phone numbers with', () => {
    expect(socialHref('whatsapp', '+65 8123 4567')).toBe('https://wa.me/6581234567')
  })

  it('rejects a WhatsApp value that is not a number', () => {
    expect(socialHref('whatsapp', 'ask me')).toBeNull()
  })

  it('builds a mailto for email', () => {
    expect(socialHref('email', 'diving@sa.smu.edu.sg')).toBe('mailto:diving@sa.smu.edu.sg')
  })

  it('rejects an email field with no address in it', () => {
    expect(socialHref('email', 'coming soon')).toBeNull()
  })

  it('ignores blank and whitespace-only values', () => {
    expect(socialHref('instagram', '')).toBeNull()
    expect(socialHref('instagram', '   ')).toBeNull()
  })

  /**
   * The one that matters for safety: these fields are public-facing hrefs, and a
   * script URL typed into one would run for every visitor to the page.
   */
  it('refuses a javascript: URL', () => {
    expect(socialHref('website', 'javascript:alert(1)')).toBeNull()
  })

  it('refuses a data: URL', () => {
    expect(socialHref('website', 'data:text/html,<script>alert(1)</script>')).toBeNull()
  })
})

describe('socialHandle', () => {
  it('shows a handle rather than a URL', () => {
    expect(socialHandle('instagram', 'https://instagram.com/smuxdiving')).toBe('@smuxdiving')
  })

  it('does not double up the @', () => {
    expect(socialHandle('instagram', '@smuxdiving')).toBe('@smuxdiving')
  })

  it('shows an email address as written', () => {
    expect(socialHandle('email', 'diving@sa.smu.edu.sg')).toBe('diving@sa.smu.edu.sg')
  })

  it('drops the scheme and trailing slash from a website', () => {
    expect(socialHandle('website', 'https://smux.sg/')).toBe('smux.sg')
  })
})

describe('toSocialLinks', () => {
  it('returns nothing when the group is empty or missing', () => {
    expect(toSocialLinks(null)).toEqual([])
    expect(toSocialLinks({})).toEqual([])
  })

  it('skips blank fields instead of rendering dead links', () => {
    const links = toSocialLinks({ instagram: 'smuxdiving', telegram: '', email: null })
    expect(links).toHaveLength(1)
    expect(links[0].kind).toBe('instagram')
  })

  it('orders platforms the same way everywhere on the site', () => {
    const links = toSocialLinks({
      email: 'a@b.com',
      instagram: 'smux',
      telegram: 'smux',
    })
    expect(links.map((l) => l.kind)).toEqual(['telegram', 'instagram', 'email'])
  })

  it('appends editor-added rows after the known platforms', () => {
    const links = toSocialLinks({ telegram: 'smux' }, [
      { label: 'Strava', url: 'strava.com/clubs/smux' },
    ])
    expect(links.map((l) => l.label)).toEqual(['Telegram', 'Strava'])
    expect(links[1].href).toBe('https://strava.com/clubs/smux')
  })

  it('drops an extra row that is missing its label or URL', () => {
    expect(toSocialLinks({}, [{ label: 'Strava' }, { url: 'strava.com' }])).toEqual([])
  })
})

describe('socialHandle on links that have no handle', () => {
  it('shows the address for a Telegram invite link', () => {
    expect(socialHandle('telegram', 'https://t.me/+1bFgrdUz2384OTJI')).toBe(
      't.me/+1bFgrdUz2384OTJI',
    )
  })

  it('shows the address for a numeric Facebook page id', () => {
    expect(socialHandle('facebook', 'facebook.com/5094212471')).toBe('facebook.com/5094212471')
  })
})

describe('socialHandle on platforms whose URLs contain an @', () => {
  it('keeps a TikTok handle rather than falling back to the URL', () => {
    expect(socialHandle('tiktok', 'https://www.tiktok.com/@smuxbiking')).toBe('@smuxbiking')
  })

  it('keeps a YouTube handle', () => {
    expect(socialHandle('youtube', 'https://youtube.com/@smux')).toBe('@smux')
  })
})
