import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RichText } from '@/components/RichText'

/**
 * Renders editor output the way a page does.
 *
 * The failure this guards against is the worst kind a CMS has: formatting that appears
 * in the editor and silently does not appear on the site. Payload's own text converter
 * ignores node state entirely, so every size, typeface and colour an editor picks would
 * be lost without the custom converters — and nothing else in the build would notice.
 */

const render = (state: unknown): string =>
  renderToStaticMarkup(<RichText data={state as SerializedEditorState} />)

const doc = (...children: unknown[]): unknown => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
  },
})

const text = (value: string, extra: Record<string, unknown> = {}) => ({
  type: 'text',
  text: value,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
  ...extra,
})

const paragraph = (...children: unknown[]) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  children,
})

describe('editor formatting reaches the page', () => {
  it('renders nothing at all for empty content', () => {
    expect(renderToStaticMarkup(<RichText data={null} />)).toBe('')
  })

  it('renders plain text with no extra wrapper', () => {
    const html = render(doc(paragraph(text('Just words.'))))
    expect(html).toContain('Just words.')
    expect(html).not.toContain('<span')
  })

  it('keeps bold and italic', () => {
    // format is a bitmask: 1 = bold, 2 = italic.
    const html = render(doc(paragraph(text('Bold', { format: 1 }), text('Italic', { format: 2 }))))
    expect(html).toContain('<strong>Bold</strong>')
    expect(html).toContain('<em>Italic</em>')
  })

  it('applies a chosen text size', () => {
    const html = render(doc(paragraph(text('Large', { $: { size: 'lead' } }))))
    expect(html).toContain('clamp(')
    expect(html).toContain('Large')
  })

  it('applies a chosen colour and typeface together', () => {
    const html = render(doc(paragraph(text('Styled', { $: { color: 'brand', font: 'display' } }))))
    expect(html).toContain('#a8460a')
    expect(html).toContain('Saira Condensed')
  })

  it('combines node state with bold rather than dropping one of them', () => {
    const html = render(doc(paragraph(text('Both', { format: 1, $: { color: 'brand' } }))))
    expect(html).toContain('<strong>Both</strong>')
    expect(html).toContain('#a8460a')
  })

  it('renders text whose state is no longer offered as plain text', () => {
    const html = render(doc(paragraph(text('Old', { $: { size: 'gigantic' } }))))
    expect(html).toContain('Old')
    expect(html).not.toContain('<span style')
  })
})

describe('links written in the editor', () => {
  const link = (url: string, linkType = 'custom', newTab = false) => ({
    type: 'link',
    version: 3,
    format: '',
    indent: 0,
    direction: 'ltr',
    fields: { linkType, url, newTab },
    children: [text('click me')],
  })

  it('renders an external link', () => {
    const html = render(doc(paragraph(link('https://forms.gle/abc'))))
    expect(html).toContain('href="https://forms.gle/abc"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  /**
   * The "open in a new tab" checkbox is a decision the editor made about this link,
   * so it has to survive to the page in both directions — not just when ticked.
   */
  it('opens in a new tab when the editor asked for one', () => {
    const html = render(doc(paragraph(link('https://forms.gle/abc', 'custom', true))))
    expect(html).toContain('target="_blank"')
  })

  it('stays in the same tab when the editor did not', () => {
    const html = render(doc(paragraph(link('https://forms.gle/abc', 'custom', false))))
    expect(html).not.toContain('target="_blank"')
  })

  it('renders an internal path without opening a new tab', () => {
    const html = render(doc(paragraph(link('/join'))))
    expect(html).toContain('href="/join"')
    expect(html).not.toContain('target="_blank"')
  })

  /**
   * Payload's default link converter writes `node.fields.url` straight into the href.
   * A club editor is a student with a CMS login, not a trusted operator, and this is
   * the one place in rich text where they control an attribute.
   */
  it('refuses a javascript: URL, keeping the words as plain text', () => {
    const html = render(doc(paragraph(link('javascript:alert(1)'))))
    expect(html).toContain('click me')
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('<a')
  })

  it('resolves an internal document link to its real path', () => {
    const node = {
      type: 'link',
      version: 3,
      format: '',
      indent: 0,
      direction: 'ltr',
      fields: {
        linkType: 'internal',
        newTab: false,
        doc: { relationTo: 'clubs', value: { slug: 'diving' } },
      },
      children: [text('Diving')],
    }
    const html = render(doc(paragraph(node)))
    expect(html).toContain('href="/clubs/diving"')
  })

  it('does not render a dead link when an internal target has gone', () => {
    const node = {
      type: 'link',
      version: 3,
      format: '',
      indent: 0,
      direction: 'ltr',
      fields: { linkType: 'internal', newTab: false, doc: { relationTo: 'clubs', value: 7 } },
      children: [text('Missing')],
    }
    const html = render(doc(paragraph(node)))
    expect(html).toContain('Missing')
    expect(html).not.toContain('<a')
  })
})

describe('images placed in the editor', () => {
  const upload = (value: unknown) => ({
    type: 'upload',
    version: 3,
    format: '',
    relationTo: 'media',
    fields: {},
    value,
  })

  it('serves the generated variants rather than the original', () => {
    const html = render(
      doc(
        upload({
          id: 1,
          alt: 'A reef',
          mimeType: 'image/jpeg',
          url: '/api/media/file/original.jpg',
          width: 4000,
          height: 3000,
          sizes: {
            small: { url: '/api/media/file/small.webp', width: 480 },
            medium: { url: '/api/media/file/medium.webp', width: 900 },
          },
        }),
      ),
    )
    // React preserves the srcSet casing through renderToStaticMarkup; the browser
    // treats the attribute case-insensitively, so match the same way.
    expect(html.toLowerCase()).toContain('srcset')
    expect(html).toContain('small.webp 480w')
    expect(html).toContain('alt="A reef"')
  })

  /**
   * The default converter calls `.startsWith` on a mimeType it never checks, which
   * throws on an upload that has none and takes the whole page down with it.
   */
  it('does not crash on an upload with no mime type', () => {
    expect(() => render(doc(upload({ id: 2, alt: '', url: '/x.jpg' })))).not.toThrow()
  })

  it('links to a non-image upload instead of rendering a broken image', () => {
    const html = render(
      doc(
        upload({ id: 3, mimeType: 'application/pdf', url: '/safety.pdf', filename: 'safety.pdf' }),
      ),
    )
    expect(html).toContain('href="/safety.pdf"')
    expect(html).toContain('safety.pdf')
  })
})

describe('tables', () => {
  const cell = (value: string, header = 0) => ({
    type: 'tablecell',
    version: 1,
    headerState: header,
    colSpan: 1,
    rowSpan: 1,
    children: [paragraph(text(value))],
  })

  const table = {
    type: 'table',
    version: 1,
    children: [
      { type: 'tablerow', version: 1, children: [cell('Item', 1), cell('Cost', 1)] },
      { type: 'tablerow', version: 1, children: [cell('Mask hire', 0), cell('$5', 0)] },
    ],
  }

  it('renders header and body cells', () => {
    const html = render(doc(table))
    expect(html).toContain('<th>')
    expect(html).toContain('Mask hire')
  })

  /**
   * A five-column gear list cannot reflow to 390px, so the table scrolls inside its
   * own box. Without the wrapper the page itself would scroll sideways, which breaks
   * every other section on it.
   */
  it('wraps the table in a scrollable, keyboard-reachable region', () => {
    const html = render(doc(table))
    expect(html).toContain('class="rt-table"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('aria-label="Table"')
  })
})
