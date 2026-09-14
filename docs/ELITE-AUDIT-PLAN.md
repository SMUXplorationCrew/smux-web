# SMUX: full audit and upgrade plan

Audit date: 12 September 2026. Baseline: `main`, `5053fb5`.

**The direction: make SMUX the easiest way for an SMU student to find their next adventure, and the easiest website for the next committee to inherit.**

Keep Next.js, Payload, Neon, R2, the six club themes, and the photography-led identity. Build on the existing system. The biggest gains come from trustworthy event information, a much shorter joining journey, better mobile layouts, and a CMS that tells editors what needs attention.

This is an implementation plan, not a record of completed fixes. No application code, content records, dependencies, or deployment settings were changed during this audit. The existing ignored `docs/ROADMAP.md` remains untouched; several of its proposed features have already shipped and are accounted for below.

## 1. What was actually checked

| Check | Result and limitation |
| --- | --- |
| Repository review | Collections, access rules, public routes, components, content helpers, hooks, seed scripts, CI, tests, configuration, README, local project guidance and previous roadmap |
| `pnpm test:unit` | **105 passed**, seven files |
| `pnpm exec tsc --noEmit` | **Passed** |
| `pnpm lint` | **Passed with six warnings and one deprecation notice**; no automatic fixes applied |
| `pnpm build` | **Passed**, 294 generated static outputs, including metadata images; this is not 294 distinct content pages |
| Browser audit | Production build at localhost:3100 using installed Chrome: **13 routes × 390/768/1440px = 39 successful responses**, no document-level horizontal overflow; no page errors during normal navigation |
| Interaction checks | Measured carousel targets; tested keyboard escape from the menu, resize while open, and blocked JavaScript bundles |
| Content snapshot | Anonymous REST reads from the locally running app's configured database: **133 published events, 132 without signup URLs, 133 without covers, 132 with unconfirmed times, zero with end times**. Nine events were within their signup window with no signup URL at inspection time |
| Dependency audit | `pnpm audit --prod`: **two critical and one moderate advisory**. See applicability below |
| Authenticated admin workflow | Configuration/source reviewed and login screen opened. Authenticated editing, invitation delivery and password reset delivery were **not exercised** |
| Local email capability | The production-mode local server logged **“No email adapter provided”**. This confirms the audit environment lacks sending configuration; production delivery configuration remains unverified |
| Existing integration/admin E2E suites | **Not run against the configured database**: they create/delete accounts and one test overwrites a real club tagline without restoring it |
| Production infrastructure | Hosting controls, actual production database branch isolation, email delivery, backups, CDN behavior, traffic, field performance and production credentials were **not independently verified** |

The thirteen browser routes were home, clubs, Trekking, Diving, events, one event detail, calendar, gallery, join, about, contact, committee and resources. Passing these checks is a useful baseline, not an accessibility certification or penetration test.

### Already good—retain and strengthen

- Six club palettes and shared design tokens, server-rendered public pages, small interactive components.
- Upload-time image variants, responsive `srcset`, required media alt text, and private resource cache headers.
- Scoped update rules, a positive distinction between members and editors, and self-only user reads for non-MC users.
- Draft/version support for clubs, events and editorial pages; Events already has useful tabs.
- Nine reusable page blocks, rich-text styles shared between editor and renderer, configurable home/club/committee content.
- Signup date boundaries, date and capacity validation, date filters, social normalization, sitemap, robots, generated OG images, and individual calendar downloads.

Do not spend a sprint rebuilding these as if they were absent. The work is completing their behavior and testing their boundaries.

## 2. Bugs and risks to fix first

Priority: **P0** before expanding exposure; **P1** next delivery wave; **P2** polish and scale. Evidence: **observed** means reproduced during this audit; **source** means traced in code but not reproduced with a database mutation; **advisory** means a dependency report whose deployment applicability needs assessment.

### Security and publishing

