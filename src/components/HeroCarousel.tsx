'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MediaImage } from '@/components/MediaImage'
import type { Media } from '@/payload-types'

interface HeroCarouselProps {
  images: (number | string | Media)[]
  placeholderLabel?: string
  intervalMs?: number
}

/**
 * The auto-scrolling hero the wireframe asks for.
 *
 * Cross-fade rather than slide: the headline sits on top of these images, and sliding
 * drags the eye sideways while the text stays put, which reads as a glitch. Fading
 * changes the photograph without disturbing anything above it.
 *
 * Every image is rendered from the first frame and only opacity animates, so the page
 * is complete at rest — a shared link or a thumbnail never catches it mid-transition or
 * blank. A single image skips the timer entirely.
 */
export const HeroCarousel = ({
  images,
  placeholderLabel = 'SMUX',
  intervalMs = 6000,
}: HeroCarouselProps) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    // Someone who asked for less motion gets a still image, not a slower carousel.
    if (images.length < 2 || paused || reduced.current) return
    const t = setInterval(advance, intervalMs)
    return () => clearInterval(t)
  }, [images.length, paused, advance, intervalMs])

  if (images.length === 0) {
    return <MediaImage fill media={null} placeholderLabel={placeholderLabel} sizes="100vw" />
  }

  return (
    // A labelled region, not a bare div: the pause-on-hover and pause-on-focus
    // handlers only make sense on something assistive tech can announce, and the
    // roledescription is the ARIA carousel pattern.
    <section
      aria-label="Photo carousel"
      aria-roledescription="carousel"
      className="absolute inset-0"
      onBlurCapture={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div
          aria-hidden={i === index ? undefined : 'true'}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          key={typeof img === 'object' && img !== null ? (img as Media).id : String(img)}
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <MediaImage
            fill
            media={img}
            placeholderLabel={placeholderLabel}
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              aria-current={i === index}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-paper' : 'w-1.5 bg-paper/50 hover:bg-paper/80'
              }`}
              key={typeof img === 'object' && img !== null ? (img as Media).id : String(img)}
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
