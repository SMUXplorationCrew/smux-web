# Architecture

How a request becomes a page, and where the data comes from. If you are setting the
project up for the first time, read [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) first.

## The shape of it

One Next.js 16 App Router application. Payload CMS 3 runs inside the same app rather
than as a separate service, so the admin panel, the REST/GraphQL APIs and the public
site are one deployment, one database connection and one type system.

```
Neon Postgres ──┐
                ├── Payload 3 ──┬── /admin            the CMS
Cloudflare R2 ──┘               ├── /api/[...slug]    REST + GraphQL
                                └── Local API ────── (frontend) public pages
```

Two route groups under `src/app`:

| Group | What lives there |
| --- | --- |
| `(frontend)` | Every public page, the member area, `/manage`, and the project's own API routes |
| `(payload)` | Payload's admin panel and its generated API handlers. Largely untouched |

## Rendering

**Every public content page is pre-rendered.** This is the reliability guarantee, not an
optimisation: during recruitment week the site has to serve a freshman on a phone even
if the database is having a bad afternoon.

The current build produces 448 outputs. Static (`○`) and SSG (`●`) cover all public
content. The dynamic (`ƒ`) routes are the deliberate exceptions:

| Dynamic route | Why it cannot be static |
| --- | --- |
| `/account`, `/manage`, `/resources` | Per-user content behind authentication |
| `/preview/[collection]/[id]` | Renders drafts for a signed-in editor |
| `/login`, `/invite` handlers, `/api/*` | Actions and per-request work |
| `/calendar/feed`, `/events/[slug]/calendar` | ICS responses with per-request headers |
| `/events/return` | Post-signup return handling |

`/benefits` carries `export const revalidate = 300`. It is the only page on a timer and
it is also in the publication path list, so the timer is redundant with hook-driven
revalidation. Left as-is deliberately — see [the note in HANDOFF.md](HANDOFF.md).

Do not reach for `force-dynamic` or a client-side fetch to solve a caching problem.
That trades the guarantee above for a quick fix.

## Reading data

All public reads go through `src/lib/payload.ts`. The important part is `publicDocuments`:

```ts
const published = { _status: { equals: 'published' } }
// …
overrideAccess: false,
```

Both halves matter and neither is the default:

- **`overrideAccess: false`.** Payload's Local API *bypasses access control by default*.
  Without this, every collection's access rules are simply not consulted on the public
  site.
- **An explicit `_status` filter.** `draft: false` selects ordinary documents; it is not
  an automatic published-only rule. A never-published document would otherwise be
  eligible for public pages, static params, the sitemap and calendar exports.

Every getter is wrapped in React `cache()`, which deduplicates within a single render
pass. That is request memoisation, not persistent caching — the two are easy to confuse.

## Publishing

Content changes invalidate pages through a Payload `afterChange` hook, not a rebuild.

`src/hooks/revalidate.ts` owns this. `publicationPaths()` returns the full set of pages
a change can affect, computed from **both** the new document and the previous one — an
event moved between clubs has to refresh both clubs, and a delete has to refresh the
page that used to list it.

The base set is deliberately broad for a six-club site:

```
/  /clubs  /events  /calendar  /gallery  /committee  /search
/explore  /join  /recruitment  /benefits  /sitemap.xml
```

plus the specific document route for events, clubs, stories, campaigns, pages and albums.

Correctness is chosen over a minimal list here. Maintaining an exact consumer map for a
site this size costs more than it saves, and an incomplete map fails silently.

`revalidatePath()` marks a route for regeneration on its next visit; it does not itself
compute fresh HTML. To keep the stricter promise that a visitor never triggers the work,
a `publish-jobs` row is written alongside and a queue warms the affected routes with
bounded retries. A CLI write (a seed, a script) has no request context for
`revalidatePath`, which is why the queue is the durable half.

## Media

Uploads go to Cloudflare R2 through `@payloadcms/storage-s3`. sharp generates WebP
variants **at upload time**, and the site serves those plain static files. Nothing is
resized per request.

Alt text is required by the Media collection. This is enforced in the schema, not by
asking nicely.

If the five R2 variables are not all present the adapter silently falls back to local
disk, which on a serverless host means uploads vanish between invocations.
`validateEnvironment()` fails the boot instead when the app is deployed.

## Configuration

`src/lib/environment.ts` runs at config load. It requires `PAYLOAD_SECRET` and a database
URL everywhere, and additionally — only when `VERCEL=1` or `SMUX_ENVIRONMENT=production` —
R2, `SITE_URL` and SMTP. It also enforces:

- `PAYLOAD_SECRET` of at least 32 characters when deployed
- a canonical HTTPS `SITE_URL` when deployed, rejecting localhost
- `SMUX_ALLOW_SCHEMA_PUSH=true` only on a Neon branch named `dev-*` or `test-*`

Three database variables exist because they do different jobs. `DATABASE_URL` is pooled
(PgBouncer) for serverless runtime; `DATABASE_URL_UNPOOLED` is a direct connection for
local work that needs session state the pooler drops. `DATABASE_URI` is the legacy name
and takes precedence in `.env.example`.

## Content model

Eight authored collections — `clubs`, `events`, `albums`, `people`, `pages`, `resources`,
`media`, `users` — plus the `site-settings` global.

`src/collections/Operations.ts` adds the operational ones: `stories`, `campaigns`,
`benefits`, and the private system collections `registrations`, `interests`, `audit-log`,
`publish-jobs`, `metrics`, `invitations`, `contact-requests`, `link-checks`.

`src/collections/enhance.ts` applies cross-cutting behaviour — list filters scoped to an
editor's club, live preview, revalidation hooks, and the `active` / `requiresReview`
fields on users — rather than repeating it in every collection file.

## Client boundary

Server components by default. The client components are the ones that genuinely need a
browser: filter chips, the calendar, the mobile nav, the signup control (it recomputes
date-derived state against the viewer's clock, because a static page freezes it at build
time), and the admin workspace.

## Types

`src/payload-types.ts` is generated by `pnpm generate:types`. Regenerate it after any
collection or field change, or TypeScript will be describing the old schema.