| ID | Priority / evidence | Finding | Fix and proof of completion |
| --- | --- | --- | --- |
| S01 | P0 / source | Public Local API reads omit `overrideAccess: false` and an explicit publication filter. Payload defaults to bypassing access; `draft: false` selects ordinary documents, not an automatic `_status = published` rule. A never-published or unpublished document can enter public pages, static params, sitemap or calendar exports. See `src/lib/payload.ts:38`, `:93`, `:110`, `:158` and installed Payload `collections/operations/local/find.js`. | Create an explicitly anonymous public query layer; enforce published-only results and safe populated relationships. Separate authenticated preview reads. In an isolated DB, prove a never-published draft, an unpublished record and a draft related club cannot leak through HTML, RSC data, REST, GraphQL, sitemap, OG or ICS. |
| S02 | P1 / source | `publishedOrSignedIn` returns `true` for **any** user (`src/access/index.ts:81`). Members can read drafts and editors can read other clubs' drafts. CMS descriptions promising editors only see their club are inaccurate. Existing integration tests mainly prove writes, not this read boundary. | Define the actual matrix: public/member get published content; editors get their own drafts plus whatever published content the public can read; MC gets all. Filter admin lists to owned items for usability. Test both ownership and status in REST, GraphQL, Local API and relationship pickers. |
| S03 | P1 / source | Media ownership is only defaulted when empty (`src/collections/Media.ts:86`). An editor can supply another club on upload or move their own media record to another club. | Force editor ownership on create/update, or reject reassignment. Permit transfers only to MC. Enforce that every editor has a valid club. Test crafted writes and an editor account with no club. |
| S04 | P0 / advisory | `next@16.3.0` is in the affected range of two critical reports; earliest listed fix is **16.3.3**. One concerns Windows-hosted servers; the other AVIF processing through image optimization. Using plain images does not itself disable Next's optimizer endpoint. | Upgrade to a compatible patched Next release, inspect the installed sharp/libvips/libheif chain and the CMS upload path, and rerun the production build plus image/admin checks. No malicious input was sent. The Windows issue is not evidence of exposure on the documented Vercel architecture. [Windows advisory](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), [AVIF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4). |
| S05 | P1 / advisory + source | Payload's default unlock access allows any authenticated user; Users does not override it. The installed default is `Boolean(user)`. The audit reports GHSA-jg8r-5jh2-v2xj for `payload@3.88.0` and supplies no patched version. | Set a deliberate `unlock` rule, normally MC-only, and test a member/editor cannot reset another account's lockout. Track the upstream fix; do not assume an arbitrary Payload upgrade resolves it. |
| S06 | P1 / source | `SignupControl` writes raw `signupUrl` to `href`, bypassing the shared URL helper; the CMS validator only checks bracket placeholders. Bare domains can become broken relative links. `safeUrl` also classifies `//host` as internal. | Validate signup destinations as properly parsed HTTP(S) URLs on save and render. Reject control characters and unsupported schemes, distinguish protocol-relative URLs, and use one link contract across nav, rich text, blocks and signup. Do not rely on React's handling of dangerous URL schemes. |
| S07 | P1 / source | Production silently falls back to filesystem uploads if R2 credentials are incomplete; `.env.example` uses `DATABASE_URI`, which takes precedence over the README's Neon variables. Missing SMTP also remains a silent operational fallback. | Validate environment requirements at startup/build for each mode; fail deployment when persistent storage or required auth delivery is absent. Align example variables with actual precedence. Report capabilities without logging secrets. |

