import { describe, expect, it } from 'vitest'
import { type AccessUser, mcOnly, ownClub, resolveClubId } from '@/access'

/** Access functions only read `req.user`; the rest of the request is irrelevant here. */
const as = (user: AccessUser | null) => ({ req: { user } }) as never

describe('resolveClubId', () => {
  it('accepts a bare id', () => {
    expect(resolveClubId(3)).toBe(3)
  })

  it('unwraps a populated relationship', () => {
    expect(resolveClubId({ id: 3 })).toBe(3)
  })

  it('returns null when unset', () => {
    expect(resolveClubId(null)).toBeNull()
    expect(resolveClubId(undefined)).toBeNull()
  })
})

describe('ownClub', () => {
  it('denies anonymous requests', () => {
    expect(ownClub(as(null))).toBe(false)
  })

  it('gives the main committee everything', () => {
    expect(ownClub(as({ role: 'mc' }))).toBe(true)
  })

  it('scopes an editor to their own club as a query', () => {
    expect(ownClub(as({ role: 'editor', club: 4 }))).toEqual({ club: { equals: 4 } })
  })

  it('scopes an editor whose club arrived populated', () => {
    expect(ownClub(as({ role: 'editor', club: { id: 4 } }))).toEqual({
      club: { equals: 4 },
    })
  })

  it('denies an editor with no club rather than matching everything', () => {
    expect(ownClub(as({ role: 'editor', club: null }))).toBe(false)
  })

  // The regression this whole module exists to prevent: a member must not inherit
  // the editor's club query just by virtue of not being an mc.
  it('denies a member even when they have a club', () => {
    expect(ownClub(as({ role: 'member', club: 4 }))).toBe(false)
  })

  it('denies a user with no role at all', () => {
    expect(ownClub(as({ club: 4 }))).toBe(false)
  })
})

describe('mcOnly', () => {
  it('admits only the main committee', () => {
    expect(mcOnly(as({ role: 'mc' }))).toBe(true)
    expect(mcOnly(as({ role: 'editor', club: 4 }))).toBe(false)
    expect(mcOnly(as({ role: 'member' }))).toBe(false)
    expect(mcOnly(as(null))).toBe(false)
  })
})
