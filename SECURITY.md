# Security

## Reporting a vulnerability

**Do not open a public issue.**

Report privately to `[SECURITY CONTACT — TO BE CONFIRMED]`.

> This recipient has not been chosen yet. Until an MC or tech lead confirms a real
> address or a private reporting channel, contact a member of
> `@SMUXplorationCrew/tech-leads` directly. Filling this in is a handover task — see
> [docs/HANDOVER.md](docs/HANDOVER.md).

Please include what you found, how to reproduce it, and what an attacker could do with
it. We will confirm receipt, tell you what we find, and credit you if you want that.

This is a student society website with no bug bounty. It does hold real student contact
details and committee accounts, so reports are taken seriously.

## Supported versions

The deployed `main` branch. There are no maintained older releases.

## What is in scope

- Access-control bypass — reading or writing another club's content, reaching drafts or
  member-only resources without permission.
- Authentication problems — session handling, invitations, password reset, lockout.
- Exposure of user records, contact details or private files.
- Injection, SSRF through link checking, or unsafe file handling.

## What is not

- Missing security headers with no demonstrated impact.
- Findings from automated scanners without a working reproduction.
- Anything needing physical access to a committee member's device.
- Social engineering of committee members.

## Handling

If credentials may be exposed: **rotate first, investigate second.** Rotating
`PAYLOAD_SECRET` signs everyone out, which is acceptable in an incident. See
[docs/RUNBOOK.md](docs/RUNBOOK.md).

## Notes for contributors

Access control is enforced as database queries, not UI state. Anything that hides a
control without also filtering the query is not a fix. See
[docs/ACCESS-CONTROL.md](docs/ACCESS-CONTROL.md).

Never commit credentials. `.env` is git-ignored. The account provisioning script writes
passwords to a 0600 file outside the repository and refuses to write inside it.
