import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type React from 'react'
import { MediaImage } from '@/components/MediaImage'
import { SmartLink } from '@/components/SmartLink'
import { stylesForState } from '@/lib/richTextStates'
import { safeUrl } from '@/lib/url'
import type { Media } from '@/payload-types'

/**
 * How editor-authored rich text becomes markup.
 *
 * Payload's defaults are kept for everything ordinary and replaced only where they
 * would break one of this project's rules — links that skip URL validation, images
 * that bypass the variant pipeline, tables that cannot fit a phone, and text styling
 * that renders in the CMS but nowhere else.
 */

/** A relationship arrives populated at the query depths the site reads with. */
interface LinkDoc {
  relationTo?: string
  value?: number | string | { slug?: string | null; url?: string | null } | null
}

/**
 * Turns an internal link into a path.
 *
 * Payload's own converter logs an error and falls back to "#" when no resolver is
 * supplied — so every internal link an editor made would silently go nowhere.
 */
const internalHref = (doc: LinkDoc | null | undefined): string | null => {
  if (!doc?.value || typeof doc.value !== 'object') return null
  const target = doc.value

  switch (doc.relationTo) {
    case 'clubs':
      return target.slug ? `/clubs/${target.slug}` : null
    case 'events':
      return target.slug ? `/events/${target.slug}` : null
    case 'pages':
      return target.slug ? `/${target.slug}` : null
    // Media and resources are files: link straight at them.
    default:
      return target.url ?? null
  }
}

export const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  /**
   * The default converter handles the format bitmask — bold, italic, code and the
   * rest — but ignores node state entirely, so size, typeface, colour and highlight
   * would appear in the editor and vanish on the site. Delegating keeps every format
   * Payload supports, including any added later, and adds the state on top.
   */
  text: (args) => {
    const rendered = (defaultConverters.text as (a: typeof args) => React.ReactNode)(args)
    const style = stylesForState((args.node as { $?: unknown }).$)
    if (!style) return rendered

    return <span style={style}>{rendered}</span>
  },

  /**
   * Links typed into the editor get the same allow-list every other CMS-supplied
   * destination goes through. SmartLink renders nothing for an unsafe URL, so the
   * words stay on the page as plain text rather than becoming a live `javascript:`
   * link for every visitor.
   */
  link: (args) => {
    const node = args.node as unknown as {
      fields: { linkType?: string; url?: string | null; newTab?: boolean | null; doc?: LinkDoc }
      children: Parameters<typeof args.nodesToJSX>[0]['nodes']
    }
    const children = args.nodesToJSX({ nodes: node.children })
    const href =
      node.fields.linkType === 'internal' ? internalHref(node.fields.doc) : node.fields.url

    if (!safeUrl(href)) return <>{children}</>

    return (
      // The editor ticked, or did not tick, "open in a new tab" — that is a decision
      // they made about this link, so it wins over SmartLink's default for externals.
      <SmartLink href={href} target={node.fields.newTab ? '_blank' : '_self'}>
        {children}
      </SmartLink>
    )
  },

  autolink: (args) => {
    const node = args.node as unknown as {
      fields: { url?: string | null; newTab?: boolean | null }
      children: Parameters<typeof args.nodesToJSX>[0]['nodes']
    }
    const children = args.nodesToJSX({ nodes: node.children })
    if (!safeUrl(node.fields.url)) return <>{children}</>

    return (
      <SmartLink href={node.fields.url} target={node.fields.newTab ? '_blank' : '_self'}>
        {children}
      </SmartLink>
    )
  },

  /**
   * Images placed in rich text go through MediaImage like every other photo, so they
   * serve the WebP variants generated on upload rather than the full-size original,
   * and a HEIC that no browser can render degrades to a placeholder instead of a
   * broken image.
   *
   * The default converter also calls `.startsWith` on a mimeType it does not check,
   * which throws on any upload missing one and takes the whole page down with it.
   */
  upload: (args) => {
    const node = args.node as unknown as { value?: unknown; fields?: { alt?: string | null } }
    if (!node.value || typeof node.value !== 'object') return null

    const doc = node.value as Media
    const mimeType = doc.mimeType ?? ''

    if (mimeType && !mimeType.startsWith('image')) {
      return (
        <a href={doc.url ?? '#'} rel="noopener noreferrer" target="_blank">
          {doc.filename ?? 'Download'}
        </a>
      )
    }

    return (
      <MediaImage
        className="my-6 w-full"
        media={doc}
        placeholderLabel=""
        sizes="(max-width: 768px) 100vw, 720px"
      />
    )
  },

  /**
   * Tables are the one thing an editor can add that has no natural narrow form — a
   * five-column gear list cannot reflow to 390px. It scrolls inside its own container
   * so the table stays readable and the page body never scrolls sideways.
   *
   * Styling comes from the stylesheet rather than the default converter's inline
   * `1px solid #ccc`, which ignores the site's palette and cannot be overridden.
   */
  table: (args) => (
    // A <section> with a name is a region already, so no explicit role is needed.
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable box that cannot be focused cannot be scrolled without a mouse — tabindex="0" on the container is the documented fix for exactly this, not a stray tab stop.
    <section aria-label="Table" className="rt-table" tabIndex={0}>
      <table>
        <tbody>{args.nodesToJSX({ nodes: args.node.children })}</tbody>
      </table>
    </section>
  ),

  tablerow: (args) => <tr>{args.nodesToJSX({ nodes: args.node.children })}</tr>,

  tablecell: (args) => {
    const node = args.node as unknown as {
      headerState?: number
      colSpan?: number
      rowSpan?: number
      children: Parameters<typeof args.nodesToJSX>[0]['nodes']
    }
    const children = args.nodesToJSX({ nodes: node.children })
    const Cell = node.headerState && node.headerState > 0 ? 'th' : 'td'

    return (
      <Cell
        colSpan={node.colSpan && node.colSpan > 1 ? node.colSpan : undefined}
        rowSpan={node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined}
      >
        {children}
      </Cell>
    )
  },
})
