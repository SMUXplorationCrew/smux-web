import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrMc, mcOnly, ownClub, resolveClubId } from '@/access'

/**
 * Variants are generated once, on upload. The site then serves plain static files and
 * never resizes at request time.
 *
 * Widths match how images are actually used: 480 for phone cards, 900 for tablet and
 * in-column photos, 1800 for full-bleed heroes on desktop.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'club', 'updatedAt'],
  },
  access: {
    read: anyone,
    // Members are signed in but author nothing; uploads cost processing and storage
    // and they could not edit them afterwards anyway, since update uses ownClub.
    create: isEditorOrMc,
    update: ownClub,
    delete: mcOnly,
  },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    /**
     * The stored original is capped and re-encoded rather than kept as shot.
     *
     * The source library runs to 32MB per photo, none of which is ever served — the
     * site only ever uses the variants below. Keeping full-resolution DSLR files would
     * put half a gigabyte into object storage to no benefit. 2560px covers any
     * retina full-bleed use, and `withoutEnlargement` leaves small images alone.
     */
    resizeOptions: {
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    },
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      {
        name: 'small',
        width: 480,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'large',
        width: 1800,
        formatOptions: { format: 'webp', options: { quality: 76 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what is in the photo for screen readers. Required — an upload without it is rejected.',
      },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      admin: {
        description: 'Which club owns this image. Set automatically for club editors.',
      },
      hooks: {
        // An editor can only update media belonging to their club, so media uploaded
        // without a club would immediately become uneditable by the person who added
        // it. Defaulting it here keeps ownership consistent with `ownClub`.
        beforeChange: [
          ({ req: { user }, value }) => {
            if (value) return value
            if (user?.role === 'editor') return resolveClubId(user.club)
            return value
          },
        ],
      },
    },
  ],
}
