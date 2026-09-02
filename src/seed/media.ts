import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

/**
 * Uploads the club photo library into the Media collection.
 *
 * Files live outside the repo (they are large originals, and the repo should not carry
 * binaries), so the path is configurable via SEED_MEDIA_DIR. Anything missing is warned
 * about and skipped rather than aborting the seed — a partial photo set should still
 * produce a working site.
 */

export const MEDIA_ROOT =
  process.env.SEED_MEDIA_DIR ?? '/Users/DarthAryan/Downloads/SMU/Projects/SMUX Club Pictures'

export interface UploadedMedia {
  id: number | string
}

/**
 * HEIC is a trap worth naming.
 *
 * It uploads happily and serves a 200, but no browser renders it. Worse, this build of
 * sharp reads HEIC *metadata* while being unable to decode its pixels ("support for
 * this compression format has not been built in"), so Payload's resize step silently
 * produces no variants and the image is doubly broken.
 *
 * Convert ahead of time instead — on macOS, `sips -s format jpeg in.HEIC --out out.jpg`
 * — and point the content file at the JPEG. This refuses HEIC loudly rather than
 * letting a blank image reach the site.
 */
const HEIC = /\.hei[cf]$/i

/**
 * Payload derives width, height and the WebP variants itself via sharp, so this only
 * has to hand over a path and the alt text that the collection requires.
 */
export const uploadImage = async (
  payload: Payload,
  relativePath: string,
  alt: string,
  clubId?: number | string,
): Promise<UploadedMedia | null> => {
  const sourcePath = path.join(MEDIA_ROOT, relativePath)

  if (!existsSync(sourcePath)) {
    console.warn(`  ! missing, skipped: ${relativePath}`)
    return null
  }

  if (HEIC.test(sourcePath)) {
    throw new Error(
      `HEIC cannot be rendered by browsers and sharp cannot decode it here: ${relativePath}\n` +
        `  Convert it first:  sips -s format jpeg "<file>.HEIC" --out "<file>.jpg"\n` +
        `  then point src/seed/content.ts at the .jpg.`,
    )
  }

  try {
    const filePath = sourcePath
    const doc = await payload.create({
      collection: 'media',
      data: { alt, ...(clubId ? { club: clubId as number } : {}) },
      filePath,
    })
    return { id: doc.id }
  } catch (error) {
    console.warn(`  ! upload failed for ${relativePath}:`, (error as Error)?.message)
    return null
  }
}

/** Uploads several images, dropping any that fail so one bad file cannot stop a seed. */
export const uploadMany = async (
  payload: Payload,
  items: { file: string; alt: string }[],
  clubId?: number | string,
): Promise<(number | string)[]> => {
  const ids: (number | string)[] = []
  for (const item of items) {
    const uploaded = await uploadImage(payload, item.file, item.alt, clubId)
    if (uploaded) ids.push(uploaded.id)
  }
  return ids
}
