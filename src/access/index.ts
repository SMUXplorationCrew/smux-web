import type { Access } from 'payload'

export type Role = 'mc' | 'editor' | 'member'

/**
 * The subset of a user this module cares about. Declared locally rather than
 * imported from payload-types so access control stays testable without a
 * generated-types round trip against the database.
 */
export interface AccessUser {
  role?: Role | null
  club?: number | string | { id: number | string } | null
}

/**
 * A club relationship arrives as a bare id or as a populated object depending on
 * the depth of the query that loaded the user. Comparing the object form directly
 * produces a WHERE clause that matches nothing — an empty list rather than an
 * error, which is why this is worth normalising in one place.
 */
export const resolveClubId = (club: AccessUser['club']): number | string | null => {
  if (club === null || club === undefined) return null
  if (typeof club === 'object') return club.id ?? null
  return club
}

/** Public read. The site pre-renders every published document. */
export const anyone: Access = () => true

/** Any signed-in user, regardless of role. Gates the members-only material. */
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

/**
 * Club-scoped access for the `clubs` collection itself.
 *
 * `ownClub` cannot be used here: it filters on a `club` field, and a club document has
 * no such field — it *is* the club. Payload rejects the query outright with "Cannot
 * find field for path at club", so an editor could not edit the very page they exist to
 * maintain. The identity comparison is on the document id instead.
 */
export const ownClubById: Access = ({ req: { user } }) => {
  const u = user as AccessUser | null
  if (!u) return false
  if (u.role === 'mc') return true
  if (u.role !== 'editor') return false

  const clubId = resolveClubId(u.club)
  if (clubId === null) return false

  return { id: { equals: clubId } }
}

/** Content roles. Members are signed in but may not author anything. */
export const isEditorOrMc: Access = ({ req: { user } }) => {
  const role = (user as AccessUser | null)?.role
  return role === 'mc' || role === 'editor'
}

/**
 * A user may read their own record; the committee may read everyone's.
 *
 * A flat `Boolean(user)` would let any signed-in account — including a members-only
 * one — list every user's email, role and club through the REST or Local API.
 */
export const selfOrMc: Access = ({ req: { user } }) => {
  const u = user as (AccessUser & { id?: number | string }) | null
  if (!u) return false
  if (u.role === 'mc') return true
  return { id: { equals: u.id } }
}

/**
 * Public read for collections with drafts enabled.
 *
 * CLAUDE.md specifies a flat `read: () => true`, which is right for the pre-rendered
 * site — it reads through the local API, which returns published documents only. But
 * the same access rule also governs REST and GraphQL, where a flat `true` hands an
 * anonymous caller every unpublished draft. Expressed as a query, this stays true to
 * "access control is a query, not a boolean" while closing that hole.
 */
export const publishedOrSignedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** Destructive operations stay with the main committee. */
export const mcOnly: Access = ({ req: { user } }) => {
  return (user as AccessUser | null)?.role === 'mc'
}

/**
 * Club-scoped write access, returned as a query rather than a boolean so the
 * filtering happens in the database. Hiding rows in the UI is not access control.
 *
 * The role is checked positively on purpose. Falling through to the club query for
 * any non-mc user would hand a `member` the same access an `editor` has, which is
 * the exact bug the integration test in tests/int is written to catch.
 */
export const ownClub: Access = ({ req: { user } }) => {
  const u = user as AccessUser | null
  if (!u) return false
  if (u.role === 'mc') return true
  if (u.role !== 'editor') return false

  const clubId = resolveClubId(u.club)
  if (clubId === null) return false

  return { club: { equals: clubId } }
}
