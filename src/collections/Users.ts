import type { CollectionConfig } from 'payload'
import { mcOnly, selfOrMc } from '@/access'

/**
 * Three roles, and the distinction matters for access control:
 *   mc     — main committee; unrestricted
 *   editor — maintains one club's content, scoped by `ownClub`
 *   member — reads the gated /resources area and nothing more
 *
 * `member` is the default so that a mis-configured account is powerless rather than
 * over-powered.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'club'],
    group: 'Settings',
    description: 'Who can sign in, and what each of them may change.',
  },
  auth: true,
  access: {
    // Payload still permits creating the very first user when the table is empty,
    // so locking creation to the committee does not lock you out of a fresh database.
    create: mcOnly,
    delete: mcOnly,
    update: mcOnly,
    read: selfOrMc,
    admin: ({ req: { user } }) => user?.role === 'mc' || user?.role === 'editor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Main committee', value: 'mc' },
        { label: 'Club editor', value: 'editor' },
        { label: 'Member', value: 'member' },
      ],
      access: {
        // Otherwise an editor could promote themselves to mc.
        update: ({ req: { user } }) => user?.role === 'mc',
      },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      admin: {
        condition: (data) => data?.role === 'editor',
        description: 'Which club this editor may manage. Required for editors.',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'mc',
      },
    },
  ],
}
