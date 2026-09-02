import type { CollectionConfig } from 'payload'
import { isAuthenticated, mcOnly, ownClub, resolveClubId } from '@/access'

/**
 * Members-only material: safety briefs, trip packing lists, committee handovers.
 *
 * This is the one collection whose read access is not public, which is what makes
 * /resources the single route that cannot be pre-rendered — a cached members-only page
 * would be served to anyone who asked for it.
 *
 * An upload-enabled collection with its own metadata fields, so a document and the
 * things you need to know about it stay together rather than being split across two
 * collections joined by a relationship.
 */
export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'club', 'ay', 'updatedAt'],
  },
  access: {
    read: isAuthenticated,
    create: ownClub,
    update: ownClub,
    delete: mcOnly,
  },
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/*',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'What this is and who needs it.' },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      index: true,
      admin: { description: 'Leave empty for material that applies across all clubs.' },
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
      name: 'ay',
      type: 'text',
      index: true,
      admin: { description: 'Academic year this belongs to, e.g. "AY26/27".' },
    },
  ],
}
