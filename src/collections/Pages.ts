import type { CollectionConfig } from 'payload'
import { mcOnly, publishedOrSignedIn } from '@/access'
import { CONTENT_BLOCKS } from '@/blocks'
import { revalidatePage } from '@/hooks/revalidate'

/**
 * The editorial routes — /about, /join, /contact — are content, not code, so their
 * copy can change without a deploy. Slugs are fixed to the routes that exist; a free
 * text slug would let someone create a page that renders nowhere.
 */
export const PAGE_SLUGS = ['about', 'join', 'contact'] as const

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    description: 'The About, Join and Contact pages. Everything on them is editable here.',
  },
  access: {
    read: publishedOrSignedIn,
    create: mcOnly,
    update: mcOnly,
    delete: mcOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePage],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      index: true,
      options: PAGE_SLUGS.map((s) => ({ label: `/${s}`, value: s })),
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Short standfirst under the page title.' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional photo behind the page title. Without one the page opens on a plain band.',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      labels: { singular: 'Section', plural: 'Sections' },
      blocks: CONTENT_BLOCKS,
      admin: {
        description: 'Build the page by adding sections. Drag to reorder them.',
      },
    },
  ],
}
