# Roadmap

The site is live with the full content model, real club copy, 133 events and 89 photos.
What follows is ordered by what actually stops it doing its job — getting a freshman from
a phone to a sign-up link in two taps — not by what is most interesting to build.

Effort is rough: **S** under a session, **M** a session or two, **L** longer.

**One ordering principle worth holding to.** Everything in the first section changes
whether the site *works*. Everything in the last changes how it *feels*. Doing the second
before the first produces a beautiful site that sends students to a dead link.

---

## Contents

- [Blocking a real launch](#blocking-a-real-launch)
- [What we need from you](#what-we-need-from-you)
- [Design alignment](#design-alignment)
- [CMS and editor experience](#cms-and-editor-experience)
- [Features worth adding](#features-worth-adding)
- [Engineering and pipeline](#engineering-and-pipeline)
- [Motion and polish](#motion-and-polish)

---

## Blocking a real launch

Not polish. Each one means the site is either wrong or unusable for the thing it was
built to do.

| Item | Effort | Detail |
| --- | :---: | --- |
| **Real sign-up links** | S | All 133 events point at `[SIGN-UP FORM TO BE LINKED]`. The entire premise is two taps to a sign-up; right now the second tap goes nowhere, so the site currently cannot do its one job. |
| **Event times, venues and costs** | M | All 133 events carry `[VENUE TBC]`, `[COST TBC]` and an unconfirmed time. The committee calendar recorded dates only. Nothing was invented to fill the gaps — which is why they are visibly bracketed rather than quietly wrong — but a student cannot act on "somewhere, sometime, for some price". |
| **Email adapter** | S | None configured; Payload warns on every boot. Password resets silently do nothing. The first editor who forgets their password is locked out with no self-service route, and it looks like a bug rather than missing config. |
| **Real accounts, real passwords** | S | Three demo accounts on `test1234`, hardcoded in a public repository's seed script. Fine for a demo, unacceptable the moment a real committee member has an account. |
| **Production database branch** | S | The live site reads the `dev` Neon branch — the same one `pnpm seed` wipes and rewrites. Anyone reseeding locally changes what visitors see. |

---

## What we need from you

Content and credentials, not code. Each blocks a specific piece of work.

| What | Format | Unblocks |
| --- | --- | --- |
| **Six club logos** | SVG preferred, or PNG with transparency, square-ish | Club cards as drawn in the mockup, club-scoped nav, favicon. The field exists and is empty for all six. |
| **Sign-up form URLs** | One per event, or the pattern you generate them with | The site's core purpose. Can be entered per event in the CMS. |
| **Event times and venues** | Per event, or per club's regular session | Removes `timeTbc` and makes events actionable. Regular weekly sessions could be defaulted per club. |
| **Main committee members** | Names, roles, photos | `/committee` shows your group photo and **0** people. Club committees are already in — 45 of them. |
| **Gear and cost copy per club** | A paragraph each | Currently one generic sentence shared by all six clubs. It is the section a nervous beginner reads first. |
| **Resources documents** | PDFs — safety briefs, packing lists, handovers | The members-only area works and is empty. The whole third role exists to read it. |
| **Email sending account** | Resend or SMTP credentials | Password resets, and later sign-up confirmations. |
| **Brand assets** | SMUX wordmark, any brand guidelines | The header currently sets "SMUX" as type. A real mark would replace it, plus favicon and social preview images. |

---

## Design alignment

Differences between the marketing wireframe and what is built. The site is a superset in
content, but diverges on several things that were drawn deliberately.

| Item | Priority | Effort | Detail |
| --- | :---: | :---: | --- |
| **Auto-scrolling photo carousel** | High | M | Drawn on both the home and club heroes; currently a single static image. The data model already supports it — `heroImages` is an array holding one entry. Needs the component, pause on hover, and reduced-motion handling. |
| **Club logos on club cards** | High | S | The mockup leads with a logo on every card; cards currently use hero photography. Blocked on assets, not code. |
| **"Fun / Family / Adventure" motto block** | Medium | S | Hand-lettered in the wireframe with an "Our Motto!" callout; currently a stats strip. Worth building as a typographic set piece — it is the only place the site gets to have a voice. |
| **Social icon row, with LinkedIn and TikTok** | Medium | S | "and more from our socials!" with five icons; currently text links in the footer. LinkedIn is already stored in site settings and never displayed. TikTok exists on Biking but has no site-level field. |
| **Side-by-side hero, alternating event layout** | Polish | M | The wireframe puts image and text side by side and alternates image sides down the club page. A real design decision rather than a gap — the current full-bleed hero is stronger on a phone. Worth deciding *with* marketing rather than silently matching or silently ignoring. |

---

## CMS and editor experience

Six clubs will each maintain their own page. Every rough edge here gets hit weekly, by
people who did not build the thing.

| Item | Priority | Effort | Detail |
| --- | :---: | :---: | --- |
| **Content validation before publish** | High | M | Refuse to publish an event still carrying `[BRACKETS]`, or missing a sign-up URL. This is the mechanism that fixes the placeholder problem *permanently* instead of once. |
| **Field validation that catches real mistakes** | High | S | `signupCloses` before `signupOpens`, `endsAt` before `startsAt`, `spotsTaken` above `capacity`. All three are currently accepted and produce a silently wrong sign-up state on the public site. |
| **Live preview** | Medium | M | Payload can render the real page beside the editor. Editors currently publish blind and check the live site — which on a pre-rendered site means waiting for revalidation to see a typo. |
| **Group the Events form** | Medium | S | Fourteen fields in one flat column. Tabs for When / Where / Sign-up / Content would make the common edit — changing a date — a two-second job. |
| **An editor's dashboard** | Medium | M | A landing view listing what needs attention: events missing details, media without alt text, drafts never published. Turns "is anything wrong?" from an audit into a glance. |
| **Brand the admin panel** | Polish | S | Logo, the orange accent, a real page title. Cheap, and makes the CMS feel like SMUX's rather than a stock install. |

---

## Features worth adding

| Item | Priority | Effort | Detail |
| --- | :---: | :---: | --- |
| **Social preview cards and SEO basics** | High | M | No `sitemap.xml`, no `robots.txt`, no Open Graph images. Every link shared to Telegram or Instagram currently renders as a bare URL with no image or description — which is exactly how this site will be distributed. Generated per club and per event, this is high leverage for the effort. |
| **Add to calendar** | Medium | S | An `.ics` download per event and a subscribable feed per club. Turns "I'll remember" into a calendar entry, built from data already modelled. |
| **Filter events by date** | Medium | S | This week, this month, next term. With 133 events the club chips alone leave a long list. |
| **Search** | Polish | M | Across events, clubs and pages. Worth it once there is more than one term of content — not before. |
| **Committee archive by academic year** | Polish | S | People already carry an `ay` field that nothing reads. Past committees become history rather than deletions, and handover stops meaning "overwrite last year". |

---

## Engineering and pipeline

| Item | Priority | Effort | Detail |
| --- | :---: | :---: | --- |
| **Integration and e2e in CI** | High | M | Both are excluded today because they need a live database. The access-control tests are the ones that prove a club editor cannot read another club's data — running them only on someone's laptop means the guarantee is unenforced. Neon can create a branch per pull request, which is exactly the shape this needs. |
| **Build-time content validation** | Medium | S | Fail the build if a club is missing a required field or an image has no alt text. From the original plan, and worth having as the backstop behind publish-time validation. |
| **Error and performance monitoring** | Medium | S | Nothing reports a production error today except a visitor noticing. Vercel Analytics is a one-line start; Sentry if you want stack traces. |
| **Housekeeping** | Polish | S | Drop the temporary `minimumReleaseAgeExclude` entries once those versions age out; retire the GraphQL playground in production; decide on Dependabot version updates as well as security ones. |

---

## Motion and polish

The reduced-motion guard is already in place, so anything here is opt-out by default.
Worth doing once the content is real — animating placeholder text is how a site ends up
feeling slower rather than better.

| Item | Priority | Effort | Detail |
| --- | :---: | :---: | --- |
| **Hero carousel motion** | Medium | S | Slow cross-fade, pause on hover and on focus. The one piece of motion the wireframe actually asks for. A cross-fade beats a slide here — it holds the headline still while the photograph changes. |
| **Section reveals on scroll** | Polish | S | Short, small-distance, once only. Must animate from a *visible* resting state, never from zero opacity waiting on an observer — otherwise a shared link previews as a blank page. |
| **Image loading refinement** | Polish | S | Blur-up placeholders and per-club accent tinting while loading. Ties the existing runtime club theming into the loading state instead of a flat grey block. |

---

Priorities assume recruitment week is the deadline that matters. If that changes, the
first section stays fixed and everything below it is negotiable.
