import { Blocks } from '@/components/Blocks'
import { Container, EmptyState } from '@/components/Section'
import type { Page } from '@/payload-types'

/**
 * Shared shell for the editorial routes — /about, /join, /contact. Each is a Pages
 * document, so the copy changes without a deploy; only the fallback heading is in code,
 * for the window before someone has created the document.
 */
export const EditorialPage = ({
  page,
  fallbackTitle,
  fallbackNote,
}: {
  page: Page | null
  fallbackTitle: string
  fallbackNote: string
}) => (
  <>
    <section className="border-b border-line bg-off py-14">
      <Container>
        <h1 className="text-section">{page?.title ?? fallbackTitle}</h1>
        {page?.intro ? <p className="mt-3 max-w-2xl text-lead text-copy">{page.intro}</p> : null}
      </Container>
    </section>

    {page ? (
      <Blocks blocks={page.blocks} />
    ) : (
      <Container className="py-14">
        <EmptyState>{fallbackNote}</EmptyState>
      </Container>
    )}
  </>
)
