import type { CollectionConfig } from 'payload'
import { mcOnly, ownClub, publishedOrSignedIn, resolveClubId } from '@/access'
import { revalidateEvent } from '@/hooks/revalidate'
import {
  noPlaceholderWhenPublished,
  validateEndsAt,
  validateSignupCloses,
  validateSpotsTaken,
} from '@/lib/validation'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'club', 'startsAt', 'signupOpens'],
  },
  access: {
    read: publishedOrSignedIn,
    create: ownClub,
    update: ownClub,
    delete: mcOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateEvent],
  },
  fields: [
    // Identity stays outside the tabs: these three answer "which event is this?" and
    // are needed no matter which tab someone is working in.
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL segment, e.g. "night-dive-pulau-hantu".' },
    },
    {
      // Optional: the main committee runs SMUX-wide events (expeditions, SMUXIE
      // nights, Study On) that belong to no single club. Those are left empty and
      // presented as SMUX events.
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      index: true,
      admin: { description: 'Leave empty for a SMUX-wide event run by the main committee.' },
      hooks: {
        // An editor creating an event must not be able to file it under another club;
        // `ownClub` would then reject their own update of it.
        beforeChange: [
          ({ req: { user }, value }) => {
            if (user?.role === 'editor') return resolveClubId(user.club)
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'When',
          description: 'Leave the time unconfirmed and the site shows the date alone.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'startsAt', type: 'date', required: true, admin: { width: '50%' } },
                { name: 'endsAt', type: 'date', admin: { width: '50%' }, validate: validateEndsAt },
              ],
            },
            {
              // The committee calendar records dates but not times. Rather than invent one,
              // the event stores a nominal start and hides the clock until someone fills it in.
              name: 'timeTbc',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Show the date only — the time has not been confirmed yet.' },
            },
          ],
        },
        {
          label: 'Where',
          fields: [
            {
              name: 'location',
              type: 'text',
              validate: noPlaceholderWhenPublished,
            },
          ],
        },
        {
          label: 'Sign-up',
          description: 'The two-tap destination. Without a link the button stays disabled.',
          fields: [
            {
              name: 'cost',
              type: 'text',
              validate: noPlaceholderWhenPublished,
              admin: {
                description: 'Free text so an unconfirmed price can stay as [BRACKETS].',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'capacity',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%', description: 'Total places.' },
                },
                {
                  name: 'spotsTaken',
                  type: 'number',
                  min: 0,
                  validate: validateSpotsTaken,
                  admin: {
                    width: '50%',
                    description:
                      'Places already taken. Sign-ups run off-site, so update this to close the event at capacity.',
                  },
                },
              ],
            },
            {
              name: 'signupUrl',
              type: 'text',
              admin: { description: 'The external form. This is the two-tap destination.' },
              validate: noPlaceholderWhenPublished,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'signupOpens',
                  type: 'date',
                  admin: {
                    width: '50%',
                    description: 'Before this, the button reads "Opens 8 Sep".',
                  },
                },
                {
                  name: 'signupCloses',
                  type: 'date',
                  admin: { width: '50%', description: 'At and after this, sign-ups are closed.' },
                  validate: validateSignupCloses,
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
