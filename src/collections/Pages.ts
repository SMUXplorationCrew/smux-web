import type { Block, CollectionConfig } from 'payload'
import { mcOnly, publishedOrSignedIn } from '@/access'
import { revalidatePage } from '@/hooks/revalidate'

/**
 * The editorial routes — /about, /join, /contact — are content, not code, so their
 * copy can change without a deploy. Slugs are fixed to the routes that exist; a free
 * text slug would let someone create a page that renders nowhere.
 */
export const PAGE_SLUGS = ['about', 'join', 'contact'] as const

const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text blocks' },
  fields: [{ name: 'content', type: 'richText', required: true }],
}

const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: 'Card row', plural: 'Card rows' },
  fields: [
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
  ],
}

const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      name: 'blocks',
      type: 'blocks',
      blocks: [RichTextBlock, ImageTextBlock, CardsBlock, CtaBlock, FaqBlock],
    },
  ],
}
