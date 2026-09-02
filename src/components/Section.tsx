import type React from 'react'

/** Page-width container. One place to change the site's measure. */
export const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <div className={`mx-auto w-full max-w-7xl px-5 ${className}`}>{children}</div>

interface SectionProps {
  children: React.ReactNode
  /** Small uppercase label above the heading. */
  eyebrow?: string
  title?: string
  className?: string
  id?: string
}

export const Section = ({ children, eyebrow, title, className = '', id }: SectionProps) => (
  <section className={`py-14 md:py-20 ${className}`} id={id}>
    <Container>
      {eyebrow ? (
        <p className="font-display text-eyebrow tracking-eyebrow text-orange-text uppercase">
          {eyebrow}
        </p>
      ) : null}
      {title ? <h2 className="mt-2 text-section">{title}</h2> : null}
      <div className={eyebrow || title ? 'mt-8' : ''}>{children}</div>
    </Container>
  </section>
)

/**
 * Shown wherever content has not been added yet. Says what is missing rather than
 * rendering nothing, so a half-populated site reads as unfinished, not broken.
 */
export const EmptyState = ({ children }: { children: React.ReactNode }) => (
  <p className="border border-line border-dashed p-6 text-meta text-muted">{children}</p>
)
