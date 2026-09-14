<h1 align="center">SMUX</h1>

<p align="center">
  <strong>SMUXploration Crew — the outdoor and adventure CCA at Singapore Management University</strong><br/>
  Six clubs &nbsp;·&nbsp; One site &nbsp;·&nbsp; Every club maintains its own page
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Biking-bc4757?style=for-the-badge&labelColor=bc4757" alt="Biking" />
  <img src="https://img.shields.io/badge/Diving-0086a4?style=for-the-badge&labelColor=0086a4" alt="Diving" />
  <img src="https://img.shields.io/badge/Kayaking-2d78bd?style=for-the-badge&labelColor=2d78bd" alt="Kayaking" />
  <img src="https://img.shields.io/badge/Skating-8160b5?style=for-the-badge&labelColor=8160b5" alt="Skating" />
  <img src="https://img.shields.io/badge/Trekking-2a904b?style=for-the-badge&labelColor=2a904b" alt="Trekking" />
  <img src="https://img.shields.io/badge/XSeed-9d7200?style=for-the-badge&labelColor=9d7200" alt="XSeed" />
</p>

<p align="center">
  <a href="https://github.com/SMUXplorationCrew/smux-web/actions/workflows/ci.yml"><img src="https://github.com/SMUXplorationCrew/smux-web/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Payload-3_CMS-000000?style=flat-square&logo=payloadcms&logoColor=white" alt="Payload 3" />
  <img src="https://img.shields.io/badge/Neon-Postgres-00E599?style=flat-square&logo=postgresql&logoColor=white" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
</p>

**The public website and the CMS that runs it, in one deployment.** Six club committees
maintain their own pages without touching code.

> [!NOTE]
> **The job this site has to do:** during recruitment week, a freshman on a phone finds a
> club and reaches a sign-up link in two taps. Every decision here serves that.

> [!IMPORTANT]
> **`feat/smux-elite-upgrade` is work in progress and not release-verified.** Accounts are
> not provisioned on production and no deployed preview has been checked. Read
> [docs/HANDOFF.md](docs/HANDOFF.md) before running or deploying it.

Live site and admin: `[URL TO BE CONFIRMED]` · `[URL]/admin`

---

## What ships today

- **Six club pages** with runtime theming — one wrapper attribute themes a whole page.
- **Events** with search, filters, a mobile agenda, calendar feeds and per-event ICS.
- **Sign-up state derived from dates**, so a button never advertises a window that closed.
- **A CMS for non-developers** — drafts, versions, live preview, and a `/manage`
  workspace that says what still needs attention.
- **Club-scoped editing** enforced as database queries, not hidden buttons.
- **Member-only `/resources`**, behind a public sign-in separate from the admin panel.
- Gallery albums, committee archive, stories, recruitment campaigns and member benefits.

Native event registration, waitlists and check-in exist in source but are **not
release-verified**. See [docs/HANDOFF.md](docs/HANDOFF.md).

## Five minutes to running

Node 22, pnpm, and your own Neon branch. Never npm or yarn, and never SQLite — dev/prod
parity is deliberate.

```bash
nvm use                              # reads .nvmrc
pnpm install

neon branches create --name dev-<yourname>
neon link                            # writes DATABASE_URL into .env

cp .env.example .env                 # then set PAYLOAD_SECRET
                                     # openssl rand -hex 32

pnpm dev                             # http://localhost:3100, admin at /admin
```

Full detail, including what each database URL is for:
[docs/LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md).

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server on :3100 |
| `pnpm check` | Typecheck, lint and unit tests — the quick gate |
| `pnpm build` | Production build. Must pass before you say done |
| `pnpm test:unit` | Pure functions. No database. Runs in CI |
| `pnpm test:int` | Real scoped queries. **Needs a database — use your own branch** |
| `pnpm test:e2e` | Playwright. Needs a browser and a running server |
| `pnpm generate:types` | Regenerate `payload-types.ts` after a schema change |
| `pnpm payload migrate` | Apply pending migrations |
| `pnpm provision:accounts --out <path>` | Create the seven sign-ins. Writes passwords to a 0600 file outside the repo |
| `pnpm seed` | **Destructive.** Clears the collections it owns, then reseeds. Your own branch only |

