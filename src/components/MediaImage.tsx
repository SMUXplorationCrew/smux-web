import type { Media } from '@/payload-types'

/**
 * A media relationship comes back as an id or a populated document depending on query
 * depth. Only the populated form can be rendered.
 */
export const resolveMedia = (value: number | string | Media | null | undefined): Media | null => {
  if (!value) return null
  if (typeof value === 'object' && 'url' in value) return value as Media
  return null
}

interface Variant {
  url: string
  width: number
}

/**
 * The WebP variants sharp generated on upload, smallest first.
 *
 * Only variants that actually exist are returned: sharp does not upscale, so a 1280px
 * source has no 1800px variant. The original is the last resort — it may be a 6000px
 * JPEG, and for a HEIC source it is not renderable at all.
 */
const variantsOf = (doc: Media): Variant[] => {
  const sizes = (doc.sizes ?? {}) as Record<string, { url?: string | null; width?: number | null }>
  return ['small', 'medium', 'large']
    .map((key) => sizes[key])
    .filter((v): v is { url: string; width: number } => Boolean(v?.url && v?.width))
    .map((v) => ({ url: v.url, width: v.width }))
}

interface MediaImageProps {
  media: number | string | Media | null | undefined
  /** Rendered when there is no image yet. Keep it short — it appears on the page. */
  placeholderLabel?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** Fills its positioned parent instead of using intrinsic dimensions. */
  fill?: boolean
}

/**
 * Photography carries this site, and a missing photo must never collapse a layout, so
 * an absent image renders a tinted block in the club's accent instead.
 *
 * Deliberately a plain `<img>` rather than next/image. Variants are generated once on
 * upload and served as static files; routing them back through the image optimiser
 * would resize at request time, which is exactly what the project forbids.
 */
export const MediaImage = ({
  media,
  placeholderLabel = 'Photo to come',
  className = '',
  sizes = '100vw',
  priority = false,
  fill = false,
}: MediaImageProps) => {
  const doc = resolveMedia(media)
  const variants = doc ? variantsOf(doc) : []

  // A HEIC original with no variants cannot be displayed by any browser, so it counts
  // as missing rather than being rendered as a broken image.
  const unrenderableOriginal = doc?.mimeType === 'image/heic' || doc?.mimeType === 'image/heif'
  const src = variants.at(-1)?.url ?? (unrenderableOriginal ? null : doc?.url)

  if (!doc || !src) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-accent-tint ${
          fill ? 'absolute inset-0' : 'aspect-[4/3] w-full'
        } ${className}`}
      >
        <span className="font-display text-eyebrow tracking-eyebrow text-muted uppercase">
          {placeholderLabel}
        </span>
      </div>
    )
  }

  // alt is required at the collection level, so an empty string here means the caller
  // marked this image decorative.
  const alt = doc.alt ?? ''
  const srcSet = variants.length > 1 ? variants.map((v) => `${v.url} ${v.width}w`).join(', ') : undefined

  return (
    <img
      alt={alt}
      className={fill ? `absolute inset-0 size-full object-cover ${className}` : className}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      height={fill ? undefined : (doc.height ?? undefined)}
      loading={priority ? 'eager' : 'lazy'}
      sizes={srcSet ? sizes : undefined}
      src={src}
      srcSet={srcSet}
      width={fill ? undefined : (doc.width ?? undefined)}
    />
  )
}
