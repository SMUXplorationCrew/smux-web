import type { GlobalConfig } from 'payload'
import { anyone, mcOnly } from '@/access'
import { CONTENT_BLOCKS } from '@/blocks'
import { revalidateSiteSettings } from '@/hooks/revalidate'

/**
 * Everything the main committee controls that is not a club's own page: the header, the
 * footer, the home page and the committee page.
 *
 * Each field here replaces something that used to be a string in a component. Where a
 * value is left empty the site falls back to the wording it shipped with, so this can be
 * filled in gradually and a blank field never produces a blank page.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site settings',
  admin: {
    description: 'The home page, the menu, the footer and the committee page.',
  },
  access: {
    read: anyone,
    update: mcOnly,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home page',
          fields: [
            {
              name: 'heroHeading',
              type: 'text',
              admin: { description: 'The big line at the top. Defaults to "SMUXploration Crew".' },
            },
            {
              name: 'motto',
              type: 'text',
              admin: { description: 'The line under it, and in the footer.' },
            },
            {
              name: 'heroImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Rotating photos behind the home hero. Drag to reorder.' },
            },
            {
              name: 'heroButtons',
              type: 'array',
              maxRows: 3,
              admin: {
                description: 'The buttons on the hero. Leave empty for "Join us" and "What’s on".',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: { description: 'A path like /join, or a full https:// address.' },
                },
                {
                  name: 'tone',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Solid orange', value: 'primary' },
                    { label: 'Outlined', value: 'secondary' },
                  ],
                },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              admin: { description: 'The numbers strip, e.g. "6 clubs", "300+ members".' },
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              // Three words, set as a typographic block — the wireframe's
              // "Fun / Family / Adventure" with its "Our Motto!" callout.
              name: 'mottoWords',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Displayed large, one word per line. Three works best.' },
              fields: [{ name: 'word', type: 'text', required: true }],
            },
            {
              name: 'homeLabels',
              type: 'group',
              label: 'Section headings',
              admin: {
                description: 'Rename the home page sections. Empty keeps the standard wording.',
              },
              fields: [
                { name: 'clubsEyebrow', type: 'text' },
                { name: 'clubsTitle', type: 'text' },
                { name: 'eventsEyebrow', type: 'text' },
                { name: 'eventsTitle', type: 'text' },
                { name: 'socialsTitle', type: 'text' },
              ],
            },
            {
              name: 'homeBlocks',
              type: 'blocks',
              label: 'Extra sections',
              labels: { singular: 'Section', plural: 'Sections' },
              blocks: CONTENT_BLOCKS,
              admin: {
                description: 'Added to the bottom of the home page, above the socials row.',
              },
            },
          ],
        },
        {
          label: 'Committee page',
          fields: [
            {
              name: 'committee',
              type: 'group',
              label: 'Headings and intro',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  admin: { description: 'Defaults to "Main Committee".' },
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: { description: 'Defaults to "The people behind SMUX".' },
                },
                {
                  name: 'intro',
                  type: 'richText',
                  admin: { description: 'Shown under the title. Falls back to the About text.' },
                },
                {
                  name: 'eventsTitle',
                  type: 'text',
                  admin: { description: 'Defaults to "Events we run".' },
                },
                {
                  name: 'peopleTitle',
                  type: 'text',
                  admin: { description: 'Defaults to "The committee".' },
                },
              ],
            },
            {
              name: 'committeePhoto',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Group photo of the main committee.' },
            },
            {
              name: 'committeeBlocks',
              type: 'blocks',
              label: 'Extra sections',
              labels: { singular: 'Section', plural: 'Sections' },
              blocks: CONTENT_BLOCKS,
            },
          ],
        },
        {
          label: 'Menu and footer',
          fields: [
            {
              name: 'nav',
              type: 'array',
              label: 'Main menu',
              admin: {
                description:
                  'The links in the header and footer, in order. Leave empty to keep the standard menu. /resources is deliberately not listed — it is members-only.',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  admin: { description: 'A path like /clubs, or a full https:// address.' },
                },
              ],
            },
            {
              name: 'footer',
              type: 'group',
              fields: [
                {
                  name: 'note',
                  type: 'text',
                  admin: {
                    description:
                      'The small line at the very bottom. Defaults to "SMUXploration Crew, Singapore Management University."',
                  },
                },
              ],
            },
            {
              name: 'banner',
              type: 'group',
              label: 'Site-wide notice',
              admin: {
                description: 'A strip above the menu on every page. Hidden unless enabled.',
              },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'About and contact',
          fields: [
            {
              name: 'about',
              type: 'richText',
              admin: {
                description: 'Who SMUX is. Used as the committee page intro if that is empty.',
              },
            },
            {
              name: 'faqs',
              type: 'array',
              admin: { description: 'SMUX-wide questions, as opposed to a single club’s.' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'socials',
              type: 'group',
              admin: { description: 'Shown on the home page, the footer and the contact page.' },
              fields: [
                { name: 'email', type: 'email' },
                { name: 'telegram', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'whatsapp', type: 'text' },
                { name: 'tiktok', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'facebook', type: 'text' },
                { name: 'linkedin', type: 'text' },
                { name: 'discord', type: 'text' },
                { name: 'website', type: 'text' },
              ],
            },
            {
              name: 'extraSocials',
              type: 'array',
              admin: { description: 'Anywhere else that is not in the list above.' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
