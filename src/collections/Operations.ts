import type { CollectionConfig, Where } from 'payload'
import { anyone, mcOnly, ownClub, publishedOrSignedIn, resolveClubId } from '@/access'
import { publicationHook, revalidateSiteSettings } from '@/hooks/revalidate'

const scopeClub: CollectionConfig['fields'][number] = {
  name: 'club',
  type: 'relationship',
  relationTo: 'clubs',
  index: true,
  hooks: {
    beforeChange: [
      ({ req, value }) => (req.user?.role === 'editor' ? resolveClubId(req.user.club) : value),
    ],
  },
}
const ownerRead: CollectionConfig['access'] = {
  read: ownClub,
  create: () => false,
  update: () => false,
  delete: mcOnly,
}
const privateSystem = (
  slug: string,
  title: string,
  fields: CollectionConfig['fields'],
  access: CollectionConfig['access'] = ownerRead,
): CollectionConfig => ({ slug, admin: { useAsTitle: title, group: 'Operations' }, access, fields })

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'club', '_status', 'updatedAt'],
    preview: (doc) => `/preview/stories/${doc.id}`,
  },
  access: {
    read: publishedOrSignedIn,
    create: ({ req }) =>
      Boolean(
        req.user?.active !== false &&
          (req.user?.role === 'mc' ||
            (req.user?.role === 'editor' && resolveClubId(req.user.club) !== null)),
      ),
    update: ownClub,
    delete: mcOnly,
  },
  versions: { drafts: true },
  hooks: { afterChange: [publicationHook('stories')], afterDelete: [publicationHook('stories')] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true },
    scopeClub,
    { name: 'summary', type: 'textarea', required: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'album', type: 'relationship', relationTo: 'albums' },
    {
      name: 'destination',
      type: 'text',
      admin: { description: 'Public destination only. Never disclose participant locations.' },
    },
    { name: 'latitude', type: 'number', min: -90, max: 90 },
    { name: 'longitude', type: 'number', min: -180, max: 180 },
    { name: 'author', type: 'text' },
    { name: 'photoCredit', type: 'text' },
  ],
}
export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    preview: (doc) => `/preview/campaigns/${doc.id}`,
  },
  access: {
    read: ({ req }): boolean | Where =>
      req.user?.active !== false && req.user?.role === 'mc'
        ? true
        : { _status: { equals: 'published' } },
    create: mcOnly,
    update: mcOnly,
    delete: mcOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [publicationHook('campaigns')],
    afterDelete: [publicationHook('campaigns')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'intro', type: 'textarea' },
    { name: 'startsAt', type: 'date' },
    { name: 'endsAt', type: 'date' },
    { name: 'venue', type: 'text' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'clubs', type: 'relationship', relationTo: 'clubs', hasMany: true },
  ],
}
export const Benefits: CollectionConfig = {
  slug: 'benefits',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: anyone, create: mcOnly, update: ownClub, delete: mcOnly },
  versions: true,
  hooks: { afterChange: [revalidateSiteSettings], afterDelete: [revalidateSiteSettings] },
  fields: [
    { name: 'title', type: 'text', required: true },
    scopeClub,
    { name: 'description', type: 'textarea', required: true },
    { name: 'eligibility', type: 'text', required: true },
    { name: 'url', type: 'text' },
    { name: 'expiresAt', type: 'date' },
  ],
}
export const Registrations = privateSystem(
  'registrations',
  'reference',
  [
    { name: 'reference', type: 'text', required: true, unique: true },
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    scopeClub,
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      options: ['registered', 'waitlisted', 'cancelled'],
      required: true,
    },
    { name: 'checkedInAt', type: 'date' },
    { name: 'checkInTokenHash', type: 'text', hidden: true, access: { read: () => false } },
    { name: 'checkInExpiresAt', type: 'date' },
  ],
  {
    ...ownerRead,
    read: ({ req }): boolean | Where =>
      req.user?.active === false || !req.user
        ? false
        : req.user.role === 'mc'
          ? true
          : req.user.role === 'editor'
            ? { club: { equals: resolveClubId(req.user.club) } }
            : { user: { equals: req.user.id } },
  },
)
export const Interests = privateSystem(
  'interests',
  'id',
  [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'event', type: 'relationship', relationTo: 'events', index: true },
    scopeClub,
    { name: 'key', type: 'text', unique: true, required: true },
    { name: 'consentedAt', type: 'date', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'lastNotifiedAt', type: 'date' },
  ],
  {
    ...ownerRead,
    read: ({ req }): boolean | Where =>
      req.user?.active === false || !req.user
        ? false
        : req.user.role === 'mc'
          ? true
          : { user: { equals: req.user.id } },
  },
)
export const AuditLog = privateSystem('audit-log', 'action', [
  { name: 'action', type: 'text', required: true },
  { name: 'actor', type: 'relationship', relationTo: 'users' },
  scopeClub,
  { name: 'collectionName', type: 'text' },
  { name: 'documentId', type: 'text' },
  {
    name: 'details',
    type: 'json',
    admin: {
      description: 'Redacted operation metadata, never credentials or full member records.',
    },
  },
])
export const PublishJobs = privateSystem('publish-jobs', 'id', [
  { name: 'paths', type: 'json', required: true },
  {
    name: 'state',
    type: 'select',
    options: ['pending', 'running', 'complete', 'failed'],
    defaultValue: 'pending',
    index: true,
  },
  { name: 'attempts', type: 'number', defaultValue: 0 },
  { name: 'lastError', type: 'text' },
  { name: 'finishedAt', type: 'date' },
  scopeClub,
])
export const Metrics = privateSystem('metrics', 'kind', [
  {
    name: 'kind',
    type: 'select',
    options: ['club-view', 'signup-click', 'calendar-add', 'campaign-view'],
    required: true,
    index: true,
  },
  { name: 'subject', type: 'text', required: true, index: true },
  { name: 'day', type: 'text', required: true, index: true },
  { name: 'count', type: 'number', defaultValue: 1 },
  { name: 'key', type: 'text', unique: true, required: true },
  scopeClub,
])
export const Invitations = privateSystem(
  'invitations',
  'email',
  [
    { name: 'email', type: 'email', required: true },
    { name: 'role', type: 'select', options: ['member', 'editor'], required: true },
    scopeClub,
    {
      name: 'tokenHash',
      type: 'text',
      required: true,
      hidden: true,
      access: { read: () => false },
    },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'acceptedAt', type: 'date' },
  ],
  { read: mcOnly, create: () => false, update: () => false, delete: mcOnly },
)
export const ContactRequests = privateSystem(
  'contact-requests',
  'subject',
  [
    { name: 'subject', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    scopeClub,
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'state',
      type: 'select',
      options: ['new', 'in-progress', 'resolved'],
      defaultValue: 'new',
    },
  ],
  { ...ownerRead, update: ownClub },
)
export const LinkChecks = privateSystem('link-checks', 'url', [
  { name: 'url', type: 'text', required: true },
  scopeClub,
  { name: 'state', type: 'select', options: ['healthy', 'review', 'failed'], required: true },
  { name: 'statusCode', type: 'number' },
  { name: 'checkedAt', type: 'date' },
  { name: 'note', type: 'text' },
])
export const OperationsCollections = [
  Stories,
  Campaigns,
  Benefits,
  Registrations,
  Interests,
  AuditLog,
  PublishJobs,
  Metrics,
  Invitations,
  ContactRequests,
  LinkChecks,
]
