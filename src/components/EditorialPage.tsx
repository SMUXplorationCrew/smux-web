import { Blocks } from '@/components/Blocks'
import { MediaImage } from '@/components/MediaImage'
import { Container, EmptyState } from '@/components/Section'
import type { Page } from '@/payload-types'

/**
 * Shared shell for the editorial routes — /about, /join, /contact. Each is a Pages
 * document, so the copy changes without a deploy; only the fallback heading is in code,
 * for the window before someone has created the document.
 *
 * A page with a hero image opens on the photo; one without opens on a plain band. Both
 * are deliberate designs rather than a full-width grey rectangle standing in for a
 * missing photo, because most of these pages will never have one.
 */
export const EditorialPage = ({
  page,
  fallbackTitle,
  fallbackNote,
}: {
  page: Page | null
  fallbackTitle: string
  fallbackNote: string
}) => {
  const hero = page?.heroImage

  return (
    <>
      {hero ? (
        <section className="relative isolate flex min-h-[42vh] items-end overflow-hidden bg-ink-deep">
          <div className="absolute inset-0">
            <MediaImage fill media={hero} placeholderLabel="" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/55 to-ink-deep/20" />
          </div>
          <Container className="relative py-14">
            <h1 className="text-hero-sm text-paper">{page?.title ?? fallbackTitle}</h1>
            {page?.intro ? (
              <p className="mt-3 max-w-2xl text-lead text-paper/85">{page.intro}</p>
            ) : null}
          </Container>
        </section>
      ) : (
        <section className="border-b border-line bg-off py-14">
          <Container>
            <h1 className="text-section">{page?.title ?? fallbackTitle}</h1>
            {page?.intro ? (
              <p className="mt-3 max-w-2xl text-lead text-copy">{page.intro}</p>
            ) : null}
          </Container>
        </section>
      )}

      {page ? (
        <Blocks blocks={page.blocks} />
      ) : (
        <Container className="py-14">
          <EmptyState>{fallbackNote}</EmptyState>
        </Container>
      )}
    </>
  )
}
