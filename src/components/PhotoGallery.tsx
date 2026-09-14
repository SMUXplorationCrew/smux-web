'use client'
import { useEffect, useRef, useState } from 'react'
import { MediaImage } from '@/components/MediaImage'
import type { Media } from '@/payload-types'
export function PhotoGallery({ photos }: { photos: Media[] }) {
  const [active, setActive] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive((n) => (n + 1) % photos.length)
      if (e.key === 'ArrowLeft') setActive((n) => (n + photos.length - 1) % photos.length)
    }
    d.addEventListener('keydown', key)
    return () => d.removeEventListener('keydown', key)
  }, [photos.length])
  const photo = photos[active]
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((p, i) => (
          <button
            type="button"
            className="relative aspect-square overflow-hidden"
            key={p.id}
            aria-label={`View photo ${i + 1}: ${p.alt || 'Adventure photo'}`}
            onClick={() => {
              setActive(i)
              dialog.current?.showModal()
            }}
          >
            <MediaImage fill media={p} sizes="(max-width:768px) 50vw,25vw" />
          </button>
        ))}
      </div>
      <dialog className="lightbox" ref={dialog} aria-label="Photo viewer">
        {photo && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p>
                {active + 1} / {photos.length}
              </p>
              <form method="dialog">
                <button className="button button-quiet" type="submit">
                  Close photo viewer
                </button>
              </form>
            </div>
            <div className="relative h-[65dvh]">
              <MediaImage className="!object-contain" fill media={photo} sizes="90vw" />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <button
                className="button button-quiet"
                type="button"
                onClick={() => setActive((active + photos.length - 1) % photos.length)}
              >
                Previous
              </button>
              <p className="text-center">
                {photo.caption || photo.alt}
                {photo.credit && <span className="block text-meta">Photo: {photo.credit}</span>}
              </p>
              <button
                className="button button-quiet"
                type="button"
                onClick={() => setActive((active + 1) % photos.length)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}
