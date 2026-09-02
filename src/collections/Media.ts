import type { CollectionConfig } from 'payload'
import { anyone, isAuthenticated, mcOnly, ownClub, resolveClubId } from '@/access'

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
    create: isAuthenticated,
    update: ownClub,
    delete: mcOnly,
  },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
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
