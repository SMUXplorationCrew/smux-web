# Deployment

Host: Vercel. Database: Neon. Media: Cloudflare R2.

## Environments

| Environment | Neon branch | Notes |
| --- | --- | --- |
| Production | `production` | The live site |
| Preview | its own branch | Never point a preview at production data |
| Local | `dev-<name>` per developer | See [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) |

Keep them separate. A preview deployment that writes to production is a content incident,
not a bug.

## Environment variables

Anything in `.env` that the deployed site also needs must be set in Vercel. The boot check
in `src/lib/environment.ts` fails the deployment rather than starting degraded.

Required in production:

| Variable | Why |
| --- | --- |
| `PAYLOAD_SECRET` | Signs sessions. **Minimum 32 characters** when deployed. Rotating it logs everyone out |
| `DATABASE_URL` | Pooled connection for serverless runtime |
| `DATABASE_URL_UNPOOLED` | Direct connection |
| `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` | All four, or uploads silently fall back to local disk and vanish between invocations |
| `SITE_URL` | Canonical HTTPS origin. Rejected if it is not `https://` or contains `localhost` |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Invitations and password resets. Without them mail is logged, not sent |

Optional: `SMTP_FROM`, `SMTP_PORT`, `SMUX_EMAIL_DELIVERY`, `CRON_SECRET` (guards the
maintenance endpoint), `R2_REGION`.

`SMUX_ALLOW_SCHEMA_PUSH` must never be `true` in production. The guard already restricts
it to `dev-*`/`test-*` branch names; do not work around it.

## Deploy order

Schema first, then code. A deployment whose code expects a column the database does not
have will fail at request time, not at build time.

1. **Review the migration.** Read the generated SQL. Look for `DROP`, `TRUNCATE`,
   `DELETE`, `ALTER COLUMN`, and `NOT NULL` columns added without a default.
2. **Rehearse it.** Apply to a Neon branch cloned from production and run the suite
   against it. Neon branches are instant; there is no excuse for skipping this.
3. **Snapshot production.** Neon's instant restore covers you, but take a deliberate
   snapshot before a destructive migration.
4. **Apply to production.**
   ```bash
   DATABASE_URL=<production> pnpm payload migrate
   ```
   Confirm with `pnpm payload migrate:status`.
5. **Deploy the code.**
6. **Verify.** Below.

## Verify after deploying

- `/api/health` returns healthy.
- The homepage, one club page and one event page render with real content.
- Sign in at `/admin` as MC, and as one club editor.
- An edit publishes and appears on the public page.
- An upload lands in R2 — check the bucket, not just the preview.
- `/sitemap.xml` and `/robots.txt` are correct and reference the canonical origin.
- OG images resolve for a club and an event.
- Check one page at 390px.

## Rollback

Code rolls back by promoting the previous Vercel deployment.

**The database does not roll back with it.** Assess separately:

- Migrations have a `down()`. Read it before running it — `down()` is where the `DROP`
  statements live, and it will remove columns with data in them.
- For data loss rather than schema trouble, Neon instant restore to a timestamp before
  the incident is usually the better instrument.
- If the new code can run against the old schema, roll back code only and fix forward.

Never run `down()` against production to undo a deploy without first checking what it
drops.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request: typecheck,
lint, unit tests, build. Node 22.

The build runs without database credentials — the data helpers fall back to empty results
when Postgres is unreachable, so every route compiles. A real secret would only change
page contents, not whether it builds.

Integration and E2E are deliberately not in that workflow: both need a live database, and
E2E additionally needs a browser and a running server. They belong in a workflow that
creates a throwaway Neon branch. Until that exists, run them locally.

## Publishing and cache

Content changes invalidate pages through a Payload `afterChange` hook and a durable
`publish-jobs` queue with bounded retries. See [ARCHITECTURE.md](ARCHITECTURE.md).

If an edit does not appear: check `publish-jobs` for a failed row before assuming a cache
bug.

## Backups

Neon retains history for point-in-time restore. R2 holds media separately — **a database
restore does not restore media**, and a media object deleted from R2 is not recoverable
from a Neon snapshot.

Rehearse a restore into an isolated branch rather than assuming it works. Record who owns
this. See [RUNBOOK.md](RUNBOOK.md).

## Not yet done

Honest gaps, so nobody assumes otherwise:

- No deployed preview of the upgrade branch has been verified.
- Analytics are not connected.
- Backup/restore has not been rehearsed.
- Uptime monitoring and failed-publish alerting are not configured.
