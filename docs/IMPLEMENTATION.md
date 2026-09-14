# Elite upgrade delivery ledger

Branch: `feat/smux-elite-upgrade`, based on latest fetched `origin/main` (`5053fb5`).
Scope: every fix and upgrade in `ELITE-AUDIT-PLAN.md`. This is a live ledger; unchecked work is not delivered.

## Work packages

- [ ] Public/draft permissions, ownership, account unlock, URL safety and environment validation (S01–S07)
- [ ] Test isolation, content restoration, fail-safe reads, lifecycle/calendar correctness and cache dependencies (B01–B12)
- [ ] Accessible navigation, carousel, reveals, headings, contrast, crops and mobile agenda (U01–U06)
- [ ] Home, club index/detail, Join, events/detail, gallery, committee, resources, about/contact and system pages
- [ ] Dashboard, readiness, secure preview, review/publishing, event wizard/templates/recurrence/import (A01–A08)
- [ ] Media workflow, block presets, invitations, handover, audit history and bulk operations (A09–A14)
- [ ] Link health, campaigns/QR, metrics and operational health (A15–A18)
- [ ] Adventure finder, shortlist, subscriptions, search, trip stories/map, recruitment and companion pages
- [ ] Interest reminders, benefits, registration/waitlist/check-in and optional content assistant
- [ ] Migrations, isolated CI, security scan, monitoring, backups/restore tooling and release checks
- [ ] README, architecture, editor/content/access guides, development/deployment/runbook/handover/design docs and templates
- [ ] Typecheck, lint, unit/integration/E2E, production build and mobile/desktop visual review

## Delivery constraints

Production data and deployment settings are not changed. External communications are not sent during development. Features requiring SMTP, external model credentials, or committee-provided facts are implemented with explicit capability checks and documented activation requirements. No missing factual content is invented.

## Visual design brief

Retain SMUX orange #f4751f, paper #ffffff, ink #231f20, quiet ground #f7f5f3 and the six existing club palettes. Saira Condensed is the expressive heading face; Barlow is the readable body face. Lead with genuine adventure photography and a clear joining action. Place the club selector directly below the hero, use compact event rows when photos are absent, and reserve larger editorial layouts for real stories. Mobile gets a clear agenda and persistent event/club actions. Avoid repetitive decorative cards and additional font families.

## Verification log

Paused at the user's request on 12 September 2026. See [HANDOFF.md](HANDOFF.md) for implemented source features, known gaps, environment state and the requested seven accounts.

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Existing unit tests: 105 passed / 7 files. New features still require dedicated coverage.
- Biome: passed with 28 warnings and one configuration deprecation notice; no lint errors.
- Production build, upgrade migrations, integration/E2E and visual review: not completed.
- Local snapshot commit requested on 14 September 2026. No pushes or deployments. No requested accounts created yet.

Checkboxes above intentionally remain unchecked: source implementation does not establish complete delivery of a work package.
