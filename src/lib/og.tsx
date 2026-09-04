import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** The six club accents, mirrored from globals.css so a card is themed like its page. */
const ACCENTS: Record<string, string> = {
  diving: '#0086a4',
  kayaking: '#2d78bd',
  trekking: '#2a904b',
  biking: '#bc4757',
  skating: '#8160b5',
  xseed: '#9d7200',
}

/**
 * A shared card for every social preview.
 *
 * Drawn rather than photographed on purpose: a card generated from a hero image needs
 * that image fetched and re-encoded on every request, and any event without one falls
 * back to nothing. Type and the club's accent always render, for every route.
 */
export const ogImage = ({
  title,
  eyebrow,
  meta,
  accent,
}: {
  title: string
  eyebrow?: string
  meta?: string
  accent?: string | null
}) => {
  const bar = ACCENTS[accent ?? ''] ?? '#f4751f'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#161312',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {Object.values(ACCENTS).map((c) => (
          <div key={c} style={{ width: 88, height: 8, background: c }} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: bar,
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontSize: title.length > 44 ? 68 : 88,
            lineHeight: 1.02,
            color: '#ffffff',
            fontWeight: 800,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {title}
        </div>
        {meta ? <div style={{ fontSize: 30, color: '#c8c1bc' }}>{meta}</div> : null}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Satori requires an explicit display on any element with more than one
            child, and this one holds text plus a coloured span. */}
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            color: '#ffffff',
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          SMU<span style={{ color: '#ff9138' }}>X</span>
        </div>
        <div style={{ fontSize: 24, color: '#77706c' }}>SMUXploration Crew</div>
      </div>
    </div>,
    OG_SIZE,
  )
}