## How it works

```
Neon Postgres ──┐
                ├── Payload 3 ──┬── /admin            the CMS
Cloudflare R2 ──┘               ├── /api/[...slug]    REST + GraphQL
                                └── Local API ────── (frontend) public pages
```

**Public content pages are pre-rendered.** They are served from cache; a visitor's request
does not run a content query. Publishing does not rebuild the site — a Payload
`afterChange` hook marks the affected routes for regeneration and a durable job queue
warms them, with bounded retries.

Some routes are dynamic on purpose: authenticated ones (`/account`, `/manage`,
`/resources`, `/preview`), the API routes, and the ICS feeds. That is the contract —
public content is pre-rendered, private and per-request work is not.

The last build produced **448 outputs** (2026-09-14). That counts generated metadata and
OG images, not 448 distinct content pages.

More: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## The rules that are not up for debate

1. **Every public page is pre-rendered.** Don't add `force-dynamic` or a client-side fetch
   to solve a caching problem.
2. **Access control is a query, not a boolean.** Hiding UI is not access control.
3. **Alt text is required on every upload.**
4. **Images resize on upload**, never at request time.
5. **Sign-up state derives from dates**, never a manual status field.

## Documentation

| For | Read |
| --- | --- |
| Keeping a club page correct | [docs/EDITOR-GUIDE.md](docs/EDITOR-GUIDE.md) |
| What to write, and what must be verified first | [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) |
| Setting up to develop | [docs/LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md) |
| How the system fits together | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Roles, and the rules behind them | [docs/ACCESS-CONTROL.md](docs/ACCESS-CONTROL.md) |
| Tokens, type, club theming | [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) |
| Shipping it | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| When it breaks | [docs/RUNBOOK.md](docs/RUNBOOK.md) |
| Passing it to next year's committee | [docs/HANDOVER.md](docs/HANDOVER.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
| What is still unfinished | [docs/HANDOFF.md](docs/HANDOFF.md) |

## Status

Verified on 2026-09-14, on the upgrade branch: typecheck clean · Biome 0 errors, 0
warnings · **105 unit** · **55 integration** · **11 end-to-end** · production build
passes with 448 outputs.

The e2e suite covers no horizontal overflow at 390/768/1280px and 44px tap targets on
the mobile menu. A full accessibility audit and a cross-device visual review have **not**
been done, and contrast is encoded as tokens rather than validated across every rendered
state.

> Running e2e needs a complete Chromium. The installed `chromium-1208` has no Frameworks
> directory and aborts on launch; point `PLAYWRIGHT_CHROMIUM_PATH` at a working build.

## Reporting a problem

Open an issue with the URL, the viewport width, and what you expected. A screenshot at
390px is worth several paragraphs.

**Security issues: do not open a public issue.** See [SECURITY.md](SECURITY.md).

## Content provenance

- Club copy, FAQs, sessions, socials and achievements come from the Vivace 2026 CCA
  listings.
- Events come from the committee's own `SMUX Calendar (2026).xlsx`, where each event's
  club is decoded from the **cell fill colour** matched against the sheet's legend.
  Internal governance — council meetings, the AGM, exco retreats — is excluded.
- The calendar records dates but no times, so events carry `timeTbc` and render as
  "Fri 11 Sep" rather than an invented hour.
- Sign-up windows are the one **derived** field, by a single stated rule: open three weeks
  ahead, close two days before. **These are inferred, not committee deadlines** — an
  inferred window must not be read as a confirmed opportunity.
- Anything unconfirmed stays in `[SQUARE BRACKETS]` so it is greppable. **Never invent a
  price, venue or email.**
- Only `diving@sa.smu.edu.sg`, `t.me/smuxdiving` and `@smuxdiving` are verified real.
  Every other club contact is a placeholder.

---

<div align="center">

**SMUXploration Crew** &nbsp;·&nbsp; Singapore Management University

<sub>Six clubs, one crew. Issues and pull requests welcome at
<a href="https://github.com/SMUXplorationCrew/smux-web">SMUXplorationCrew/smux-web</a>.</sub>

</div>
