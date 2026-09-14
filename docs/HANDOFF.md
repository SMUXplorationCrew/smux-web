# Elite upgrade handoff — paused 12 September 2026

The user requested an immediate wrap-up before the full upgrade was finished. This is an implementation snapshot, not a release candidate.

## Session of 14 September 2026

Closed out the database half of item 1 and all of item 2. Still not a release candidate.

- **Upgrade migration applied** to the isolated clone (`br-dry-violet-b3tsj23c`), 737ms. `up()` was read first and is purely additive: no `DROP`, `TRUNCATE`, `DELETE` or `ALTER COLUMN`, and every added `NOT NULL` column carries a default. All 16 new tables verified present; `payload_migrations` shows the upgrade as batch 1.
- **Production build run for the first time: passed.** 448 pages prerendered. Every public content route is static or SSG — the pre-render guarantee in CLAUDE.md holds. The dynamic routes are all admin, API or signed-in ones (`/manage`, `/account`, `/resources`, `/preview`, `/api/*`, the calendar feeds).
- **`importMap.js` was stale** and is now regenerated: it was missing the three new admin components (`Readiness`, `Dashboard`, `AdminLinks`), so they were not registered.
- **Trekking tagline repaired** to `Got an attitude for altitude?`, taken from `src/seed/content.ts`, applied through Payload so the version table and revalidation hooks stayed consistent.
- **The cause is fixed, not just the symptom.** `tests/int/access.int.spec.ts` wrote a tagline onto the real Trekking club and never restored it. It now captures the value first and restores it both in the test and in `afterAll`, and the sentinel it writes is obviously a test value. Confirmed by running the suite and re-reading the row.
- **Seven accounts provisioned and verified on the isolated clone.** `pnpm provision:accounts --out <path>` (new, `src/scripts/provision-accounts.ts`) is idempotent, generates its own passwords, refuses to write them inside the repo, and will not silently reset an existing password without `--reset-password`. All 7 logins succeed with the right role and club; a wrong password is rejected.
- **New `tests/int/roles.int.spec.ts`**: the full six-club matrix as real scoped queries — each editor can edit its own club, is refused on all five others, has its club forced onto a misfiled event, cannot promote itself to `mc`, and cannot read other accounts; MC can reach everything; a deactivated editor is refused reads, writes and the members-only resources. Integration tests went from 12 to 48.

Verification: `tsc --noEmit` clean · 105 unit tests · 48 integration tests · `pnpm build` passed · Biome 0 errors, 28 warnings (unchanged baseline). Still on Node 26.7.0, not the declared Node 22.

Not done, and still blocking a real rollout: the seven accounts exist **only on the isolated clone**, with throwaway passwords — live provisioning and the private credential handoff are still open, and the mailboxes are still unverified. Items 3 to 8 below are untouched.

**The shared `dev` branch (`br-frosty-river-b3u4rrww`) still carries the contaminated Trekking tagline.** It was not repaired: it is a shared environment and nobody asked for it to be written to. The same one-line fix applies, or re-seed it. `production` (`br-long-block-b3fdztu8`) has 0 club rows and was never affected.

## Session of 14 September 2026 (continued)

Everything below is committed on `feat/smux-elite-upgrade`.

- **Lint is clean.** 28 warnings to zero, mostly by narrowing rather than suppressing. One
  was hiding a defect: the invitation row lock dereferenced
  `payload.db.sessions?.[transactionID].db` behind a cast, which would have thrown from
  inside a half-open transaction. The four remaining suppressions are deliberate and say
  why. Generated migrations joined the Biome ignore list.
- **The documentation set is written** — nine guides under `docs/`, plus `CONTRIBUTING.md`,
  `SECURITY.md`, issue templates and a PR template. All thirteen were missing. The README
  went from 646 lines to 181, restructured as the audit proposed, with the drifted figures
  ("294 pages", "128 tests", "0 request-time queries") replaced by real dated ones.
- **Slug renames no longer break inbound links.** A `beforeChange` hook records the retired
  slug, the route answers the old address with a permanent redirect, and
  `generateStaticParams` includes old slugs so the redirect stays pre-rendered. Additive
  migration, 7 new tests including the rename-back case that would otherwise loop.
