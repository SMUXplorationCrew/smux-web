# Elite upgrade delivery ledger

Branch: `feat/smux-elite-upgrade`, based on latest fetched `origin/main` (`5053fb5`).
Scope: every fix and upgrade in `ELITE-AUDIT-PLAN.md`. This is a live ledger; unchecked work is not delivered.

## Work packages

A box is checked only when the work is delivered **and** verified. Source code existing
is not delivery.

- [ ] Public/draft permissions, ownership, account unlock, URL safety and environment validation (S01–S07) — implemented; role matrix verified by `roles.int.spec.ts`, but draft leakage through REST/GraphQL/ICS is still untested
- [x] Test isolation, content restoration, fail-safe reads, lifecycle/calendar correctness and cache dependencies (B01–B12) — B01 fixed at cause and content restored from verified source; `pnpm seed` remains destructive by design and is documented as such
- [ ] Accessible navigation, carousel, reveals, headings, contrast, crops and mobile agenda (U01–U06) — implemented; overflow and tap targets covered by e2e, full axe/keyboard audit not run
- [ ] Home, club index/detail, Join, events/detail, gallery, committee, resources, about/contact and system pages — built; homepage hero now CMS-driven; gallery filters, committee year selection and the destination map unfinished
- [ ] Dashboard, readiness, secure preview, review/publishing, event wizard/templates/recurrence/import (A01–A08) — built; templates not wired to template content, preview not at parity with public layouts
- [ ] Media workflow, block presets, invitations, handover, audit history and bulk operations (A09–A14) — built; media reference detection misses rich text and blocks, audit hooks incomplete
- [ ] Link health, campaigns/QR, metrics and operational health (A15–A18) — built; metrics not wired to real interactions
- [ ] Adventure finder, shortlist, subscriptions, search, trip stories/map, recruitment and companion pages — built; map is a coordinate grid
- [ ] Interest reminders, benefits, registration/waitlist/check-in and optional content assistant — built; needs SMTP configuration and concurrency testing
- [ ] Migrations, isolated CI, security scan, monitoring, backups/restore tooling and release checks — migrations committed and applied; isolated CI, monitoring and backup rehearsal outstanding
- [x] README, architecture, editor/content/access guides, development/deployment/runbook/handover/design docs and templates — all thirteen written; README rewritten with accurate dated figures
- [x] Typecheck, lint, unit/integration/E2E, production build — all green as of 14 September. Cross-device visual review still needs a person

## Delivery constraints

Production data and deployment settings are not changed. External communications are not sent during development. Features requiring SMTP, external model credentials, or committee-provided facts are implemented with explicit capability checks and documented activation requirements. No missing factual content is invented.

## Visual design brief

Retain SMUX orange #f4751f, paper #ffffff, ink #231f20, quiet ground #f7f5f3 and the six existing club palettes. Saira Condensed is the expressive heading face; Barlow is the readable body face. Lead with genuine adventure photography and a clear joining action. Place the club selector directly below the hero, use compact event rows when photos are absent, and reserve larger editorial layouts for real stories. Mobile gets a clear agenda and persistent event/club actions. Avoid repetitive decorative cards and additional font families.

## Verification log — 14 September 2026

- TypeScript `tsc --noEmit`: passed.
- Biome: **0 errors, 0 warnings** (was 28 warnings), no deprecation notice.
- Unit: **105 passed** / 7 files.
- Integration: **55 passed** / 4 files (was 12 / 2).
- End-to-end: **11 passed**, first run. Needs a complete Chromium — see README.
- Production build: passed, **448 outputs**.
- Upgrade migration and slug-history migration applied to the isolated clone.
- Seven accounts provisioned and verified on the isolated clone only.

## Verification log — 12 September 2026

Paused at the user's request on 12 September 2026. See [HANDOFF.md](HANDOFF.md) for implemented source features, known gaps, environment state and the requested seven accounts.

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Existing unit tests: 105 passed / 7 files. New features still require dedicated coverage.
- Biome: passed with 28 warnings and one configuration deprecation notice; no lint errors.
- Production build, upgrade migrations, integration/E2E and visual review: not completed.
- Snapshot pushed to `feat/smux-elite-upgrade` on 14 September 2026; branch tracking corrected. Main was restored by revert `1c943a9`. No deployment verification performed. No requested accounts created yet.

Checkboxes above intentionally remain unchecked: source implementation does not establish complete delivery of a work package.


## Dependency PR consolidation — 14 September 2026

The working branch includes the updates proposed by Dependabot PR #8 (Next.js 16.3.3, already present) and PR #7 (Vitest 4.1.11, added with its matching lockfile dependencies). TypeScript passed and all 105 existing unit tests passed on Vitest 4.1.11. This does not change the outstanding migration, account provisioning or release-verification work above.
