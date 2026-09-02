import type { CollectionConfig } from 'payload'
import { mcOnly, ownClub, publishedOrSignedIn } from '@/access'
import { revalidateClub } from '@/hooks/revalidate'

/**
 * The six clubs. `slug` doubles as the runtime theme key: a club page sets
 * `data-club={slug}` on its wrapper and every component downstream reads `--accent`,
 * so no component ever hardcodes a club colour.
 */
export const CLUB_SLUGS = ['diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed'] as const

export const Clubs: CollectionConfig = {
  slug: 'clubs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: publishedOrSignedIn,
    create: mcOnly,
    update: ownClub,
    delete: mcOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateClub],
    afterDelete: [revalidateClub],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      index: true,
      options: CLUB_SLUGS.map((s) => ({ label: s, value: s })),
      admin: {
        description: 'Drives the URL and the accent theme. Fixed to the six clubs.',
      },
    },
    {
      name: 'accent',
      type: 'select',
      required: true,
      defaultValue: 'diving',
      options: CLUB_SLUGS.map((s) => ({ label: s, value: s })),
      admin: {
        description: 'Which accent palette to theme with. Normally matches the slug.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'One line, shown under the club name in the hero.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Full-bleed photo behind the club name.' },
    },
    {
      name: 'whoWeAre',
      type: 'richText',
    },
    {
      name: 'typicalSession',
      type: 'richText',
      admin: { description: 'What one session actually looks like, start to finish.' },
    },
    {
      name: 'beginnerNotes',
      type: 'richText',
      admin: { description: 'Answers the "New to this?" section.' },
    },
    {
      name: 'gearAndCost',
      type: 'richText',
    },
    {
      name: 'howToJoin',
      type: 'richText',
      admin: { description: 'Membership and joining details.' },
    },
    {
      // Signature events that recur each year. Distinct from the Events collection,
      // which holds dated occurrences people actually sign up for.
      name: 'keyEvents',
      type: 'array',
      admin: { description: 'The club’s signature events, described generally.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'telegram', type: 'text', admin: { description: 'e.g. t.me/smuxdiving' } },
        { name: 'instagram', type: 'text', admin: { description: 'Handle, without the @' } },
        { name: 'facebook', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
  ],
}