- **Operations collections now go through `enhanceCollection`.** They were concatenated
  after the `.map()`, so anything cross-cutting silently skipped stories and campaigns.
- **The homepage hero is CMS-driven.** `heroHeading`, `motto` and `heroButtons` existed
  with descriptions promising they controlled the hero, and were ignored in favour of
  hardcoded copy. The headline was also copy the audit asked to keep as a proposal until
  the committee chose it.
- **`/benefits` lost its `revalidate = 300`.** It was the only public page on a timer and
  is already in the publication path list.
- **The e2e suite ran for the first time: 11/11 pass**, covering no horizontal overflow at
  390/768/1280px and 44px tap targets. It found the hero defect above. The installed
  `chromium-1208` has no Frameworks directory and aborts on launch — point
  `PLAYWRIGHT_CHROMIUM_PATH` at a complete build.

Verification: tsc clean · Biome 0/0 · 105 unit · 55 integration · 11 e2e · build 448
outputs. Still Node 26.7.0, not the declared Node 22.

Still open, and honest about it: items 3 to 8 below are only partly addressed. Live
account provisioning, a verified deployed preview, a full accessibility audit, a
cross-device visual review, real committee content, analytics, monitoring and a backup
rehearsal are all outstanding — several of them need decisions or access that code cannot
supply. `docs/IMPLEMENTATION.md` carries the per-package state.

## Branch and environment

- Branch: `feat/smux-elite-upgrade`, created from freshly fetched `origin/main` at `5053fb5`.
- Snapshot committed and pushed to `feat/smux-elite-upgrade` on 14 September 2026. An accidental main update was restored by revert `1c943a9`; the working branch was rebased and its upstream corrected. Deployment state has not been verified.
- Local `.env` and `.env.local` point to isolated Neon branch `dev-smux-elite-20260912` (`br-dry-violet-b3tsj23c`, expires 12 October 2026), cloned from `dev`.
- Production data was not modified. The development clone still references existing R2 objects: do not run destructive media cleanup against it.
- Old local environment backups are in `/tmp/smux-elite-original.env` and `/tmp/smux-elite-original.env.local`, mode 0600. These are temporary local files, not repository artifacts.
- Baseline migration was adopted on the isolated clone after checking its table and column inventory. The elite upgrade migration **was reviewed and applied on 14 September 2026** — see the session note above.
- Node 22 is declared in `.nvmrc` and package engines. Current verification ran with installed Node 26.7.0; repeat on Node 22.

## Implemented in source, pending release verification

### Security and reliability

