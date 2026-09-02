import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/Section'
import type { Page } from '@/payload-types'

type PageBlock = NonNullable<Page['blocks']>[number]

/**
 * Renders the block set defined on the Pages collection. Anything unrecognised is
 * skipped rather than crashing the page — a block type removed from the config should
 * not take a published page down with it.
 */
export const Blocks = ({ blocks }: { blocks: Page['blocks'] }) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block: PageBlock) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <section className="py-10" key={block.id}>
                <Container>
                  <div className="max-w-3xl">
                    <RichText data={block.content} />
                  </div>
                </Container>
              </section>
            )

          case 'imageText':
            return (
              <section className="py-10" key={block.id}>
                <Container>
                  <div
                    className={`grid items-center gap-8 md:grid-cols-2 ${
                      block.imagePosition === 'right' ? 'md:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="relative aspect-[4/3]">
                      <MediaImage fill media={block.image} sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <RichText data={block.content} />
                  </div>
                </Container>
              </section>
            )

          case 'cards':
            return (
              <section className="py-10" key={block.id}>
                <Container>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {block.cards?.map((card) => (
                      <div className="bg-off p-6" key={card.id ?? card.title}>
                        <h3 className="text-card">{card.title}</h3>
                        {card.body ? <p className="mt-2 text-meta text-copy">{card.body}</p> : null}
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            )

          case 'cta':
            return (
              <section className="my-10 bg-ink-deep py-14" key={block.id}>
                <Container>
                  <h2 className="text-section text-paper">{block.heading}</h2>
                  {block.body ? (
                    <p className="mt-3 max-w-xl text-lead text-paper/80">{block.body}</p>
                  ) : null}
                  {block.buttonUrl && block.buttonLabel ? (
                    <Link
                      className="mt-6 inline-flex min-h-11 items-center bg-orange px-6 font-display text-meta tracking-button text-ink uppercase hover:opacity-90"
                      href={block.buttonUrl}
                    >
                      {block.buttonLabel}
                    </Link>
                  ) : null}
                </Container>
              </section>
            )

          case 'faq':
            return (
              <section className="py-10" key={block.id}>
                <Container>
                  <div className="max-w-3xl divide-y divide-line border-y border-line">
                    {block.items?.map((item) => (
                      <details className="group py-4" key={item.id ?? item.question}>
                        <summary className="flex min-h-11 cursor-pointer items-center font-display text-lead uppercase">
                          {item.question}
                        </summary>
                        <div className="mt-2">
                          <RichText data={item.answer} />
                        </div>
                      </details>
                    ))}
                  </div>
                </Container>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
