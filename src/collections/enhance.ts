import type { CollectionConfig, Field, FieldAccess } from 'payload'
import { APIError } from 'payload'
import { isEditorOrMc, mcOnly, ownClub, resolveClubId, selfOrMc } from '@/access'
import { revalidateSiteSettings } from '@/hooks/revalidate'
import { eventReadiness } from '@/lib/readiness'
import { httpUrl } from '@/lib/url'
import type { Event } from '@/payload-types'

const mcField: { create: FieldAccess; update: FieldAccess } = {
  create: ({ req }) => req.user?.role === 'mc',
  update: ({ req }) => req.user?.role === 'mc',
}
export const enhanceCollection = (collection: CollectionConfig): CollectionConfig => {
  const c = {
    ...collection,
    fields: [...collection.fields],
    hooks: { ...collection.hooks },
    admin: { ...collection.admin },
  }
  if (['events', 'albums', 'people', 'resources', 'media'].includes(c.slug)) {
    c.access = { ...c.access, create: isEditorOrMc }
    c.admin.baseListFilter = ({ req }) =>
      req.user?.role === 'editor' ? { club: { equals: resolveClubId(req.user.club) } } : null
  }
  if (c.slug === 'clubs')
    c.admin.baseListFilter = ({ req }) =>
      req.user?.role === 'editor' ? { id: { equals: resolveClubId(req.user.club) } } : null
  if (['clubs', 'events', 'pages'].includes(c.slug)) {
    c.admin.preview = (doc) => `/preview/${c.slug}/${doc.id}`
    c.admin.livePreview = {
      url: ({ data }) => `/preview/${c.slug}/${data.id}`,
      breakpoints: [
        { label: 'Phone', name: 'phone', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 800 },
      ],
    }
  }
  if (['people', 'media', 'resources'].includes(c.slug)) {
    c.hooks.afterChange = [...(c.hooks.afterChange || []), revalidateSiteSettings]
    c.hooks.afterDelete = [...(c.hooks.afterDelete || []), revalidateSiteSettings]
  }
  if (c.slug === 'users') {
    c.access = {
      ...c.access,
      update: selfOrMc,
      unlock: mcOnly,
      admin: ({ req }) =>
        Boolean(
          req.user?.active !== false && (req.user?.role === 'editor' || req.user?.role === 'mc'),
        ),
    }
    c.auth = { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000 }
    c.fields.push(
      { name: 'active', type: 'checkbox', defaultValue: true, access: mcField },
      {
        name: 'requiresReview',
        type: 'checkbox',
        defaultValue: false,
        access: mcField,
        admin: { description: 'This editor must have an MC member approve publication.' },
      },
    )
    c.hooks.beforeValidate = [
      ({ data, originalDoc }) => {
        const merged = { ...originalDoc, ...data }
        if (merged.role === 'editor' && !resolveClubId(merged.club))
          throw new APIError('Choose a club for this editor.', 400)
        return data
      },
    ]
    c.hooks.beforeLogin = [
      ({ user }) => {
        if (user.active === false)
          throw new APIError('This account is inactive. Contact the committee.', 403)
        return user
      },
    ]
  }
  if (c.slug === 'events') {
    c.fields.push({
      type: 'tabs',
      tabs: [
        {
          label: 'Participation',
          fields: [
            {
              name: 'registrationMode',
              type: 'select',
              defaultValue: 'external',
              options: [
                { label: 'External form', value: 'external' },
                { label: 'Register on SMUX', value: 'native' },
              ],
            },
            { name: 'cancelled', type: 'checkbox', defaultValue: false },
            { name: 'cancellationReason', type: 'textarea' },
            { name: 'organizerContact', type: 'text' },
            { name: 'prerequisites', type: 'textarea' },
            { name: 'itinerary', type: 'richText' },
            { name: 'packingList', type: 'richText' },
            {
              name: 'activity',
              type: 'select',
              options: ['ride', 'dive', 'paddle', 'skate', 'hike', 'social', 'other'],
            },
            {
              name: 'beginnerFriendly',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Only select when confirmed for this specific activity.' },
            },
          ],
        },
        {
          label: 'Workflow',
          fields: [
            {
              name: 'reviewState',
              type: 'select',
              defaultValue: 'draft',
              options: ['draft', 'ready', 'approved'],
              admin: { description: 'Editorial review is separate from signup timing.' },
            },
            {
              name: 'externalId',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Stable import key. Leave empty for manually created events.' },
            },
            { name: 'seriesId', type: 'text', index: true },
            { name: 'archived', type: 'checkbox', defaultValue: false },
            {
              name: 'readiness',
              type: 'ui',
              admin: { components: { Field: '/components/admin/Readiness#Readiness' } },
            },
          ],
        },
      ],
    })
    c.hooks.beforeValidate = [
      ...(c.hooks.beforeValidate || []),
      ({ data, originalDoc, req }) => {
        if (!data) return data
        if (data.signupUrl) {
          const url = httpUrl(data.signupUrl)
          if (!url) throw new APIError('Enter a valid HTTP or HTTPS registration link.', 400)
          data.signupUrl = url
        }
        if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))
          throw new APIError('Slug must contain lowercase words separated by hyphens.', 400)
        const merged = { ...originalDoc, ...data } as Partial<Event>
        for (const name of ['capacity', 'spotsTaken'] as const) {
          const value = merged[name]
          if (value != null && (!Number.isSafeInteger(value) || value < 0))
            throw new APIError(`${name} must be a non-negative whole number.`, 400)
        }
        if (
          merged.signupCloses &&
          merged.startsAt &&
          Date.parse(merged.signupCloses) > Date.parse(merged.endsAt || merged.startsAt)
        )
          throw new APIError('Registration must close by the end of the event.', 400)
        if (req.user?.role === 'editor' && data.reviewState === 'approved')
          throw new APIError('The main committee approves reviews.', 403)
        if (merged._status === 'published') {
          if (req.user?.role === 'editor' && req.user.requiresReview)
            throw new APIError('Submit for review; the main committee publishes this event.', 403)
          const errors = eventReadiness(merged).filter((i) => i.severity === 'error')
          if (errors.length) throw new APIError(errors.map((i) => i.message).join(' '), 400)
        }
        return data
      },
    ]
  }
  if (c.slug === 'clubs')
    c.fields.push({
      name: 'discovery',
      type: 'group',
      fields: [
        { name: 'environment', type: 'select', options: ['land', 'water', 'mixed'] },
        { name: 'commitment', type: 'text' },
        { name: 'costGuide', type: 'text' },
        { name: 'beginnerFriendly', type: 'checkbox', defaultValue: false },
        { name: 'verifiedAt', type: 'date' },
      ],
    })
  if (c.slug === 'people') {
    c.versions = true
    c.fields.push(
      { name: 'displayOrder', type: 'number', defaultValue: 100 },
      { name: 'archived', type: 'checkbox', defaultValue: false },
    )
    c.admin.defaultColumns = ['name', 'role', 'club', 'ay', 'displayOrder']
  }
  if (c.slug === 'albums') {
    c.versions = true
    c.fields.push({ name: 'summary', type: 'textarea' }, { name: 'photoCredit', type: 'text' })
    c.admin.preview = (doc) => `/gallery/${doc.id}`
  }
  if (c.slug === 'resources')
    c.fields.push(
      {
        name: 'audience',
        type: 'select',
        defaultValue: 'members',
        options: ['members', 'committee'],
      },
      {
        name: 'category',
        type: 'select',
        options: ['safety', 'packing', 'handover', 'other'],
        defaultValue: 'other',
      },
    )
  if (c.slug === 'resources')
    c.access = {
      ...c.access,
      read: ({ req }) =>
        !req.user || req.user.active === false
          ? false
          : req.user.role === 'mc' || req.user.role === 'editor'
            ? true
            : { audience: { equals: 'members' } },
    }
  if (c.slug === 'media') {
    c.versions = true
    c.fields.push({ name: 'credit', type: 'text' }, { name: 'caption', type: 'textarea' })
    c.upload = {
      ...(typeof c.upload === 'object' ? c.upload : {}),
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    }
  }
  return c
}
