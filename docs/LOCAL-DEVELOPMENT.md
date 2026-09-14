# Local development

## Supported versions

**Node 22.** Declared in `.nvmrc` and in `package.json` engines (`>=22.0.0 <23`). pnpm is
pinned by the `packageManager` field — CI and Vercel both read it, so do not also pass a
version to the setup action.

Use pnpm. Never npm or yarn.

```bash
nvm use          # reads .nvmrc
pnpm install
```

Newer Node mostly works and prints an engine warning. CI runs 22; if something behaves
differently for you, check your version before anything else.

## The database

**Neon Postgres in every environment. Never SQLite, not even locally.** Dev/prod parity
is deliberate: this project is Postgres-specific in its access queries and migrations,
and a local SQLite would hide exactly the failures that matter.

Each developer works on **their own Neon branch**, created from `dev`. Branches are cheap
and instant; sharing one means your test run edits someone else's content.

```bash
neon branches create --name dev-<yourname>
neon link          # writes DATABASE_URL / DATABASE_URL_UNPOOLED into .env
```

Name it `dev-*` or `test-*`. `validateEnvironment()` refuses `SMUX_ALLOW_SCHEMA_PUSH` on
any other branch name, which is what stops a schema push reaching shared data.

### Why three database variables

| Variable | Connection | Used for |
| --- | --- | --- |
| `DATABASE_URL` | Pooled (PgBouncer) | Serverless runtime |
| `DATABASE_URL_UNPOOLED` | Direct | Local work needing session state the pooler drops |
| `DATABASE_URI` | — | Legacy name; takes precedence where present |

## Environment file

Copy `.env.example` to `.env` and fill it in. It is git-ignored.

Required everywhere:

- `PAYLOAD_SECRET` — signs login sessions; changing it logs everyone out.
  Generate with `openssl rand -hex 32`.
- A database URL.

Required only when deployed (`VERCEL=1` or `SMUX_ENVIRONMENT=production`):
`R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `SITE_URL`,
`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`.

Locally, without R2 the uploader falls back to local disk under `/media` (git-ignored),
and without SMTP Payload logs mail to the console instead of sending it. Both are fine
for development and both fail the boot in production.

Useful locally:

| Variable | Effect |
| --- | --- |
| `SMUX_ENVIRONMENT` | `development` keeps the deployed-only requirements off |
| `SMUX_ALLOW_SCHEMA_PUSH` | `true` permits schema push, only on a `dev-`/`test-` branch |
| `NEON_BRANCH` | Branch name; the guard above reads it |
| `SITE_URL` | `http://localhost:3100` locally |

## Running

```bash
pnpm dev        # http://localhost:3100, admin at /admin
pnpm devsafe    # same, after clearing .next
```

## Migrations

Schema changes are committed migrations, not a push from someone's laptop.

```bash
pnpm payload migrate:create <name>   # generate from collection changes
pnpm payload migrate                 # apply pending
pnpm payload migrate:status          # what is applied
pnpm generate:types                  # regenerate payload-types.ts
```

Read the generated SQL before applying it. Check specifically for `DROP`, `TRUNCATE`,
`DELETE`, `ALTER COLUMN`, and `NOT NULL` columns added without a default — any of those
against a branch with real data needs thought.

Regenerate `payload-types.ts` after schema changes or TypeScript will describe the old
shape.

## Seeding

```bash
pnpm seed
```

> **This clears the collections it owns before inserting.** It is destructive. Run it
> only against your own branch. Verify `DATABASE_URL` first — the host is printed by
> `pnpm provision:accounts`, and you can check with
> `node -e "console.log(new URL(process.env.DATABASE_URL).host)"`.

Content comes from SMUX's real material: club copy from the Vivace 2026 listings, events
from the committee's SMUX Calendar (2026).xlsx. Facts the sources did not state stay in
`[BRACKETS]`.

## Accounts

```bash
pnpm provision:accounts --out ~/smux-accounts.txt
```

Creates the six club editors and the MC account. Idempotent: re-running fixes a wrong
role or club without touching existing passwords. Pass `--reset-password` to deliberately
issue new ones.

Passwords are written to the file you name, mode 0600, never to stdout and never inside
the repo. Hand each line over privately and delete the file.

## Tests

```bash
pnpm test:unit   # pure functions, no database
pnpm test:int    # real scoped queries against your branch
pnpm test:e2e    # Playwright, needs a browser and a running server
pnpm test        # all three
pnpm check       # tsc + lint + unit — the quick gate
```

`test:unit` is what CI runs on every push. `test:int` needs a database and writes
fixtures; both integration files clean up after themselves and restore anything they
touch, but **point them at your own branch, never shared data**.

## Verify before saying done

`pnpm build` must pass, then `pnpm lint` and `pnpm test`. For anything visual, check it
at 390px wide, not just desktop.

## Troubleshooting

**"Missing configuration: …"** — `validateEnvironment()` at config load. The message names
the variables.

**"Schema push is permitted only on explicitly named dev-/test- branches."** — rename the
branch or unset `SMUX_ALLOW_SCHEMA_PUSH`.

**Admin components missing after adding one** — run `pnpm generate:importmap`, or just
`pnpm build`, and commit the result.

**Types disagree with the database** — `pnpm generate:types`.

**Uploads vanish between restarts** — R2 is not fully configured and it fell back to local
disk. All five R2 variables must be present.
