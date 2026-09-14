# Runbook

What to do when something is wrong. Each section: how you know, what to check, what to do.

Placeholders in `[BRACKETS]` are facts nobody has confirmed yet. Fill them in — do not
guess at them.

| Role | Owner |
| --- | --- |
| Technical maintainer | `[NAME]` |
| MC content owner | `[NAME]` |
| Vercel account owner | `[NAME]` |
| Neon account owner | `[NAME]` |
| Cloudflare/R2 owner | `[NAME]` |
| Escalation | `[NAME / CHANNEL]` |

---

## An edit does not appear on the site

**How you know.** An editor published something and the public page still shows the old
version.

**Check.**
1. Is the document actually published, not saved as a draft? The admin shows its status.
2. Look at the `publish-jobs` collection. A row in `failed` state names the paths.
3. `/api/health`.

**Do.** A pending job retries on its own within bounded attempts. A failed one means the
revalidation did not reach the route — re-save the document to enqueue it again. If it
fails repeatedly, the path list in `src/hooks/revalidate.ts` is the place to look.

**Note.** `revalidatePath()` marks a route for regeneration on next visit; the queue is
what actually warms it. A CLI write has no request context for `revalidatePath` at all,
which is why the queue exists.

---

## The database is unreachable

**How you know.** `/api/health` fails; the admin will not load; pages render empty.

**Check.** Neon console for the branch's compute state. Neon scales to zero — a first
request after idle can be slow rather than broken.

**Do.**
1. Confirm the compute is not suspended or over quota.
2. Confirm `DATABASE_URL` in Vercel still matches the branch.
3. Do **not** trigger a rebuild while the database is down. `safely()` falls back to empty
   results, so a rebuild can replace good pages with successful empty ones. Wait for the
   database, then rebuild.

That fallback is deliberate for CI, where there are no credentials. It is a hazard in
production, and this is the situation where it bites.

---

## Images are broken

**How you know.** Alt text where photographs should be.

**Check.**
1. Does the object exist in the R2 bucket?
2. Are all four R2 variables set in Vercel? If any is missing the uploader falls back to
   local disk, and on serverless that means the file is gone.
3. Aborted requests are not failures. Rapid navigation produces "request aborted" noise in
   R2 logs; that alone is not an outage.

**Do.** Fix the configuration and re-upload. A database restore does **not** restore R2
objects.

---

## Someone is locked out

**How you know.** Repeated failed sign-ins. Accounts lock after 5 attempts for 10 minutes.

**Check.** Whether they are locked, deactivated (`active` unchecked), or simply have the
wrong password.

**Do.**
- Locked: wait it out, or an MC account unlocks them. Unlock is MC-only by design.
- Deactivated: that was deliberate. Confirm before re-enabling.
- Forgotten password: password reset needs working SMTP. If mail is not configured, an MC
  can issue a new password via `pnpm provision:accounts --reset-password` and hand it over
  privately.

---

## Email is not being delivered

**How you know.** Invitations or resets never arrive.

**Check.** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in Vercel. Without an adapter Payload
logs "No email adapter provided" and writes mail to the console.

**Do.** Set the variables and redeploy. Then send one real invitation to a mailbox you
control and confirm it arrives — configuration being present is not proof of delivery.

**Note.** The seven club aliases were user-specified. **Mailbox existence has never been
verified.** Confirm each one before relying on invitations.

---

## Restoring data

**Database.** Neon instant restore to a timestamp before the incident. Restore into a
**new branch first**, verify it, then repoint.

**Media.** R2 is separate and is not covered by a Neon restore.

**Rehearse this before you need it.** Restore to an isolated branch, point a local
checkout at it, confirm the site renders. Record the date you last did it: `[DATE]`.

---

## Content was overwritten by a test run

**How you know.** Real content replaced by something that reads like a fixture.

**Check.** `git log` on `src/seed/content.ts` for the verified original. Payload keeps
versions for clubs, events and pages — the previous value is in the document's version
history.

**Do.** Restore from the verified source, not from memory. Never invent replacement copy.

**Precedent.** `tests/int/access.int.spec.ts` once wrote `"Edited by the Trekking editor"`
onto the live Trekking club and never restored it. It is fixed, and both integration
files now restore anything they touch. If you add a test that writes to real content,
restore it in the test *and* in `afterAll`.

---

## A bad deploy

**Code.** Promote the previous Vercel deployment.

**Database.** Does not roll back with it. Read the migration's `down()` before running it
— that is where the `DROP` statements are. For data loss, Neon instant restore is usually
the better tool. If the new code runs against the old schema, roll back code only and fix
forward.

---

## Escalation

1. Technical maintainer.
2. If content is wrong in public, an MC can unpublish from `/admin` immediately —
   unpublishing does not need a developer.
3. If credentials are involved, rotate first and investigate second. `PAYLOAD_SECRET`
   rotation logs everyone out; that is acceptable in an incident.
