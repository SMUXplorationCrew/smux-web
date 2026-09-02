# 🧭 SMUX — SMUXploration Crew

The public website and CMS for **SMUXploration Crew**, the outdoor and adventure CCA at
Singapore Management University. Six clubs, one crew: 🚴 Biking · 🤿 Diving · 🛶 Kayaking ·
🛼 Skating · 🥾 Trekking · 🏄 XSeed.

> **The job this site has to do:** during recruitment week, a freshman on a phone finds a
> club and reaches a sign-up link in **two taps**. Everything below serves that.

---

## ✨ What's in it

| | |
|---|---|
| 🏠 **Home** | Hero, the six clubs, what's coming up |
| 🧗 **Club pages** | Who they are, key events, sessions, how to join, committee, achievements, FAQ, past trips |
| 📅 **Events & calendar** | Every session and trip, filterable by club, on a month grid |
| 🖼️ **Gallery** | Photos from past trips, grouped by album |
| 👥 **Committee** | The main committee and the SMUX-wide events they run |
| 📄 **About / Join / Contact** | Editable in the CMS, no deploy needed |
| 🔒 **Resources** | Members-only area behind a login |
| ⚙️ **Admin** | Payload CMS at `/admin` — club editors manage only their own club |

---

## 🧱 Architecture

```
Browser
   │
   ▼
Next.js 16 (App Router) ─────────────┐
   │  every public page pre-rendered │
   │                                 │
   ├── /admin ──► Payload CMS 3 ─────┤
   │                                 │
   ├── /api/media/file/* ──► R2 ◄────┤  images, cached at the CDN edge
   │                                 │
   └── Postgres (Neon) ◄─────────────┘
```

**Payload runs inside the Next app** — one deployment, one codebase, no separate backend.

### Five rules the code follows

1. 🧊 **Every public page is pre-rendered.** No page queries the database at request time.
   Content changes call `revalidatePath()` from a Payload `afterChange` hook.
   `/resources` is the single deliberate exception — a cached members-only page would be
   served to whoever asked next.
2. 🔐 **Access control is a query, not a boolean.** A club editor's rows are filtered *in
   Postgres* (`src/access/`). Hiding UI is not access control.
3. 🏷️ **Alt text is required on every upload.** Enforced by the Media collection.
4. 🖼️ **Images resize on upload, never per request.** sharp writes 480/900/1800 WebP
   variants; the site serves those as plain `<img>`, not through an optimiser.
5. 📆 **Sign-up state is derived from dates**, never a stored status field, so nobody can
   forget to flip it. → `src/lib/signupState.ts`

### Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript strict |
| CMS | Payload 3 (same app, admin at `/admin`) |
| Database | Neon Postgres — **every** environment, never SQLite |
| Styling | Tailwind v4, themed from `@theme` in `globals.css` |
| Media | Cloudflare R2 via `@payloadcms/storage-s3` |
| Tooling | pnpm · Biome · Vitest · Playwright |
| Hosting | Vercel |

### Layout

```
src/
├── access/         access functions shared by every collection
├── app/(frontend)/ the public site
├── app/(payload)/  admin panel + API (generated)
├── collections/    Clubs, Events, Albums, People, Pages, Resources, Media, Users
├── globals/        SiteSettings
├── components/     UI; only 3 are client components
├── hooks/          revalidation on publish
├── lib/            signupState, date formatting, cached DB reads
└── seed/           real SMUX content + the photo library
```

**Club theming is runtime.** A club page sets `data-club="diving"` on its wrapper and
everything downstream reads `--accent`. No component hardcodes a club colour.

---

## 🚀 Local setup

**Prerequisites:** Node 20+, pnpm, and a Neon account.

```bash
git clone https://github.com/aryan12singh/smux-web.git
cd smux-web
pnpm install
```

### 1. Database

Each developer works on their own Neon branch, so nobody clobbers anyone else.

