# Contributing

## Getting set up

[docs/LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md). The short version: Node 22, pnpm,
your own Neon branch. Never npm or yarn, never SQLite.

## Branches and pull requests

Branch from `main`. Name it for what it does: `fix/signup-state`, `ui/events-agenda`,
`docs/runbook`.

Keep a pull request reviewable. A 400-line diff doing one thing is easier to review than
120 lines doing four. If you find an unrelated problem while working, note it — do not
fold it in.

`.github/CODEOWNERS` puts every path under `@SMUXplorationCrew/tech-leads`, so a PR from
outside that team needs a tech lead's approval.

## Before you push

```bash
pnpm check      # tsc + lint + unit tests
pnpm build      # must pass
```

CI runs typecheck, lint, unit tests and build on Node 22. Integration and E2E need a
database and are not in CI yet — run them locally:

```bash
pnpm test:int
pnpm test:e2e
```

**For anything visual, check it at 390px.** Not just desktop. Most of the people using
this site are on a phone.

## Tests

- **Unit** for pure functions — sign-up state, access rule shapes, rich-text invariants.
- **Integration** for anything the database enforces. Access control especially: the
  rules return queries, and only Postgres can tell you whether a query is right.
- **E2E** for journeys that cross pages.

### Fixture isolation — the rule with a scar

Integration tests run against a real database.

- Create only your own fixtures, prefixed so they are identifiable (`int-`, `int-role-`).
- Clean them up in `afterAll`.
- **If a test must write to real content, capture the original first and restore it — in
  the test and again in `afterAll`**, so a failed assertion mid-run still restores it.
- Never point the integration suite or `pnpm seed` at shared data. `pnpm seed` clears the
  collections it owns.

A test once wrote `"Edited by the Trekking editor"` onto the real Trekking club and did
not restore it. It was served as the live tagline on every database the suite had been
pointed at. Assume your test will be run against something that matters.

## Migrations

Schema changes are committed migrations, never a push from a laptop.

```bash
pnpm payload migrate:create <name>
pnpm generate:types
```

**Read the generated SQL.** Check for `DROP`, `TRUNCATE`, `DELETE`, `ALTER COLUMN`, and
`NOT NULL` columns added without a default. Rehearse on a Neon branch cloned from
production before it goes near production.

Keep changes reversible where practical. `down()` is where the destructive statements
live — write it as carefully as `up()`.

## Code conventions

- Server components by default. Client components only where a browser is genuinely
  needed, and keep the boundary small.
- Prefer CSS grid/flex with `gap` over margins.
- Use design tokens. If a value is missing, add a token — not `text-[17.5px]`.
- Never hardcode a club colour. Use `accent` / `accent-tint` / `accent-text`.
- Unconfirmed facts stay in `[SQUARE BRACKETS]`.
- Match the surrounding code's comment density and naming. Comments explain *why*; the
  code already says what.

## The non-negotiables

These are architectural decisions, not preferences. If you think one is wrong, raise it
before writing the code.

1. **Every public page is pre-rendered.** No request-time database reads. Content changes
   trigger revalidation from an `afterChange` hook. Do not add `force-dynamic` or a
   client-side fetch to solve a caching problem.
2. **Access control is a query, not a boolean.** Hiding UI is not access control.
3. **Alt text is required on every upload.**
4. **Images resize on upload**, never at request time.
5. **Sign-up state derives from dates**, never a manual status field.

## Rich text

`src/lib/richTextStates.ts` is the single source for both the editor and the renderer.
Adding a style to one without the other gives editors formatting that vanishes on the
site. Two invariants are asserted in tests: no fixed `px` sizes, and nothing that lets
text escape its column.

## Commits

Write the message from what actually changed. State the *why* when it is not obvious from
the diff. No generic "update files".

Do not commit without being asked to, and never commit secrets — `.env` is ignored, keep
it that way.

## Reporting a bug

Open an issue with the URL, the viewport width, what you expected and what happened. A
screenshot at 390px is worth several paragraphs.

For anything security-related, see [SECURITY.md](SECURITY.md) — do not open a public
issue.
