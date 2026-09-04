import type React from 'react'
import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/Section'
import { SmartLink } from '@/components/SmartLink'
import type { Page } from '@/payload-types'

/**
 * Renders the section palette editors build pages from. The same renderer serves the
 * editorial pages, a club's extra sections and the home page's, so a block behaves
 * identically wherever it is placed.
 *
 * Anything unrecognised is skipped rather than crashing the page — a block type removed
 * from the config should not take a published page down with it.
 */
type PageBlock = NonNullable<Page['blocks']>[number]

/** Blocks come from three parents; the generated types are structurally the same. */
export type BlockList = PageBlock[] | null | undefined

const GRID_COLUMNS: Record<string, string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-2 md:grid-cols-3',
  '4': 'grid-cols-2 md:grid-cols-4',
}

/**
 * The optional label and heading most blocks carry. Rendered as h2 because a block is a
 * section of a page whose title is already the h1.
 */
const BlockHeading = ({
  eyebrow,
  heading,
}: {
  eyebrow?: string | null
  heading?: string | null
}) => {
  if (!eyebrow && !heading) return null

  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="font-display text-eyebrow tracking-eyebrow text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      {heading ? <h2 className="mt-2 text-section">{heading}</h2> : null}
    </div>
  )
}

const BlockSection = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <section className={`py-12 md:py-16 ${className}`}>
    <Container>
      <Reveal>{children}</Reveal>
    </Container>
  </section>
)

export const Blocks = ({ blocks }: { blocks: BlockList }) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block: PageBlock) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <BlockSection key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <div className="max-w-3xl">
                  <RichText data={block.content} />
                </div>
              </BlockSection>
            )

          case 'imageText':
            return (
              <BlockSection key={block.id}>
                <div
                  className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                    block.imagePosition === 'right' ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MediaImage fill media={block.image} sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <RichText data={block.content} />
                </div>
              </BlockSection>
            )

          case 'cards':
            return (
              <BlockSection key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {block.cards?.map((card) => {
                    const body = (
                      <>
                        {card.icon ? (
                          <div className="relative mb-4 size-12 overflow-hidden">
                            <MediaImage fill media={card.icon} placeholderLabel="" sizes="48px" />
                          </div>
                        ) : null}
                        <h3 className="text-card">{card.title}</h3>
                        {card.body ? <p className="mt-2 text-meta text-copy">{card.body}</p> : null}
                      </>
                    )

                    // A card with a link becomes one target, rather than a card
                    // containing a small link that is easy to miss on a phone.
                    if (card.linkUrl) {
                      return (
                        <SmartLink
                          className="group flex flex-col border border-line bg-off p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
                          href={card.linkUrl}
                          key={card.id ?? card.title}
                        >
                          {body}
                          <span className="mt-4 font-display text-eyebrow tracking-eyebrow text-accent uppercase">
                            {card.linkLabel || 'Read more'}
                            <span aria-hidden="true" className="arrow ml-1 inline-block">
                              &rarr;
                            </span>
                          </span>
                        </SmartLink>
                      )
                    }

                    return (
                      <div className="border border-line bg-off p-6" key={card.id ?? card.title}>
                        {body}
                      </div>
                    )
                  })}
                </div>
              </BlockSection>
            )

          case 'gallery': {
            const photos = (Array.isArray(block.images) ? block.images : []).filter(
              (photo): photo is Exclude<typeof photo, number | string> =>
                typeof photo === 'object' && photo !== null,
            )
            if (photos.length === 0) return null

            return (
              <BlockSection key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <div className={`grid gap-3 ${GRID_COLUMNS[block.columns ?? '4']}`}>
                  {photos.map((photo) => (
                    <div className="relative aspect-square overflow-hidden" key={photo.id}>
                      <MediaImage
                        className="transition-transform duration-500 hover:scale-[1.04]"
                        fill
                        media={photo}
                        placeholderLabel=""
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </BlockSection>
            )
          }

          case 'linkList':
            return (
              <BlockSection key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <ul className="max-w-3xl divide-y divide-line border-y border-line">
                  {block.links?.map((link) => (
                    <li key={link.id ?? link.url}>
                      <SmartLink
                        className="group flex min-h-11 items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                        href={link.url}
                      >
                        <span>
                          <span className="font-display text-lead uppercase">{link.label}</span>
                          {link.description ? (
                            <span className="mt-0.5 block text-meta text-muted">
                              {link.description}
                            </span>
                          ) : null}
                        </span>
                        <span
                          aria-hidden="true"
                          className="arrow shrink-0 font-display text-lead text-accent"
                        >
                          &rarr;
                        </span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </BlockSection>
            )

          case 'stats':
            return (
              <BlockSection className="bg-off" key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {block.items?.map((item) => (
                    <div key={item.id ?? item.label}>
                      <p className="font-display text-section text-ink tabular-nums">
                        {item.value}
                      </p>
                      <p className="text-meta text-muted">{item.label}</p>
                    </div>
                  ))}
                </div>
              </BlockSection>
            )

          case 'quote':
            return (
              <BlockSection key={block.id}>
                <figure className="max-w-3xl border-l-4 border-accent pl-6">
                  <blockquote className="text-card text-ink italic">
                    &ldquo;{block.quote}&rdquo;
                  </blockquote>
                  {block.attribution ? (
                    <figcaption className="mt-4 font-display text-eyebrow tracking-eyebrow text-muted uppercase">
                      {block.attribution}
                      {block.role ? <span className="normal-case"> · {block.role}</span> : null}
                    </figcaption>
                  ) : null}
                </figure>
              </BlockSection>
            )

          case 'faq':
            return (
              <BlockSection key={block.id}>
                <BlockHeading eyebrow={block.eyebrow} heading={block.heading} />
                <div className="max-w-3xl divide-y divide-line border-y border-line">
                  {block.items?.map((item) => (
                    <details className="faq group py-4" key={item.id ?? item.question}>
                      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-display text-lead uppercase">
                        {item.question}
                        <span aria-hidden="true" className="chevron shrink-0 text-accent">
                          +
                        </span>
                      </summary>
                      <div className="mt-2">
                        <RichText data={item.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </BlockSection>
            )

          case 'cta': {
            const tone = block.tone ?? 'dark'
            const ground =
              tone === 'accent' ? 'bg-accent' : tone === 'quiet' ? 'bg-off' : 'bg-ink-deep'
            const onDark = tone !== 'quiet'

            return (
              <section className={`my-10 py-14 md:py-16 ${ground}`} key={block.id}>
                <Container>
                  <Reveal>
                    <h2 className={`text-section ${onDark ? 'text-paper' : 'text-ink'}`}>
                      {block.heading}
                    </h2>
                    {block.body ? (
                      <p
                        className={`mt-3 max-w-xl text-lead ${
                          onDark ? 'text-paper/80' : 'text-copy'
                        }`}
                      >
                        {block.body}
                      </p>
                    ) : null}
                    {block.buttonUrl && block.buttonLabel ? (
                      <SmartLink
                        className={`mt-8 inline-flex min-h-11 items-center px-6 font-display text-meta tracking-button uppercase transition-transform duration-200 hover:-translate-y-0.5 ${
                          tone === 'accent'
                            ? 'bg-paper text-ink'
                            : tone === 'quiet'
                              ? 'bg-accent text-paper'
                              : 'bg-orange text-ink'
                        }`}
                        href={block.buttonUrl}
                      >
                        {block.buttonLabel}
                      </SmartLink>
                    ) : null}
                  </Reveal>
                </Container>
              </section>
            )
          }

          default:
            return null
        }
      })}
    </>
  )
}