```bash
npm i -g neon@latest && neon login
neon link --project-id <PROJECT_ID> --branch <YOUR_BRANCH>
```

That writes `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) into `.env`.
Both are used, deliberately:

- **Local dev** uses the *direct* URL — Payload pushes schema changes, and Neon's pooler
  runs PgBouncer in transaction mode, which drops the session state DDL needs.
- **Production** uses the *pooled* URL — serverless functions open many short-lived
  connections and would otherwise exhaust Postgres' limit.

### 2. Environment

```bash
cp .env.example .env
openssl rand -hex 32        # → PAYLOAD_SECRET
```

| Variable | Needed | What it does |
|---|---|---|
| `PAYLOAD_SECRET` | ✅ | Signs sessions. Changing it logs everyone out |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | ✅ | Written by `neon link` |
| `R2_*` (five vars) | Optional | All five present → uploads go to R2; otherwise local disk |

### 3. Run it

```bash
pnpm dev     # http://localhost:3000 — Payload creates the schema on first boot
pnpm seed    # six clubs, 133 events, the photo library, three test logins
```

Then open **http://localhost:3000/admin**.

| Login | Password | Can do |
|---|---|---|
| `mc@smux.test` | `test1234` | Everything |
| `trekking@smux.test` | `test1234` | Trekking only — try opening a Diving event |
| `member@smux.test` | `test1234` | Read `/resources`, edit nothing |

> ⚠️ `pnpm seed` **deletes** all clubs, events, albums, people and pages before rewriting
> them. Point it at your own branch, never at shared data.

---

## ☁️ Cloud setup

### Cloudflare R2 (media)

1. Dashboard → **R2** → enable it (free tier: 10GB, no egress fees)
2. Create bucket `smux-media`
3. **Manage R2 API Tokens** → **Object Read & Write**, scoped to that bucket
4. Put the five `R2_*` values in `.env` and in Vercel

> Images are served through `/api/media/file/*` rather than R2's public `r2.dev` domain.
> `r2.dev` is documented as development-only and rate limits hard — around fifteen rapid
> requests — so a page pulling forty photos would fail at random. Those responses are
> marked `immutable`, so the CDN answers repeat views and the origin runs about once per
> file. A custom domain on R2 would lift the limit if one is ever added to the account.

### Vercel

Import the repo, then set: `PAYLOAD_SECRET`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`,
and the five `R2_*` variables. Build command and output are detected automatically.

Schema push is **disabled in production** — concurrent serverless invocations would race
each other. Apply schema changes from a developer machine, then deploy.

---

## 🧪 Checks

```bash
pnpm build   # must pass
pnpm lint    # Biome
pnpm test    # unit + integration + e2e
```

| Suite | Covers |
|---|---|
| `test:unit` | Sign-up state at all three date boundaries; access functions, including that a `member` never inherits an editor's club query |
| `test:int` | Real queries as real scoped users — proves Postgres honours the access filter |
| `test:e2e` | Every route at **390 / 768 / 1280px** for horizontal overflow, mobile nav, 44px tap targets |

Playwright pins one exact browser build; if it won't download, point at an installed one:

```bash
PLAYWRIGHT_CHROMIUM_PATH="/path/to/Chrome for Testing" pnpm test:e2e
```

**Check anything visual at 390px, not just desktop.**

---

## ✍️ Content notes

- Club copy, FAQs, sessions and socials come from the Vivace 2026 CCA listings.
- Events come from the committee's own `SMUX Calendar (2026).xlsx`, where each event's
  club is decoded from the **cell fill colour**. Internal governance — council meetings,
  AGM, exco retreats — is excluded.
- The calendar records dates but no times, so events carry `timeTbc` and render as
  "Fri 11 Sep" rather than an invented hour.
- Anything unconfirmed stays in `[SQUARE BRACKETS]` so it is greppable. **Never invent a
  price, venue or email.**
