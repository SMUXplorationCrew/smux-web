import type { CollectionConfig } from 'payload'
import { anyone, mcOnly, ownClub, resolveClubId } from '@/access'
import { revalidateAlbum } from '@/hooks/revalidate'

/** Past trips. Feeds /gallery and the photo strip near the foot of a club page. */
export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'club', 'event', 'updatedAt'],
    group: 'Content',
    description: 'Photo sets from past trips. They appear in the gallery and on your club page.',
  },
  access: {
    read: anyone,
    create: ownClub,
    update: ownClub,
    delete: mcOnly,
  },
  hooks: {
    afterChange: [revalidateAlbum],
    afterDelete: [revalidateAlbum],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      // Optional, matching Events: the main committee runs SMUX-wide trips and camps
      // that belong to no single club.
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      index: true,
      admin: { description: 'Leave empty for a SMUX-wide album.' },
      hooks: {
        beforeChange: [
          ({ req: { user }, value }) => {
            if (user?.role === 'editor') return resolveClubId(user.club)
            return value
          },
        ],
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { description: 'Optional — links the album to the trip it came from.' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { description: 'Used to order albums newest first.' },
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
  ],
}
