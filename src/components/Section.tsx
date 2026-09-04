import type React from 'react'
import { Reveal } from '@/components/Reveal'

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
  /** One sentence under the heading, for sections that need a line of context. */
  intro?: string | null
  className?: string
  id?: string
  /**
   * Heading level for `title`. Defaults to h2 because most sections sit under a page
   * heading — but a listing page whose Section *is* the page needs h1, or the page
   * ships with no top-level heading at all.
   */
  titleAs?: 'h1' | 'h2'
}

export const Section = ({
  children,
  eyebrow,
  title,
  intro,
  className = '',
  id,
  titleAs = 'h2',
}: SectionProps) => (
  <section className={`py-14 md:py-20 ${className}`} id={id}>
    <Container>
      {eyebrow ? (
        <p className="flex items-center gap-3 font-display text-eyebrow tracking-eyebrow text-accent uppercase">
          {/* A short accent rule ties the label to the club palette without spending a
              whole coloured band on it. */}
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        titleAs === 'h1' ? (
          <h1 className="mt-3 text-section">{title}</h1>
        ) : (
          <h2 className="mt-3 text-section">{title}</h2>
        )
      ) : null}
      {intro ? <p className="mt-3 max-w-2xl text-lead text-copy">{intro}</p> : null}
      <Reveal className={eyebrow || title || intro ? 'mt-8' : ''}>{children}</Reveal>
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