Payload documents the [Local API access bypass default](https://payloadcms.com/docs/local-api/access-control) and [collection access controls](https://payloadcms.com/docs/access-control/collections). These support the fixes above; the actual findings come from this repo and its installed dependencies.

### Correctness and content reliability

| ID | Priority / evidence | Finding | Fix and proof of completion |
| --- | --- | --- | --- |
| B01 | P1 / observed + source | **Trekking's rendered tagline is “Edited by the Trekking editor.”** The exact string is written by `tests/int/access.int.spec.ts:158`; cleanup removes test users/events but never restores the club. | Isolate test databases and use per-run fixtures. Restore legitimate content from a verified source/version, not an invented tagline. Make cleanup unconditional and prove tests leave existing content unchanged. |
| B02 | P1 / observed + source | **“Sign up” can describe a disabled span.** 132/133 events have no URL; nine currently fall into this misleading state. `src/components/SignupControl.tsx:48` disables the control but keeps the open label. Cards also imply availability. | Distinguish signup timing from link availability: “Details coming soon”, “Opens…”, “Sign up”, “Full”, “Closed”, “Event ended”. Include an actionable contact where available. Preserve date-derived registration state. |
| B03 | P1 / source | Upcoming lists freeze at generation time (`src/lib/payload.ts:79`), while only signup labels update in the browser. Past events can remain on home/events/club/committee until a content edit. Client date filtering has an upper bound but no elapsed-event exclusion. | Derive time-dependent presentation from a shared clock and compact static event data; refresh on visibility changes. For bounded home lists, regenerate and warm pages around event transitions. Test time progression with no CMS edit. |
| B04 | P1 / source | Events with no closing date remain open even after finishing; date-only events disappear from upcoming queries at their nominal start time. All current records lack end times. | Specify timed, date-only and multi-day semantics. Treat event lifecycle separately from registration lifecycle; close ended events and keep date-only events visible through their last Singapore calendar day. Validate event times, finite integer capacity and registration deadlines together. |
| B05 | P1 / source | Cache invalidation misses consumers. Club updates omit `/clubs` and other pages showing that club; event updates omit `/committee`, sitemap and metadata paths; People/Media have no hooks. Event/album reassignment only refreshes the new club. See `src/hooks/revalidate.ts:59–104`, People and Media collections. | Maintain an explicit dependency map covering old and new owners, deletes, unpublishes, metadata, media and committee. Log failed invalidations; retry/warm pages and show publish status. Integration-test that an edit appears in every consumer without rebuilding. |
| B06 | P1 / source | `safely()` returns empty arrays/null for database failures (`src/lib/payload.ts:25`). A production outage during build/regeneration can become a successful empty website or cached not-found response. CI intentionally depends on this fallback. | Separate intentional fixture builds from production data access. Production must fail on unexpected data errors; preserve last successful pages during failed regeneration. Reserve empty states for real empty results. Test unavailable database and missing schema independently. |
| B07 | P1 / source | Calendar export uses UTC dates for date-only events, always exports one day even if `endsAt` spans several days, and folds by JS string length rather than UTF-8 octets. See `events/[slug]/calendar/route.ts:19–45`. | Emit Singapore date keys, exclusive end dates after the last event day, stable event-ID UIDs, proper escaping and UTF-8-safe folding. Verify an early-morning SGT event, a 3-day trip, a timed event and an emoji/long title with an ICS parser and calendar import. [iCalendar specification](https://datatracker.ietf.org/doc/html/rfc5545). |
| B08 | P2 / source | Calendar opens on a build-time anchor using server-local `getMonth()`, and only buckets an event on its start day. No current-day action. | Resolve the current SG month after hydration, preserve URL-selected months, add Today, and display continuing trips on each relevant date. |
| B09 | P2 / source | People queries ignore `ay`; previous committees will be mixed into current pages as soon as a second year exists. Lists sort alphabetically, not by role. | Add current academic year and explicit display order; public current committee by default, deliberate archive navigation. Test overlapping years and leadership order. |
| B10 | P2 / source | Query caps differ: event page static params 200, calendar 300, sitemap/OG 500, albums 50, people 100, resources 200. Growth silently truncates views. Unbuilt event slugs may render on first request, contradicting the all-prerender promise. | Page through build datasets, use bounded purpose-specific list queries and real pagination for archives. Specify how newly published routes are generated/warmed. Test a dataset larger than each limit. |
| B11 | P2 / source | Focal point is enabled in Media, but `MediaImage` does not apply `focalX/focalY` when `object-cover` crops images. | Apply focal positioning to display crops, provide separate mobile/desktop crop previews and ensure replacements refresh usages. |
| B12 | P1 / source; workflow unverified | Members are directed from `/resources` to `/admin/login`, while `Users.access.admin` excludes members. No public member sign-in/return/logout flow exists. | Add a member-facing login with a safe return path, accessible errors, reset flow, logout and resource access. Test an actual member end-to-end; distinguish authentication from permission to enter the admin UI. |

### UI and accessibility defects

| ID | Priority / evidence | Finding | Fix and proof of completion |
| --- | --- | --- | --- |
| U01 | P1 / observed | Carousel dots are **6×6px**, active dot **24×6px**. The site promises 44px controls, but tests only inspect menu links. No dedicated pause/resume control. | Keep small visual dots inside at least 44×44px buttons; add accessible pause/resume, keyboard navigation and visible focus. Verify touch geometry and motion preferences. WCAG AA uses a [24px minimum with exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); 44px is the project's stronger usability target. |
| U02 | P1 / observed + source | Open mobile menu lets keyboard focus escape into the covered page. Resizing to desktop leaves `body` scrolling **hidden**. The fixed top offset also ignores announcement-banner height. | Use a correctly managed modal navigation surface: focus containment/return, background inertness, breakpoint cleanup, route-change cleanup and measured header offset. Test Escape, Tab, back navigation, banner wrapping and resize. |
| U03 | P1 / observed | With JS bundles blocked, the inline script still sets `data-js=1`; reveal content remains at opacity **0**. This contradicts the README's “broken JS stays visible” guarantee. | Let the mounted observer opt individual elements into animation only after it can reveal them, with visible-by-default fallback. Test JS disabled, chunks blocked, reduced motion and client navigation. |
| U04 | P2 / observed + source | `/resources` has no h1; Gallery's primary album headings jump from h1 to h3. Small selected club chips use white on the raw accent instead of contrast-safe tokens. | Correct heading levels and measure all actual state combinations, including selected/hover/disabled. Add contrast checks to the rendered component tests, not just the token palette. |
| U05 | P1 / observed design issue | Calendar has no document overflow, but its **42rem minimum-width grid** only shows part of a week on a phone. Passing an overflow test does not make the layout useful. | Default to an agenda on phones; offer an accessible calendar/list switch. Date, club and signup filters must work in both views. |
| U06 | P1 / observed design issue | Join is mostly explanation followed by another “Browse the clubs” hop. Club-page join actions sit far down long pages. Most event artwork is a large empty tinted box. | Put real club actions directly on Join, move a primary CTA into the club hero, add a mobile sticky CTA and use compact no-photo event cards until appropriate artwork exists. |

## 3. Visual and product direction

### A more distinctive SMUX identity

Aim for an outdoor editorial feel: expressive condensed headings, generous readable body text, warm neutral surfaces, club-specific accents, real action photography, and occasional route/map motifs. Keep the existing fonts unless actual brand guidelines say otherwise.

Use asymmetry selectively: a strong lead story or trip photograph, then a calmer grid. The current repeated full-width sections and similarly weighted cards need more variation in emphasis. Replace oversized empty photo placeholders with intentionally designed text-first cards.

Build shared button, chip, field, card, badge, alert, dialog, empty/error, skeleton, tabs and pagination primitives. Specify hover, focus, disabled, loading and error states. Define spacing, readable line length, fluid heading sizes, crop ratios and motion durations as tokens. Use icons consistently and never depend on color alone to identify a club or status.

Motion should help orientation: short page/section entrances, understated card feedback and optional hero crossfades. Content and controls must remain available without animation. Load the first hero image eagerly; avoid downloading every large background immediately. A lightweight poster is the default if a future hero uses video; autoplay video is not a launch requirement.

### Homepage: discovery in the first screen

Proposed order:

1. Compact announcement with a real action and an expiry date.
2. Adventure photograph, a short human headline, primary **Find your club** and secondary **See upcoming events**.
3. Six clubs immediately discoverable; a club action should not require scrolling past a large motto block.
4. **This week at SMUX**: three useful events with date, readiness and actual signup availability.
5. One editorial trip story/photo composition, supported by a real participant quote.
6. Short explanation of beginner participation, membership and how joining works.
7. Compact motto/community section and useful footer.

Candidate copy direction: “Your next adventure starts here.” Keep it a copy proposal until the committee chooses it. Never invent participant counts, certifications, costs, endorsements or beginner eligibility.

### Page-by-page upgrade list

| Area | Recommended upgrade | Completion criterion |
| --- | --- | --- |
| Navigation | Five main destinations: Clubs, What's On, Stories, About, Join; group Calendar under What's On and Committee/Contact under About. Prominent Join action, consistent nested active states, breadcrumb on details. | First-time mobile users can find a club, upcoming event and contact without understanding the organization chart. |
| Club index | Six strong identity cards with actual logos when supplied, short activity descriptions, verified beginner/commitment/cost indicators and optional comparison. | Every club communicates why someone might choose it and gives a clear next action. |
| Club detail | Hero CTA, mobile sticky Join/Ask action, quick facts, sticky section anchors, next eligible event, beginner guidance, gear/cost, representative trip photography, current committee and concise FAQs. | Core join/contact action visible immediately; important facts findable without reading the whole page. |
| Events | Search, club/activity/date/registration filters, useful result count, URL-preserved state, grid/list switch, upcoming/ongoing/past tabs and practical empty states. | Share a filtered URL and get the same results; back navigation preserves filters; past events age correctly. |
| Event detail | Event facts near the top on mobile, distinct lifecycle badge, verified signup action, deadline, venue/map link, prerequisites, itinerary, packing list, organizer contact, related events and share/calendar actions. | A student can decide whether to attend and act without hunting through prose. |
| Calendar | Mobile agenda, desktop month/week views, Today, filters, multi-day spans, deep links and per-club calendar subscription. | All-day and timed events match SGT; schedule changes update subscribed feeds when clients refresh. |
| Join | Six direct club entry points plus a short three-step explanation. Clarify event participation versus membership. Include verified fees/benefits where available and ask-a-human fallback. | Home → club action → form/contact within two taps where a verified link exists. |
| Gallery / Stories | Album covers first, club/year tags, dedicated album routes, accessible lightbox, captions/credits and a path from a past trip to the next event. Add longer trip stories later. | Visitors browse quickly instead of loading every photograph into one long page. |
| Committee | Current year and role ordering, leadership/team groups, year archive, contact visibility choices. | Annual handover preserves history without displaying old and new committees together. |
| About | Concise purpose, history/timeline, the six clubs, verified values and safety information, representative photos and Join action. | Clear identity without duplicating every club page. |
| Contact | Reason-based routing: joining, event questions, collaborations and general enquiries; named destination/response expectations only if confirmed. | Enquiries reach an accountable owner; no generic dead-end form. |
| Resources | Member login, club/year/type/search filters, useful file metadata, accessible download behavior and explicitly scoped audiences. | Anonymous direct downloads fail; members can sign in, find a document and sign out without entering CMS. |
| System pages | Branded 404, useful empty states, recoverable errors and privacy/help pages appropriate to actual features. | A broken link always gives a credible route back to clubs or events. |

## 4. Admin: turn the CMS into a practical committee workspace

Keep Payload's built-in authentication, collection forms, drafts and versions. Add task-focused surfaces and guardrails around them. Avoid replacing its entire admin framework just to change visual styling.

| ID | Capability | What it does | Size / dependency |
| --- | --- | --- | --- |
| A01 | Role-specific dashboard | Editor sees their club, upcoming deadlines, unpublished edits, incomplete events and recent work. MC sees all six clubs and site-wide problems. Every item links directly to the needed edit. | M; S01–S03 |
| A02 | Content readiness | Explain missing URL, unconfirmed details, weak/no cover, stale contacts and expired campaign links. Hard blockers for unsafe content; useful warnings for legitimate date-only announcements. Never use a meaningless score as the only explanation. | M; B02–B06 |
| A03 | Secure live preview | Preview actual desktop/mobile pages with drafts, authenticated access and a visible preview banner. Public cache and sitemap must remain clean. | L; S01/S02 and cache model |
| A04 | Publishing workflow | Optional Draft → Ready for review → Published flow, with author/reviewer metadata. Separate editorial approval from time-derived signup state. Show which pages were refreshed and whether refresh failed. | L; A02/A03/B05 |
| A05 | Event creation wizard | Basics → schedule → participation/signup → content → preview. Singapore time guidance, generated editable slug, sensible club defaults and visible errors next to fields. | M; validation contract |
| A06 | Event templates and duplication | Templates for regular sessions/trips; duplicate as draft and deliberately clear/reset dates, signup links and capacity counts. Extend existing duplication where possible. | M; A05 |
| A07 | Recurring sessions | Generate a reviewed series with exceptions, cancellation and one-occurrence/all-future editing. Do not blindly duplicate records every week. | L; event lifecycle model |
| A08 | Spreadsheet import | Upload CSV/XLSX → map columns → validate → dry-run diff → confirm → import log. Stable external IDs and idempotent updates. Preserve confirmed source data and provenance. | L; migrations, fixture DB |
| A09 | Media workspace | Ownership filters, aspect-ratio/crop guidance, usage references, missing-alt checks, batch captions, progress/retry, large-file limits and safe deletion warnings. | L; S03/B11 |
| A10 | Page-building presets | Visual thumbnails for the nine existing blocks, useful default layouts, section anchors and previews. Preserve existing block slugs and stored field shapes. | M; shared UI system |
| A11 | User onboarding | MC invites an editor to a required club; expiring invite, password setup/reset, self-service profile/password, deactivate access and explicit unlock authority. Audit role changes. | L; S05/S07 |
| A12 | Annual handover | Stage next AY committee, invite successors, review access, archive outgoing year and publish the new committee without deleting history. | M; B09/A11 |
| A13 | Change history | Surface built-in versions for clubs/events/pages; add necessary history for globals, people and operational actions. Show editor, time and human-readable changes. | M; retention policy |
| A14 | Safer bulk actions | Bulk ownership/AY changes with preview and scope checks; archive rather than casually delete related content. Retry failed rows and report partial success. | M; permission tests |
| A15 | Link health | Periodically check approved external links with timeouts, safe network restrictions and an editor review queue. Do not mark a Google Form invalid solely because it blocks automated requests. | M; job runner |
| A16 | Recruitment campaigns | Time-bounded banner, landing-page preset, QR code, source-tagged links and an expiry reminder. | M; event/link metrics |
| A17 | Useful analytics | Club-page visits, outbound signup clicks, calendar adds and missing-link opportunities; label clicks accurately, since off-site form completion is unknown without an integration. | M; measurement plan |
| A18 | Operational health | Restricted status view for last successful content refresh, import failures and media/email capability checks. No secrets or sensitive server logs in the UI. | M; monitoring |

Size legend: S = under a day, M = about 1–3 focused engineering days, L = roughly 4–8+ days. These are planning ranges including validation, not promises or additive sprint estimates.

### Forms and editor UI details

- Persistent labels and useful examples; required/optional fields clearly distinguished.
- Date/time rows with “Singapore time” beside the control; distinguish date-only from an unknown end time.
- Inline validation plus an error summary that moves focus to the first invalid field.
- Save state, unsaved-change protection and a clear draft-versus-publish action.
- Link paste normalization, a safe open-link check and meaningful invalid-link errors.
- Image dimensions, crop preview, alt/caption guidance, retryable upload progress and a cancel action.
- Multi-select controls usable with keyboard and touch; searchable relationship pickers scoped to appropriate content.
- Destructive actions explain affected records and reference usage. Bulk writes return clear successes and failures.
- Public contact/interest forms only where they have an owner: loading state, duplicate-submit prevention, retained values on failure and an honest confirmation. Define the destination before building a form.

## 5. Bigger features worth building after the foundation

| Feature | Why it is useful | Scope / tradeoff |
| --- | --- | --- |
| **Find your adventure** | A short preference selector recommends clubs based on indoor/outdoor/water interests, commitment and experience. Links directly to a suitable first event. | M. Start with transparent rules and committee-verified attributes; no AI or sensitive profiling needed. |
| **My SMUX shortlist** | Save clubs/events locally and build a personal agenda without forcing account creation. | M. No cross-device sync initially; explain this and offer clear/reset controls. |
| **Club calendar subscriptions** | Follow a club or all SMUX events once. Stable IDs prevent duplicates when details change. | M after B07. Refresh timing is controlled by calendar clients; it is not instant notification. |
| **Global search** | Search clubs, events, approved editorial pages and stories from a compact generated public index. | M. Keep private resources and drafts out; add a service only if index size/search needs justify it. |
| **Trip stories and destination map** | Curated photos, short recaps and approximate destinations make the community tangible. | L. Do not expose sensitive routes, live participant locations or unreviewed safety advice. |
| **Recruitment hub** | Campaign page, six direct club links, booth information, verified schedules, QR codes and a beginner guide. | M. A strong seasonal use of reusable CMS blocks. |
| **Interest reminders** | Explicit opt-in for a club or event; notify when registration opens. | L. Needs actual delivery, preferences, unsubscribe and ownership of replies. Plan only—no messages sent. |
| **Open-session companion page** | Packing checklist, meeting-point link, organizer contact, calendar item and last-updated notice. | M. Use verified event details; public pages must not contain attendee data. |
| **Member benefits directory** | Explain real membership benefits, gear borrowing information and eligible opportunities. | M. Start informational; bookings/inventory are separate operational products. |
| **Native registration and waitlist** | Genuine on-site completion tracking, capacity allocation and cancellations. | XL, separate project. Requires transactional capacity, duplicate prevention, admin recovery, data retention and attendee communication. Keep external forms for the initial upgrade. |
| **Check-in and attendance** | Organizer-only attendee roster and short-lived check-in codes. | XL after native registration and proper role boundaries; not needed for a great public website. |
| **Content assistant** | Draft alt text or summarize an approved event description for an editor to review. | Optional L. Never auto-publish facts, invent logistics, or send private member material to an external model by default. |

Do not add a chatbot, payments, a social feed or complex gamification merely to increase the feature count. Each introduces moderation or operational responsibility. The first six features above deliver more immediate value for this site.

## 6. Architecture, performance and operational upgrades

### Make the caching promise accurate and testable

The current README repeatedly promises zero request-time queries. The build marks `/resources` **and** `/events/[slug]/calendar` dynamic. `revalidatePath()` called from a route-handler context marks a route for regeneration on its next visit; it does not itself precompute fresh HTML. This is documented by [Next.js](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

Recommended contract: public page cache hits serve pre-rendered content; publishing regenerates affected pages; private/auth routes execute per request. To preserve the stricter intention that visitors never initiate regeneration, add a reliable publish job that warms affected routes and verifies publication, including newly created event slugs. Do not solve staleness by making every public page dynamic.

- Centralize public query filters and dependency mapping. Keep request-level React memoization distinct from persistent caching.
- Return compact card/calendar data instead of serializing full depth-2 CMS documents into client components. The audit measured roughly 221k characters of rendered DOM on Calendar and 209k on Events at 390px; those are DOM sizes, **not network transfer or Core Web Vitals measurements**.
- Use list/detail-specific selection and population; avoid loading complete club stories for a calendar badge. Match indexes to status, date and ownership queries after examining real query plans.
- Avoid one interval per signup label; use a shared clock or boundary scheduling, and refresh after a tab becomes visible.
- Bound gallery pages and load full images in the lightbox on demand. Keep existing upload-time variants; document justified lint suppression for plain images.
- Honor focal points, reserve dimensions and use appropriately small card/thumbnail sources.
- Add purpose-specific cache headers and tests for metadata, public media and private downloads. Confirm media replacement naming before relying on year-long immutable caches.

### Database and delivery

- Commit versioned Payload migrations with a tested production sequence. The repo has no committed migration directory; “apply schema from a developer machine” is an insufficient handover procedure.
- Separate production, staging and per-PR databases/storage. Do not infer that the current environment already does this.
- Use synthetic fixtures on temporary Neon branches for CI. Never run integration/E2E against production or against an unverified URL.
- Require an explicit disposable-environment guard for seed/test scripts. Seed reset is destructive even though a comment calls it safe to rerun.
- Give fixtures unique run IDs; clean them in `finally`; avoid broad `like` deletes and fixed shared test accounts. Prefer fixtures that never touch actual club content.
- Pin a supported Node line consistently across package engines, local setup, CI and hosting. Package engines currently allow Node 18, while installed Next requires >=20.9. CI uses Node 22; the audit shell was Node 26.7.
- Keep Payload packages version-aligned. Add automated dependency update PRs, security scanning and a deliberate upgrade smoke checklist for the experimental Lexical table feature.
- Add error reporting, uptime/route checks, failed-publish alerts and job visibility. Redact tokens, user information and file contents from logs.
- Classify canceled media requests separately from actual storage failures. Rapid browser navigation produced noisy R2 request-aborted logs during this audit; this alone does not establish an image availability incident.
- Document database and media backup/restore together, rollback compatibility and responsible maintainers. Restore to an isolated environment as a rehearsal.
- Verify security headers and CSP incrementally, accounting for Next/Payload scripts and editor assets. Add explicit upload size/format policy and review whether SVG/other active formats are needed. These are hardening proposals, not proof that every missing header is exploitable.

### SEO and sharing

- Canonical URL on each public route; page-specific title/description and appropriate OG text/image. The home browser check found no canonical or `og:url`.
- Event, organization and breadcrumb structured data with only verified fields. No invented address, time, price or event availability to satisfy a validator.
- Refresh sitemap and OG content on publish/unpublish/delete. Keep unpublished and private content out.
- Use stable production URLs; previews should not be indexed. Test production metadata independently of localhost behavior.
- Redirect old slugs when appropriate rather than silently abandoning inbound links.
- Add a real favicon and approved wordmark, plus a share action using native sharing with copy-link fallback.

### Proposed quality gates

| Gate | Target |
| --- | --- |
| Visitor journey | Verified club action reachable in two taps from the homepage; test with fresh users and measure the actual path |
| Signup accuracy | No “Sign up” state without a working destination; no ended event advertised as registerable |
| Publishing | Define and verify a publish-to-visible service target, initially 60 seconds, including cache warming and failure reporting |
| Accessibility | WCAG 2.2 AA review, keyboard-complete flows, usable zoom and reduced-motion support; project target 44px controls |
| Performance | At the 75th percentile: LCP <=2.5s, INP <=200ms, CLS <=0.1, with mobile and desktop tracked separately; these are goals, not measured results ([Web Vitals](https://web.dev/articles/vitals)) |
| Resilience | Missing database during regeneration cannot replace good content with an empty successful page; JS failure leaves content readable |
| Permissions | Public/member/editor/MC matrix proven through supported API surfaces, including file downloads and drafts |
| Maintainability | A new committee editor can publish a complete event using the guide without developer help |

## 7. README and documentation overhaul

The README is comprehensive but repeats architectural claims, mixes setup with technical essays, and contains facts that drift. Keep its useful diagrams and explanations in focused documents, then make the entry page quicker to use.

Proposed README order:

1. One-sentence purpose, live-site/admin links when verified, one strong desktop/mobile screenshot.
2. Short list of capabilities that actually ship, and the current status of member-only access.
3. Five-minute development path: supported Node/pnpm, isolated Neon branch, env file, install, run.
4. Safe commands table: check, build, unit tests, integration/E2E isolation, generate types, migrate. Put the seed reset warning beside the command.
5. Compact architecture diagram with accurate cache/regeneration language.
6. Editor/contributor/operations links and how to report a bug.

| Document | Contents |
| --- | --- |
| `docs/ARCHITECTURE.md` | Route groups, data flow, publication filters, cache dependency map, dynamic exceptions, media pipeline, preview model |
| `docs/EDITOR-GUIDE.md` | Illustrated create-event, upload-photo, preview/publish, update club, correct a mistake, contact support workflows |
| `docs/CONTENT-GUIDE.md` | Voice, field examples, photography/alt text, confirmed-vs-TBC information, consent/credits, contact owner and review date |
| `docs/ACCESS-CONTROL.md` | Role-by-operation matrix, draft visibility, file access, ownership transfers, invariants and matching test cases |
| `docs/LOCAL-DEVELOPMENT.md` | Neon isolation, env precedence, fixture modes, browser setup, supported versions and clean bootstrap |
| `docs/DEPLOYMENT.md` | Environment checklist, migrations, preview isolation, build validation, deploy order, metadata verification and rollback |
| `docs/RUNBOOK.md` | Failed publish, DB outage, broken images, account lockout, failed email, restore and escalation owners |
| `docs/HANDOVER.md` | Accounts/ownership inventory, annual transition, access review, club contacts and recurring tasks; no credentials |
| `docs/DESIGN-SYSTEM.md` | Tokens, type, spacing, components/states, club themes, accessibility and screenshot examples |
| `CONTRIBUTING.md` | Branch/PR process, scoped changes, tests, fixture isolation, migrations and review expectations |
| `SECURITY.md` | Private reporting route and supported versions once a real recipient is selected |
| Issue/PR templates | Repro URL/viewport, expected/actual behavior, visual evidence, validation and schema/content impact |

Specific corrections:

- Replace “visitors never trigger a database query” with the chosen precise cache contract.
- Replace “editors only see their own club” until enforced by read rules and UI filters.
- Stop claiming every tap target or contrast combination is validated when only a subset is tested.
- Fix the “only three client components” claim; navigation, signup and motion now add others.
- Either generate test/page counts or date them. Clarify that generated metadata images are included in the build total.
- Document SMTP and `SITE_URL` in production setup; align `.env.example` and README database variables.
- Describe public resource access and admin login separately.
- Remove stale roadmap items already shipped: carousel, motto, social row, date filters, event tabs, basic validation, OG/sitemap/robots and ICS download.
- Keep actual content provenance, but distinguish inferred signup windows from confirmed committee deadlines. A guessed window must not imply a real signup opportunity.
- Never tell maintainers that tests are non-destructive while they overwrite a real tagline.

## 8. Delivery sequence

Estimates assume one engineer familiar with the stack, timely committee review, and access to confirmed content. They are approximate engineering days; media curation, decisions and external account configuration can add elapsed time. Optional features are not prerequisites for the core release.

| Wave | Approximate size | Deliverable | Exit gate |
| --- | --- | --- | --- |
| **0: Trustworthy foundation** | 3–5 days | Dependency remediation; public/draft boundaries; media ownership; unlock rule; isolated tests; restore contaminated content from a verified source; honest missing-link states; fail-safe reads | Security matrix passes in an isolated DB; no misleading signup action; no content mutation by test suite |
| **1: Visible transformation** | 4–7 days | Shared UI primitives, new homepage order, navigation, club hero/sticky CTA, direct-action Join page, compact event fallbacks, menu/carousel/reveal fixes | Mobile joining journey works; keyboard and JS-failure checks pass; approved desktop/mobile screenshots |
| **2: Events people can use** | 4–7 days | Event detail refresh, URL filters/search, calendar agenda, lifecycle/date fixes, ICS corrections, full invalidation map | Time travel, multi-day dates, publish/unpublish/delete and old/new club ownership verified |
| **3: Editor confidence** | 6–10 days | Dashboard, content readiness, secure preview, event templates, scoped media usability, verified invitations/reset and handover basics | A club editor publishes a complete event and corrects it without developer intervention |
| **4: Content, operations and launch** | 4–6 days | Album navigation/lightbox, AY archive, metadata/structured data, monitoring, migration/restore runbooks, CI integration/E2E and README overhaul | Release checklist passes on production-like build; required content and ownership signed off |
| **5: Distinctive extras** | Separate backlog | Adventure finder, shortlist, subscriptions, recruitment campaigns, stories/search, reminders | Each feature has a clear user benefit, owner and measurement; dependencies already delivered |

Core scope is roughly **21–35 engineering days**, with several days potentially shared across overlapping tasks. Re-estimate after Wave 0 exposes any migration or permission complexity. A focused first release can stop after Waves 0–2 and already feel substantially better.

### Suggested PR-sized work packages

1. `security/public-content-boundaries`: S01–S03, S05 and isolated role fixtures.
2. `chore/patched-runtime`: S04, aligned engines and dependency checks.
3. `fix/test-isolation-and-data-failures`: B01/B06 and seed guards.
4. `fix/signup-and-calendar-semantics`: B02–B04/B07–B08 and URL validation.
5. `fix/publish-dependency-map`: B05/B10, media/people hooks and publish diagnostics.
6. `ui/navigation-and-accessibility`: U01–U05 and shared primitives.
7. `ui/home-clubs-join`: homepage, club discovery, sticky CTA, direct Join actions.
8. `ui/events-and-agenda`: event facts, URL filters, accessible mobile calendar.
9. `cms/dashboard-and-preview`: readiness, role-scoped dashboard and secure preview.
10. `cms/editor-workflows`: templates, media workflow, invitations and annual handover.
11. `feature/gallery-and-archives`: album routes/lightbox and committee archive.
12. `ops/launch-and-docs`: migrations/CI, monitoring, metadata and documentation.

These are proposed branches/work packages; none were created or pushed by this audit. Keep each PR reviewable and schema changes reversible where practical.

## 9. Content needed to make the design succeed

No redesign can fill an empty signup destination. Collect these in a simple per-club readiness sheet:

- Approved club logo and one representative hero crop for both phone and desktop.
- Next two or three **actionable** events: verified date/time status, venue or meeting instructions, cost, prerequisites, responsible contact, registration URL and deadline.
- Whether a student can attend before joining; how membership works; benefits/fees only when confirmed.
- Current committee/year/role ordering and approved contact visibility.
- A short beginner guide and accurate gear/cost information per club.
- A curated album with captions/credits and one approved participant story or quote.
- Confirmed production environment ownership, email sender, support route and access handover owner.

Suggested content ownership: each club owns its own facts and photographs; MC owns site-wide copy, membership explanation and recruitment campaigns; the technical maintainer owns publishing reliability and access controls. Confirm actual people before assigning recurring work.

## 10. First implementation brief

**Build a polished, mobile-first adventure discovery site on the existing stack. Start by fixing draft exposure, test contamination, false signup labels and cache correctness. Then redesign the homepage, club pages, Join and events around immediate actions and verified information. Upgrade the admin with role-specific tasks, secure preview and publication checks. Finish with CI isolation, operational runbooks, content curation and accurate documentation.**

Success should be visible in both halves of the system: a new student reaches a real next step quickly, and a new committee member can keep the site correct without needing its original developer.