- Published-only anonymous data queries, role-aware draft access, inactive-user rejection and MC-only unlock.
- Editor club ownership enforcement, safer URL handling, explicit environment validation and schema-push opt-in.
- Next.js 16.3.3 dependency patch (absorbs Dependabot PR #8); Vitest 4.1.11 and matching lockfile dependencies (absorbs PR #7).
- Full event pagination, clock-derived event/signup state, unavailable signup handling, Singapore date boundaries and UTF-8-safe calendar folding.
- Cache invalidation hooks and persistent publication jobs with bounded retries.
- Native registration capacity locking, waitlists, cancellation/promotion, expiring single-use check-in tokens.
- Operations endpoints with origin checks, database rate counters, invitations, link checks and maintenance/email outbox code.

### Public website

- Redesigned homepage, club actions, Join page, event cards/detail pages and compact missing-photo layouts.
- Accessible modal mobile menu, larger carousel controls, pause control, resilient reveal animations and image focal points.
- Searchable/filterable event directory, mobile-first agenda, calendar feed, saved adventures and sharing.
- Club finder/comparison, site search, story and recruitment routes, gallery albums/lightbox, member benefits and event companion pages.
- Account/login/invitation pages, member resources search, reminders, optional contact form, privacy, committee archive and error/404 pages.

### Editor tools

- `/manage` workspace with role-scoped event lists and readiness summaries.
- Event draft wizard, duplication, four-week recurrence action, bulk review/archive/MC approval.
- XLSX/JSON parsing and import preview/apply, media batch upload and direct-reference usage lookup.
- Section presets, local writing helper, check-in form, invitations, committee year staging/activation and operational collection links.
- Collections for stories, campaigns, benefits, registrations, interests, audit records, publication jobs, aggregate metrics, invitations, contact requests and link checks.
- Draft preview route with access checks; this is a simplified preview, not yet complete parity with every public page layout.

## Verification at wrap-up

This records the state on 12 September and is superseded by the session note at the top —
the migration, the production build and new integration tests have since been run.

- TypeScript `tsc --noEmit`: passed.
- Existing unit suite: **105 tests passed across 7 files**. These do not comprehensively cover the new features.
- Biome: passed with 28 warnings and one configuration deprecation notice; no lint errors.
- Upgrade migration execution, new integration tests, browser/accessibility tests and production build: **not run**.
- No claims of production readiness, verified account isolation or completed native-registration concurrency testing are made.

## Seven requested accounts — created on the isolated clone only

| Account | Role | Editable scope |
| --- | --- | --- |
| diving@sa.smu.edu.sg | editor | Diving |
| kayaking@sa.smu.edu.sg | editor | Kayaking |
| trekking@sa.smu.edu.sg | editor | Trekking |
| biking@sa.smu.edu.sg | editor | Biking |
| skating@sa.smu.edu.sg | editor | Skating |
| xseed@sa.smu.edu.sg | editor | XSeed |
| xplorationcrew@sa.smu.edu.sg | mc | All website content, users and settings |

All seven now exist on the isolated clone with generated passwords, and the role matrix has been verified with real API requests (`tests/int/roles.int.spec.ts`) and real logins. **No live-account deployment was performed**, and the clone's passwords are throwaway — they were written to a 0600 file outside the repository and are not a handoff artefact.

To provision for real: point `DATABASE_URL` at the target environment and run `pnpm provision:accounts --out <path outside the repo>`, then hand each line to its owner privately and delete the file. Do not commit passwords. A UI session check per account is still worth doing before handing out access. The email aliases were user-specified; mailbox existence has not been verified.

## Remaining work, in order

1. **Database and accounts:** ~~review/apply upgrade migration on the isolated clone~~, ~~provision the seven accounts, verify cross-club denials and MC control~~ — both done 14 September. Still open: test baseline adoption and fresh migrations on a schema-only test branch, review SQL parameter types and invitation transaction behaviour, and provision the accounts on the live environment.
2. **Isolation:** ~~replace the destructive shared-data integration fixture~~ and ~~repair the Trekking tagline~~ — both done 14 September, on the isolated clone. Still open: the seed script still clears the collections it owns, so it is still unsafe against shared data; and the shared `dev` branch still holds the contaminated tagline.
3. **Security/integrity:** test draft leakage through HTML/RSC/REST/GraphQL/ICS; inactive accounts and sensitive fields; ownership reassignment; file access and safe deletion; invitation expiry/replay; SSRF; rate limits; capacity races and waitlist fairness. Audit API error redaction and upload limits/archives.
4. **Feature completion:** wire event templates to actual template content; harden import validation and transactional/partial failure reporting; cover all media references including rich text/blocks; finish audit hooks; confirm native-registration publication updates and notification semantics; improve saved-item storage failure feedback.
5. **Website polish:** make draft previews reuse complete public renderers; preserve homepage CMS hero copy/buttons; refine the destination map (currently a coordinate grid); finish gallery filters, committee year selection, about page, rich resource presentation, keyboard/axe checks and visual review across phone/tablet/desktop. Review placeholders and real content readiness.
6. **Publishing/operations:** test cache consumers/old slugs and durable retries; implement slug redirects; complete sitemap/OG/structured-data coverage; connect aggregate metric collection to actual interactions; wire and verify scheduled maintenance; configure email delivery explicitly; add operational health dashboard and backup/restore rehearsal. Review CSP/security headers and dependency audit.
7. **Testing and CI:** meaningful new unit/integration/E2E coverage, isolated Neon CI, lint warning cleanup, production build, no-JS testing, lifecycle/timezone tests, all seven login flows and account permission regression checks. Repeat on Node 22.
8. **Documentation:** replace stale README route/test/static-rendering claims; finish architecture, editor, access, content, design, development, deployment, operations and handover guides plus issue/PR templates. The audit and this status handoff are written; the full documentation refresh is not complete.

Consult `ELITE-AUDIT-PLAN.md` for the complete intended scope and `IMPLEMENTATION.md` for the delivery ledger. Large work packages stay unchecked until fully delivered and verified.
