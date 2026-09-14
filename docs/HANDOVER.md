# Handover

For the outgoing committee handing this site to the next one. **No credentials in this
file, ever** — it is in the repository.

Placeholders in `[BRACKETS]` are unconfirmed. Fill them in during handover.

## Accounts and ownership

| Thing | Owner | Where |
| --- | --- | --- |
| GitHub repository | `@SMUXplorationCrew/tech-leads` | `.github/CODEOWNERS` |
| Vercel project | `[NAME]` | vercel.com |
| Neon project | `[NAME]` | `smux-web` (`rough-fog-59499752`) |
| Cloudflare R2 | `[NAME]` | bucket `smux-media` |
| Email sender | `[NAME]` | SMTP config in Vercel |
| Domain | `[NAME]` | `[REGISTRAR]` |

Handover means **adding the next lead to the team**, not editing a file. `CODEOWNERS`
points at a team for exactly this reason.

## Site sign-ins

Seven accounts: six club editors, one main committee.

| Account | Role | Scope |
| --- | --- | --- |
| `diving@sa.smu.edu.sg` | editor | Diving |
| `kayaking@sa.smu.edu.sg` | editor | Kayaking |
| `trekking@sa.smu.edu.sg` | editor | Trekking |
| `biking@sa.smu.edu.sg` | editor | Biking |
| `skating@sa.smu.edu.sg` | editor | Skating |
| `xseed@sa.smu.edu.sg` | editor | XSeed |
| `xplorationcrew@sa.smu.edu.sg` | mc | Everything, including users |

> **Status.** These exist on the isolated development clone only. They have **not** been
> provisioned on production, and **mailbox existence has never been verified**. Confirm
> each alias receives mail before relying on invitations.

To provision:

```bash
pnpm provision:accounts --out ~/smux-accounts.txt
```

Idempotent. Keeps existing passwords unless `--reset-password` is passed. Writes
credentials to a 0600 file outside the repo. Hand each line over privately, then delete
the file.

## The annual transition

Do it in this order.

1. **Before handover**
   - Confirm who takes each owner role above.
   - Add incoming tech leads to `@SMUXplorationCrew/tech-leads`.
   - Review who currently has access — every account, every role.
2. **Committee content**
   - Add next year's committee with the new `ay` value. Do not delete the outgoing one;
     People records carry an academic year and the archive depends on them.
   - Publish the new committee; the previous year moves to the archive.
3. **Accounts**
   - Create accounts for incoming editors, or reassign the existing club aliases.
   - **Deactivate** departing accounts — untick `active`. Do not delete them: deletion
     orphans the audit trail, and deactivation already blocks every API surface.
   - Rotate the MC password.
4. **Platform**
   - Transfer or re-invite on Vercel, Neon and Cloudflare.
   - Rotate `PAYLOAD_SECRET` if anyone leaving had access to it. This logs everyone out,
     which is the intent.
5. **Verify**
   - Each new editor signs in and edits their own club.
   - Each new editor confirms they **cannot** edit another club.
   - MC can reach everything.
   - One real invitation email arrives.

## Recurring work

| When | What | Owner |
| --- | --- | --- |
| Each term | Content review per club — see [CONTENT-GUIDE.md](CONTENT-GUIDE.md) | Club editors |
| Each term | Access review: who has an account, does it match reality | MC |
| Before recruitment | Every sign-up link resolves and accepts responses | Club editors |
| Before recruitment | Event dates, costs and venues confirmed | Club editors |
| Annually | Restore rehearsal into an isolated branch | Tech lead |
| Annually | Rotate credentials | Tech lead |
| Ongoing | Dependency updates | Tech lead |

## Club contacts

Only these are verified: `diving@sa.smu.edu.sg`, `t.me/smuxdiving`, `@smuxdiving`.

**Every other club contact in the content is a placeholder.** Confirming them is a
handover task, not a technical one.

## What the next tech lead should read

1. [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) — get it running.
2. [ARCHITECTURE.md](ARCHITECTURE.md) — how it works.
3. [ACCESS-CONTROL.md](ACCESS-CONTROL.md) — the part that must not be got wrong.
4. [RUNBOOK.md](RUNBOOK.md) — when it breaks.
5. [HANDOFF.md](HANDOFF.md) — what is unfinished right now.

## Known unfinished work

Do not assume the site is finished. [HANDOFF.md](HANDOFF.md) is the live list. As of the
last update: accounts are not provisioned live, no deployed preview has been verified,
slug redirects do not exist, analytics are not connected, and backup/restore has not been
rehearsed.
