import type { CollectionConfig } from 'payload'
import { anyone, mcOnly, ownClub, resolveClubId } from '@/access'

/** Committee members, per academic year. */
export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'club', 'ay'],
  },
  access: {
    read: anyone,
    create: ownClub,
    update: ownClub,
    delete: mcOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'Committee position, e.g. "President", "Safety Officer".' },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      index: true,
      admin: { description: 'Leave empty for main committee, who sit above the clubs.' },
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
      required: true,
      index: true,
      admin: { description: 'Academic year, e.g. "AY26/27".' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contact',
      type: 'text',
      admin: { description: 'Email or Telegram handle. Leave as [BRACKETS] if unverified.' },
    },
  ],
}
