import type React from 'react'
import type { LinkKind } from '@/lib/socials'

/**
 * Platform glyphs, drawn inline rather than pulled from an icon package.
 *
 * Ten glyphs do not justify a dependency, and inline SVG inherits `currentColor`, so
 * every icon themes with the surface it sits on — the same component works on the paper
 * ground of the contact page and the near-black of the footer with no variant.
 *
 * Some marks read better as outlines than as solids (an envelope, a globe, a chain
 * link), so each entry says which it is instead of forcing everything to be filled.
 */

interface Glyph {
  node: React.ReactNode
  /** Drawn as strokes rather than a filled silhouette. */
  stroke?: boolean
}

const GLYPHS: Record<LinkKind, Glyph> = {
  telegram: {
    node: (
      <path d="M21.9 4.3 18.7 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L6.3 13.1 1.5 11.6c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.2 1.5z" />
    ),
  },
  instagram: {
    node: (
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.6 1.5 1.5 0 0 1 1.5 1.6z" />
    ),
  },
  whatsapp: {
    node: (
      <>
        <path d="M12 2.2A9.8 9.8 0 0 0 3.6 17L2.3 21.7l4.85-1.27A9.8 9.8 0 1 0 12 2.2Zm0 1.9a7.9 7.9 0 1 1-4.03 14.7l-.35-.2-2.87.75.77-2.8-.23-.36A7.9 7.9 0 0 1 12 4.1Z" />
        <path d="M9.4 7.6c-.17-.4-.35-.4-.51-.41h-.44a.85.85 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.93 4.5 4.5 0 0 0 .95 2.4 10.3 10.3 0 0 0 3.95 3.48 4.9 4.9 0 0 0 2.21.46 2.4 2.4 0 0 0 1.57-1.11 1.94 1.94 0 0 0 .14-1.1c-.06-.1-.21-.16-.45-.28s-1.37-.68-1.59-.75-.37-.12-.52.11-.6.75-.74.9-.27.18-.5.06a6.35 6.35 0 0 1-1.87-1.15 7 7 0 0 1-1.29-1.6c-.13-.23 0-.36.1-.48s.23-.27.35-.4a1.57 1.57 0 0 0 .23-.4.42.42 0 0 0 0-.4c-.06-.12-.52-1.26-.72-1.72Z" />
      </>
    ),
  },
  tiktok: {
    node: (
      <path d="M16.6 2h-3.1v13.4a2.7 2.7 0 1 1-2.3-2.7v-3.2a5.9 5.9 0 1 0 5.4 5.9V8.9a7 7 0 0 0 4.1 1.3V7a4 4 0 0 1-4.1-4z" />
    ),
  },
  youtube: {
    node: (
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.3 5 12 5 12 5s-6.3 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.7 19 12 19 12 19s6.3 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2Z" />
    ),
  },
  facebook: {
    node: (
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    ),
  },
  linkedin: {
    node: (
      <path d="M6.9 21.5H3.3V9.2h3.6zM5.1 7.6a2.1 2.1 0 1 1 2.1-2.1 2.1 2.1 0 0 1-2.1 2.1zM21.5 21.5h-3.6v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1H10V9.2h3.4v1.7a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5z" />
    ),
  },
  discord: {
    node: (
      <path d="M19.9 5.6A16.3 16.3 0 0 0 15.8 4.3l-.25.5a15.1 15.1 0 0 1 3.6 1.5 14.4 14.4 0 0 0-10.3 0 15.1 15.1 0 0 1 3.6-1.5l-.25-.5A16.3 16.3 0 0 0 8.1 5.6C5.3 9.7 4.5 13.7 4.9 17.7a16.4 16.4 0 0 0 5 2.5l.6-1a11 11 0 0 1-1.7-.83l.42-.32a11.7 11.7 0 0 0 10.06 0l.42.32a11 11 0 0 1-1.7.83l.6 1a16.4 16.4 0 0 0 5-2.5c.47-4.63-.8-8.6-3.15-12.1ZM9.7 15.5a1.9 1.9 0 0 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm4.6 0a1.9 1.9 0 0 1 0-3.8 1.9 1.9 0 0 1 0 3.8Z" />
    ),
  },
  website: {
    stroke: true,
    node: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
      </>
    ),
  },
  email: {
    stroke: true,
    node: (
      <>
        <rect height="14" rx="2" width="19" x="2.5" y="5" />
        <path d="m3.2 7.2 8.8 6 8.8-6" />
      </>
    ),
  },
  link: {
    stroke: true,
    node: (
      <>
        <path d="M10.3 13.7a4.3 4.3 0 0 0 6.4.5l2.1-2.1a4.3 4.3 0 0 0-6.1-6.1l-1.2 1.2" />
        <path d="M13.7 10.3a4.3 4.3 0 0 0-6.4-.5l-2.1 2.1a4.3 4.3 0 0 0 6.1 6.1l1.2-1.2" />
      </>
    ),
  },
}

/**
 * Brand colours, used only on hover and focus. The resting row stays monochrome so a
 * strip of eight platforms reads as one object rather than as eight competing logos —
 * the colour is a response to the pointer, not decoration.
 */
export const BRAND_COLOR: Partial<Record<LinkKind, string>> = {
  telegram: '#229ed9',
  instagram: '#d6336c',
  whatsapp: '#1da851',
  tiktok: '#c31a45',
  youtube: '#e01b1b',
  facebook: '#1877f2',
  linkedin: '#0a66c2',
  discord: '#5865f2',
}

export const SocialIcon = ({
  kind,
  className = 'size-5',
}: {
  kind: LinkKind
  className?: string
}) => {
  const glyph = GLYPHS[kind] ?? GLYPHS.link

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={glyph.stroke ? 'none' : 'currentColor'}
      focusable="false"
      stroke={glyph.stroke ? 'currentColor' : undefined}
      strokeLinecap={glyph.stroke ? 'round' : undefined}
      strokeLinejoin={glyph.stroke ? 'round' : undefined}
      strokeWidth={glyph.stroke ? 1.7 : undefined}
      viewBox="0 0 24 24"
    >
      {glyph.node}
    </svg>
  )
}
