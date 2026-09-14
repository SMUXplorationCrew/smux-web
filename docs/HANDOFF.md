# Elite upgrade handoff — paused 12 September 2026

The user requested an immediate wrap-up before the full upgrade was finished. This is an implementation snapshot, not a release candidate.

## Branch and environment

- Branch: `feat/smux-elite-upgrade`, created from freshly fetched `origin/main` at `5053fb5`.
- The user requested a local work-in-progress snapshot commit on 14 September 2026. Nothing was pushed or deployed.
- Local `.env` and `.env.local` point to isolated Neon branch `dev-smux-elite-20260912` (`br-dry-violet-b3tsj23c`, expires 12 October 2026), cloned from `dev`.
- Production data was not modified. The development clone still references existing R2 objects: do not run destructive media cleanup against it.
- Old local environment backups are in `/tmp/smux-elite-original.env` and `/tmp/smux-elite-original.env.local`, mode 0600. These are temporary local files, not repository artifacts.
- Baseline migration was adopted on the isolated clone after checking its table and column inventory. The **elite upgrade migration has not been applied**. New routes querying new tables will fail until it is reviewed and applied.
- Node 22 is declared in `.nvmrc` and package engines. Current verification ran with installed Node 26.7.0; repeat on Node 22.

## Implemented in source, pending release verification

### Security and reliability

- Published-only anonymous data queries, role-aware draft access, inactive-user rejection and MC-only unlock.
- Editor club ownership enforcement, safer URL handling, explicit environment validation and schema-push opt-in.
- Next.js 16.3.3 dependency patch.
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

- TypeScript `tsc --noEmit`: passed.
- Existing unit suite: **105 tests passed across 7 files**. These do not comprehensively cover the new features.
- Biome: passed with 28 warnings and one configuration deprecation notice; no lint errors.
- Upgrade migration execution, new integration tests, browser/accessibility tests and production build: **not run**.
- No claims of production readiness, verified account isolation or completed native-registration concurrency testing are made.

## Seven requested accounts — not yet created

| Account | Role | Editable scope |
| --- | --- | --- |
| diving@sa.smu.edu.sg | editor | Diving |
| kayaking@sa.smu.edu.sg | editor | Kayaking |
| trekking@sa.smu.edu.sg | editor | Trekking |
| biking@sa.smu.edu.sg | editor | Biking |
| skating@sa.smu.edu.sg | editor | Skating |
| xseed@sa.smu.edu.sg | editor | XSeed |
| xplorationcrew@sa.smu.edu.sg | mc | All website content, users and settings |

Use separate random passwords and a private credential handoff, or private single-use invitations. Do not commit passwords. Start on the isolated upgrade environment; no live-account deployment was performed. Verify the role matrix with real API requests and UI sessions before handing out access. The email aliases were user-specified; mailbox existence has not been verified.

## Remaining work, in order

1. **Database and accounts:** review/apply upgrade migration on the isolated clone, test baseline adoption and fresh migrations on a schema-only test branch, provision the seven accounts, verify cross-club denials and MC control. Review SQL parameter types and invitation transaction behavior. Stop the baseline CLI cleanly after completion; its process lingered during this run.
2. **Isolation:** replace destructive shared-data integration fixtures and seed clearing with guarded isolated fixtures. Repair the known Trekking tagline contamination only from verified source content. Do not run the current integration suite or seed script against shared data.
3. **Security/integrity:** test draft leakage through HTML/RSC/REST/GraphQL/ICS; inactive accounts and sensitive fields; ownership reassignment; file access and safe deletion; invitation expiry/replay; SSRF; rate limits; capacity races and waitlist fairness. Audit API error redaction and upload limits/archives.
4. **Feature completion:** wire event templates to actual template content; harden import validation and transactional/partial failure reporting; cover all media references including rich text/blocks; finish audit hooks; confirm native-registration publication updates and notification semantics; improve saved-item storage failure feedback.
5. **Website polish:** make draft previews reuse complete public renderers; preserve homepage CMS hero copy/buttons; refine the destination map (currently a coordinate grid); finish gallery filters, committee year selection, about page, rich resource presentation, keyboard/axe checks and visual review across phone/tablet/desktop. Review placeholders and real content readiness.
6. **Publishing/operations:** test cache consumers/old slugs and durable retries; implement slug redirects; complete sitemap/OG/structured-data coverage; connect aggregate metric collection to actual interactions; wire and verify scheduled maintenance; configure email delivery explicitly; add operational health dashboard and backup/restore rehearsal. Review CSP/security headers and dependency audit.
7. **Testing and CI:** meaningful new unit/integration/E2E coverage, isolated Neon CI, lint warning cleanup, production build, no-JS testing, lifecycle/timezone tests, all seven login flows and account permission regression checks. Repeat on Node 22.
8. **Documentation:** replace stale README route/test/static-rendering claims; finish architecture, editor, access, content, design, development, deployment, operations and handover guides plus issue/PR templates. The audit and this status handoff are written; the full documentation refresh is not complete.

Consult `ELITE-AUDIT-PLAN.md` for the complete intended scope and `IMPLEMENTATION.md` for the delivery ledger. Large work packages stay unchecked until fully delivered and verified.
