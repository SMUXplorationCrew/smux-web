import { describe, expect, it } from 'vitest'
import { RICH_TEXT_STATES, stylesForState } from '@/lib/richTextStates'

/**
 * The editor and the site read this same object, so what is tested here is the
 * contract between them: what an editor picks in the CMS is what the page renders.
 */
describe('stylesForState', () => {
  it('returns nothing for text with no formatting, so no wrapper is added', () => {
    expect(stylesForState(undefined)).toBeUndefined()
    expect(stylesForState(null)).toBeUndefined()
    expect(stylesForState({})).toBeUndefined()
  })

  it('converts hyphenated CSS to the shape React needs', () => {
    expect(stylesForState({ size: 'small' })).toEqual({ fontSize: '0.9375rem' })
  })

  it('merges several states on one run of text', () => {
    const style = stylesForState({ color: 'brand', font: 'mono' })
    expect(style).toMatchObject({ color: '#a8460a', fontFamily: expect.stringContaining('mono') })
  })

  /**
   * A document may have been written when this file offered a value it no longer
   * does. Plain text is the right answer then — not a crash, and not a half-applied
   * style that looks like a rendering bug.
   */
  it('ignores states and values it does not recognise', () => {
    expect(stylesForState({ size: 'enormous' })).toBeUndefined()
    expect(stylesForState({ nonsense: 'lead' })).toBeUndefined()
    expect(stylesForState({ size: 'lead', gone: 'x' })).toEqual(stylesForState({ size: 'lead' }))
  })

  it('ignores non-string values rather than trusting them', () => {
    expect(stylesForState({ size: 42 })).toBeUndefined()
    expect(stylesForState({ size: { toString: () => 'lead' } })).toBeUndefined()
  })

  it('survives a state value that is not an object at all', () => {
    expect(stylesForState('lead')).toBeUndefined()
    expect(stylesForState(7)).toBeUndefined()
  })
})

/**
 * These are the guard rails that stop editor formatting from breaking a phone
 * layout. They are asserted rather than trusted because the failure is invisible
 * until someone opens the page at 390px.
 */
describe('the formatting menu is safe to hand to a non-developer', () => {
  const everyValue = Object.values(RICH_TEXT_STATES).flatMap((values) => Object.entries(values))

  it('offers a label for every option', () => {
    for (const [key, value] of everyValue) {
      expect(value.label, key).toBeTruthy()
    }
  })

  it('never sets a fixed font size that cannot shrink on a phone', () => {
    for (const [key, value] of everyValue) {
      const size = value.css['font-size']
      if (!size) continue
      // rem/em scale with the reader's settings and clamp() scales with the viewport.
      // A px value would be the one thing that does neither.
      expect(size, `${key} font-size`).not.toMatch(/\d+px/)
    }
  })

  it('never sets a width, position or float that could escape its column', () => {
    for (const [key, value] of everyValue) {
      for (const property of ['width', 'position', 'float', 'margin', 'display']) {
        expect(value.css[property], `${key} must not set ${property}`).toBeUndefined()
      }
    }
  })

  it('pairs every highlight with an explicit text colour', () => {
    for (const [key, value] of Object.entries(RICH_TEXT_STATES.highlight)) {
      expect(value.css['background-color'], key).toBeTruthy()
      // Inheriting the surrounding colour onto a fixed background is how highlighted
      // text ends up unreadable on a club page with a different palette.
      expect(value.css.color, `${key} must set its own text colour`).toBeTruthy()
    }
  })
})
