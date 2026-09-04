import type { CollectionConfig } from 'payload'
import { mcOnly, ownClubById, publishedOrSignedIn } from '@/access'
import { CONTENT_BLOCKS } from '@/blocks'
import { revalidateClub } from '@/hooks/revalidate'

/**
 * The six clubs. `slug` doubles as the runtime theme key: a club page sets
 * `data-club={slug}` on its wrapper and every component downstream reads `--color-accent`,
 * so no component ever hardcodes a club colour.
 */
export const CLUB_SLUGS = ['diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed'] as const

export const Clubs: CollectionConfig = {
  slug: 'clubs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Content',
    description:
      'Everything on your club page. You can only see and edit your own club; changes go live once you press Publish.',
  },
  access: {
    read: publishedOrSignedIn,
    create: mcOnly,
    update: ownClubById,
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
    /**
     * Unnamed tabs: purely an admin-panel arrangement, so every field keeps the exact
     * path it had before. A *named* tab would nest everything one level deeper and
     * orphan the content already in the database.
     */
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Top of page',
          description: 'The hero, the facts strip, and who you are.',
          fields: [
            {
              name: 'hero',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Full-bleed photo behind the club name.' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown beside the club name in the hero.' },
            },
            {
              // Replaces a strip that used to be hardcoded, including a flat
              // "Experience needed: None" that was not true of every club.
              name: 'quickFacts',
              type: 'array',
              maxRows: 4,
              admin: {
                description:
                  'The strip under the hero, e.g. "Experience needed / None", "Meets / Wednesdays". Up to four.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
            { name: 'whoWeAre', type: 'richText' },
          ],
        },
        {
          label: 'For new members',
          description: 'What someone who has never done this needs to know.',
          fields: [
            {
              name: 'beginnerNotes',
              type: 'richText',
              admin: { description: 'Answers "can I do this with no experience?"' },
            },
            {
              name: 'typicalSession',
              type: 'richText',
              admin: { description: 'What one session actually looks like, start to finish.' },
            },
            {
              name: 'gearAndCost',
              type: 'richText',
              admin: { description: 'What to bring, what it costs, what the club lends out.' },
            },
            {
              name: 'howToJoin',
              type: 'richText',
              admin: { description: 'Membership and joining details.' },
            },
          ],
        },
        {
          label: 'What we do',
          fields: [
            {
              // Signature events that recur each year. Distinct from the Events
              // collection, which holds dated occurrences people sign up for.
              name: 'keyEvents',
              type: 'array',
              admin: { description: 'Your signature events, described generally.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            {
              name: 'achievements',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'faqs',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Photos',
          description:
            'These appear in the "past trips" strip. Anything in an Album for your club shows there too.',
          fields: [
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Drag to reorder. The first eight are shown on the page.' },
            },
          ],
        },
        {
          label: 'Contact',
          description: 'Only the ones you fill in are shown — blanks are skipped, not empty.',
          fields: [
            {
              name: 'socials',
              type: 'group',
              fields: [
                { name: 'email', type: 'email' },
                {
                  name: 'telegram',
                  type: 'text',
                  admin: { description: 'Group or handle, e.g. t.me/smuxdiving or smuxdiving' },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  admin: { description: 'Handle, with or without the @' },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: { description: 'Number, e.g. +65 8123 4567' },
                },
                { name: 'tiktok', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'facebook', type: 'text' },
                { name: 'linkedin', type: 'text' },
                {
                  name: 'discord',
                  type: 'text',
                  admin: { description: 'Invite code or full link' },
                },
                { name: 'website', type: 'text' },
              ],
            },
            {
              name: 'extraSocials',
              type: 'array',
              admin: {
                description: 'Anywhere else people can find you that is not in the list above.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Extra sections',
          description:
            'Add anything the fixed sections above do not cover — text, photo grids, sign-up links, cards. These appear near the bottom of your page.',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              labels: { singular: 'Section', plural: 'Sections' },
              blocks: CONTENT_BLOCKS,
            },
            {
              name: 'joinCta',
              type: 'group',
              label: 'Closing call to action',
              admin: { description: 'The band at the very bottom of the page.' },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  admin: { description: 'Defaults to "Come along".' },
                },
                { name: 'body', type: 'textarea' },
                { name: 'buttonLabel', type: 'text' },
                {
                  name: 'buttonUrl',
                  type: 'text',
                  admin: { description: 'Defaults to /join if left empty.' },
                },
              ],
            },
            {
              name: 'labels',
              type: 'group',
              label: 'Section headings',
              admin: {
                description:
                  'Rename the built-in sections. Leave any of these empty to keep the standard wording.',
              },
              fields: [
                { name: 'whoWeAre', type: 'text' },
                { name: 'startHere', type: 'text' },
                { name: 'keyEvents', type: 'text' },
                { name: 'events', type: 'text' },
                { name: 'gallery', type: 'text' },
                { name: 'committee', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
