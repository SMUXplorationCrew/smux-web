import type { Block } from 'payload'

/**
 * The section types an editor can add to a page without writing code.
 *
 * Shared rather than defined on Pages, because the same palette now drives three
 * places: the editorial routes, the extra sections on a club page, and the home and
 * committee pages the main committee controls. Defining them once means a block added
 * here appears everywhere, and — more importantly — a block only ever has one renderer.
 *
 * Slugs and field names are load-bearing: Payload stores blocks by slug, so renaming
 * one orphans every section already saved with it. New capability is added as new
 * optional fields, never by reshaping an existing one.
 */

/** Most sections want a label and a heading above them; none of them require one. */
const heading: Block['fields'] = [
  {
    name: 'eyebrow',
    type: 'text',
    admin: { description: 'Small label above the heading. Optional.' },
  },
  {
    name: 'heading',
    type: 'text',
    admin: { description: 'Section heading. Leave empty for an untitled section.' },
  },
]

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text blocks' },
  admin: { group: 'Content' },
  fields: [...heading, { name: 'content', type: 'richText', required: true }],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  admin: { group: 'Content' },
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

export const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: 'Card row', plural: 'Card rows' },
  admin: { group: 'Content' },
  fields: [
    ...heading,
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
        {
          name: 'linkUrl',
          type: 'text',
          admin: { description: 'Optional. Makes the whole card clickable.' },
        },
        {
          name: 'linkLabel',
          type: 'text',
          admin: {
            description: 'Wording for the link, e.g. "Sign up". Defaults to "Read more".',
            condition: (_, siblings) => Boolean(siblings?.linkUrl),
          },
        },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark band', value: 'dark' },
        { label: 'Club accent', value: 'accent' },
        { label: 'Quiet', value: 'quiet' },
      ],
      admin: { description: 'How loud this section should be.' },
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { group: 'Content' },
  fields: [
    ...heading,
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

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Photo grid', plural: 'Photo grids' },
  admin: { group: 'Media' },
  fields: [
    ...heading,
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: { description: 'Drag to reorder. Every photo needs alt text when uploaded.' },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: 'Two across', value: '2' },
        { label: 'Three across', value: '3' },
        { label: 'Four across', value: '4' },
      ],
      admin: { description: 'On phones this is always two, whatever is chosen here.' },
    },
  ],
}

export const LinkListBlock: Block = {
  slug: 'linkList',
  labels: { singular: 'Link list', plural: 'Link lists' },
  admin: { group: 'Content' },
  fields: [
    ...heading,
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      admin: {
        description:
          'Sign-up forms, booking sheets, waivers, anything external. Paste the full address.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Include https:// — e.g. https://forms.gle/…' },
        },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Numbers strip', plural: 'Numbers strips' },
  admin: { group: 'Content' },
  fields: [
    ...heading,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  admin: { group: 'Content' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text', admin: { description: 'Who said it.' } },
    { name: 'role', type: 'text', admin: { description: 'e.g. "President, AY25/26".' } },
  ],
}

/** The full palette, in the order the "Add block" menu should offer them. */
export const CONTENT_BLOCKS: Block[] = [
  RichTextBlock,
  ImageTextBlock,
  CardsBlock,
  GalleryBlock,
  LinkListBlock,
  FaqBlock,
  StatsBlock,
  QuoteBlock,
  CtaBlock,
]
