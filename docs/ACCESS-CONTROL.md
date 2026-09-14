# Access control

Three roles, six clubs, and one rule that matters more than the rest.

## The rule

**Access control is a query, not a boolean.** A club editor's data is filtered in
Postgres. Hiding a row in the admin UI is presentation, not permission — anyone can
reach the same data through REST, GraphQL or the Local API.

```ts
export const ownClub: Access = ({ req: { user } }) => {
  const u = user as AccessUser | null
  if (!u || u.active === false) return false
  if (u.role === 'mc') return true
  if (u.role !== 'editor') return false

  const clubId = resolveClubId(u.club)
  if (clubId === null) return false

  return { club: { equals: clubId } }   // a WHERE clause
}
```

Two details in there are load-bearing:

- **The role is checked positively.** Falling through to the club query for any non-MC
  user would hand a `member` exactly what an `editor` has.
- **`resolveClubId` normalises the relationship.** It arrives as a bare id or as a
  populated object depending on query depth. Comparing the object form directly produces
  a WHERE clause matching nothing — an empty list, not an error, which is the kind of
  bug that looks like missing content.

## Roles

| Role | Intent |
| --- | --- |
| `mc` | Main committee. Unrestricted. |
| `editor` | Maintains exactly one club's content. |
| `member` | Reads the gated `/resources` area. Authors nothing. |

`member` is the default so a misconfigured account is powerless rather than
over-powered.

## Deactivation

Every access function checks `active === false` before anything else, so deactivating
someone stops them through every API surface, not just the admin panel. `selfOrMc`
returns a flat `false` rather than a self-scoped query, so Payload refuses the operation
outright instead of returning an empty list.

Deactivating is the reversible way to remove access. Deleting a user orphans the audit
trail.

## The matrix

| Operation | Anonymous | `member` | `editor` | `mc` |
| --- | --- | --- | --- | --- |
| Read published content | yes | yes | yes | yes |
| Read drafts | no | no | own club only | yes |
| Read `/resources` | no | yes | yes | yes |
| Create events/albums/people/media/resources | no | no | own club | yes |
| Update those | no | no | own club | yes |
| Delete those | no | no | no | yes |
| Update own club document | no | no | own club | yes |
| Read user records | no | self | self | all |
| Create/delete users | no | no | no | yes |
| Change a role or club assignment | no | no | no | yes |
| Unlock a locked-out account | no | no | no | yes |

### Draft reads

`publishedOrSignedIn` is the rule for collections with drafts. It is a query, not a
boolean:

- MC gets everything.
- An editor gets published content **or** anything belonging to their club.
- Everyone else — including a signed-in member — gets `_status = published` only.

`publishedClubOrOwner` is the same idea for the `clubs` collection itself, matching on
document id rather than a `club` field.

### Why clubs need their own rule

`ownClub` filters on a `club` field. A club document does not have one — it *is* the
club. Payload rejects the query with "Cannot find field for path at club", and the
editor cannot touch the one page they exist to maintain. `ownClubById` compares document
ids instead.

This cannot be caught by unit tests: the query only fails once Postgres tries to resolve
the column. It is covered in `tests/int/access.int.spec.ts`.

## Field-level rules

Collection access is not the whole story. On `users`, `role` and `club` carry their own
field-level update rules restricted to MC. Without them an editor — who may legitimately
update their own record — could promote themselves.

Field access **strips the field rather than throwing**. An editor submitting
`role: 'mc'` gets a successful response with their role unchanged. The test asserts the
value, not an exception.

## Ownership forcing

When an editor files an event under another club, the `beforeChange` hook rewrites the
club rather than rejecting the write. A silently corrected event is better than one the
author is then locked out of editing. The test asserts the correction actually happens.

## Testing it

| File | What it proves |
| --- | --- |
| `tests/unit/access.unit.spec.ts` | The shape of the returned query |
| `tests/int/access.int.spec.ts` | Postgres honours it, and club documents resolve |
| `tests/int/roles.int.spec.ts` | The full six-club matrix, both directions |

`roles.int.spec.ts` exists because a single-club test cannot catch a mistake that first
appears on the fifth club. Each of the six editors is checked against all five others.

Both integration files are non-destructive: they create and remove their own `int-`
prefixed fixtures, and the one test that must write to a real club row captures the
value first and restores it in the test and again in `afterAll`.

> A test that mutates real content and does not restore it will put its fixture string
> on the live site. This happened — `"Edited by the Trekking editor"` was served as
> Trekking's tagline. Do not reintroduce it.

## Files

Resource downloads are access-checked, and `/resources` is dynamic for that reason. An
anonymous direct request for a private file must fail; if you change the media or
resource pipeline, re-test that specifically.

## Adding a collection

1. Public read? `publishedOrSignedIn`, not `() => true` — a flat `true` hands anonymous
   REST callers every draft.
2. Club-owned? `create`/`update` use `ownClub`; `delete` uses `mcOnly`.
3. Sensitive fields get their own field-level rules.
4. Add it to the matrix above and to `roles.int.spec.ts`.
