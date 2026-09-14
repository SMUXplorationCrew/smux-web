# Editor guide

For the person who keeps a club's page and events correct. No coding required.

You sign in at `/admin`. Your account can edit **your club only** — that is enforced by
the database, not by hiding buttons, so you will not accidentally change another club's
content.

## Before anything else

**Never invent a fact.** If you do not have the price, venue, or a contact yet, write it
in `[SQUARE BRACKETS]` — `[VENUE TBC]`, `[COST TBC]`. The site will not let you publish a
page containing brackets, which is the point: it keeps a guess from reaching a student
who is deciding whether to turn up.

If you are unsure whether something is confirmed, it is not confirmed.

## The admin, in four groups

| Group | What is in it |
| --- | --- |
| **Content** | Clubs, Events, Albums, People, Pages, Stories, Campaigns, Benefits |
| **Files** | Media (photos), Resources (member documents) |
| **Operations** | Registrations, invitations, publication jobs, link checks — mostly MC |
| **Settings** | Users — MC only |

`/manage` is a simpler workspace showing your club's events and what still needs
attention. Use it when you just want to get an event out.

## Publish an event

1. **Content → Events → Create new.**
2. **Title.** What a student would call it. The slug is generated; leave it alone unless
   you have a reason.
3. **Club.** Yours is filled in. If you pick another one it will be corrected back — you
   are not allowed to file events under other clubs.
4. **Schedule.** `startsAt` is required. All times are **Singapore time**.
   - Know the date but not the time? Tick **time TBC**. The event then shows as a date
     rather than a misleading clock time, and stays visible for its whole calendar day.
   - Multi-day trip? Set `endsAt` to the last day.
   - No `endsAt` on a timed event means it is treated as finishing that same day.
5. **Location** and **cost.** Real ones, or brackets.
6. **Capacity** if there is a cap.
7. **Sign-up.** This is the part students actually use:
   - `signupUrl` — the real form. It must be a full `https://` link.
   - `signupOpens` / `signupCloses` — the window.
   - **The button's state comes from these dates. There is no status field to set**, and
     there should not be — a manual one goes stale the moment nobody remembers to change
     it. Before `signupOpens` it reads "Opens 8 Sep"; between, "Sign up"; after
     `signupCloses` or at capacity, "Sign-ups closed".
   - No URL yet? Leave it empty. The site says details are coming rather than showing a
     button that goes nowhere.
8. **Cover photo.** See below.
9. **Description.**
10. **Save as draft** while you work. **Publish** when it is right.

Use **Preview** to see the real page before publishing.

## Add a photo

1. **Files → Media → upload.**
2. **Alt text is required.** Describe what is in the picture for someone who cannot see
   it: "Six people carrying kayaks down a beach at sunrise", not "photo1".
3. Sizes are generated on upload. Upload the good original; do not resize it first.
4. Set the focal point if the subject is off-centre, so crops keep them in frame.

Only use photographs you have permission to publish. Credit the photographer where it
was asked for. Do not post identifiable people who have not agreed to it.

## Update your club page

**Content → Clubs → your club.** Tagline, who we are, typical session, beginner notes,
gear and cost, socials.

The two fields that do the most work:

- **Beginner notes** — can someone turn up with no experience? Answer it plainly.
- **Gear and cost** — what must they bring, what do you lend, what does it cost.

These are the questions a first-year actually has, and a vague answer costs you sign-ups.

## Fix a mistake

Everything important keeps version history. Open the document, look at **Versions**, and
restore the one you want.

If something wrong is publicly visible right now and you are not sure how to fix it:
**unpublish it first**, then fix it calmly. Unpublishing does not need a developer.

## Why is my change not on the site?

Publishing refreshes the affected pages automatically — usually seconds.

If it has not appeared:

1. Is it actually **published**, or still a draft?
2. Give it a minute; the refresh is queued and retries.
3. Still nothing: tell the technical maintainer it is a publication job problem. That
   phrase will save them ten minutes.

## Sign-ups and capacity

`spotsTaken` and capacity drive the "Full" state. If you are using an external form,
these do not update themselves — you keep them current, or leave capacity empty.

## Getting help

Ask your MC first for anything about content or access. For something broken rather than
wrong, contact the technical maintainer — see [RUNBOOK.md](RUNBOOK.md).
