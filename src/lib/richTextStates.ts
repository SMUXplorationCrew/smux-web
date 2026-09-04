/**
 * The formatting an editor can apply beyond bold and italic — text size, typeface,
 * colour and highlight — defined once, here.
 *
 * Two things make this safe to hand to a non-developer:
 *
 * 1. **It is a fixed menu, not a free-form style box.** Payload's TextStateFeature
 *    stores only the chosen key on the text node ("size": "lead"); the CSS lives in
 *    this file. Nobody can type a 90px font or a colour that vanishes on the page,
 *    and if a value here turns out wrong it is corrected in one place for every
 *    document already written.
 *
 * 2. **Both ends read this same object.** The admin panel applies these declarations
 *    live in the editor, and the site's converter applies them when rendering. There
 *    is no second copy to drift, which is the usual way "it looked right in the CMS"
 *    happens.
 *
 * Sizes are `clamp()` rather than fixed rem, so editor-chosen type still scales
 * between a phone and a desktop instead of overflowing a 390px column. Colours are
 * measured against every ground they can land on — paper, off-white, all six club
 * tints and both highlights — and clear 4.5:1 on the worst of them.
 */

export interface RichTextStateValue {
  label: string
  /** Hyphenated CSS, the shape Payload's StyleObject expects. */
  css: Record<string, string>
}

export type RichTextStateMap = Record<string, Record<string, RichTextStateValue>>

/** The display face, repeated because the admin panel cannot see the site's tokens. */
const DISPLAY_STACK = "'Saira Condensed', 'Arial Narrow', Impact, sans-serif"
const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

export const RICH_TEXT_STATES = {
  size: {
    lead: {
      label: 'Large',
      css: {
        'font-size': 'clamp(1.0625rem, 1rem + 0.45vw, 1.1875rem)',
        'line-height': '1.5',
      },
    },
    small: {
      label: 'Small',
      css: { 'font-size': '0.9375rem' },
    },
  },
  font: {
    display: {
      label: 'Condensed',
      css: {
        'font-family': DISPLAY_STACK,
        'font-weight': '700',
        'letter-spacing': '0.01em',
      },
    },
    mono: {
      label: 'Monospace',
      css: { 'font-family': MONO_STACK, 'font-size': '0.94em' },
    },
  },
  color: {
    brand: {
      label: 'Brand orange',
      // Darker than the logo orange, which is 2.83:1 and unreadable at this size.
      css: { color: '#a8460a' },
    },
    muted: {
      label: 'Muted',
      css: { color: '#645e5b' },
    },
    strong: {
      label: 'Strong',
      css: { color: '#231f20' },
    },
  },
  highlight: {
    orange: {
      label: 'Orange highlight',
      css: {
        'background-color': '#fde3cf',
        color: '#231f20',
        padding: '0.05em 0.28em',
        'border-radius': '2px',
      },
    },
    grey: {
      label: 'Grey highlight',
      css: {
        'background-color': '#eeebe8',
        color: '#231f20',
        padding: '0.05em 0.28em',
        'border-radius': '2px',
      },
    },
  },
} satisfies RichTextStateMap

/** How a text node's chosen states arrive in the serialised document. */
export type RichTextState = Partial<Record<keyof typeof RICH_TEXT_STATES, string>>

const camel = (property: string): string =>
  property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

/**
 * Merges the CSS for whatever states a text node carries into React's style shape.
 *
 * Returns undefined for an unstyled node so the common case adds no wrapper element
 * at all. Unknown keys and values are ignored rather than trusted: the document may
 * have been written when this file offered something it no longer does, and the right
 * answer then is plain text, not a crash or a half-applied style.
 */
export const stylesForState = (state: unknown): Record<string, string> | undefined => {
  if (!state || typeof state !== 'object') return undefined

  const merged: Record<string, string> = {}
  const states = RICH_TEXT_STATES as unknown as RichTextStateMap

  for (const [key, value] of Object.entries(state as Record<string, unknown>)) {
    if (typeof value !== 'string') continue
    const declarations = states[key]?.[value]?.css
    if (!declarations) continue
    for (const [property, css] of Object.entries(declarations)) {
      merged[camel(property)] = css
    }
  }

  return Object.keys(merged).length > 0 ? merged : undefined
}
