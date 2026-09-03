import type { GlobalConfig } from 'payload'
import { anyone, mcOnly } from '@/access'
import { revalidateSiteSettings } from '@/hooks/revalidate'

/** Site-wide furniture: the header, the footer and the top of the home page. */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: anyone,
    update: mcOnly,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'motto',
      type: 'text',
      admin: { description: 'The line under the logo on the home hero.' },
    },
    {
      // Three words, set as a typographic block on the home page — the wireframe's
      // "Fun / Family / Adventure" with its "Our Motto!" callout.
      name: 'mottoWords',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Displayed large, one word per line. Three works best.' },
      fields: [{ name: 'word', type: 'text', required: true }],
    },
    {
      name: 'heroImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Rotating photos behind the home hero.' },
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
      name: 'about',
      type: 'richText',
      admin: { description: 'Who SMUX is. Shown on /about.' },
    },
    {
      name: 'committeePhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Group photo of the main committee, shown on /committee.' },
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
      fields: [
        { name: 'email', type: 'email' },
        { name: 'telegram', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    {
      name: 'banner',
      type: 'group',
      admin: { description: 'Site-wide notice. Hidden unless enabled.' },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'text', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
