# Design system

Tokens live in `src/app/(frontend)/globals.css` under `@theme`. Use them. If a value is
missing, add a token — do not write `text-[17.5px]` in a component.

## Type

Two faces, and no more. Saira Condensed is the display face: headings, buttons and chips,
uppercase with tight leading. Barlow is the body face.

| Token | Size | Used for |
| --- | --- | --- |
| `--text-eyebrow` | 12px | Uppercase labels |
| `--text-meta` | 15px | Captions, card blurbs |
| `--text-body` | 17.5px | Running copy |
| `--text-lead` | 19px | Hero subcopy |
| `--text-card` | 25px | Card headings |
| `--text-section` | 50px | Section headings |
| `--text-hero` / `--text-hero-sm` | 82px / 46px | Desktop / mobile hero |

Tracking: `--tracking-eyebrow` (0.22em), `--tracking-button` (0.09em),
`--tracking-tight` (-0.01em).

**Nothing renders below 11px. Tap targets are at least 44px.** The 44px figure is the
project's own target; WCAG 2.2 AA sets a 24px minimum with exceptions. Where a control
is visually small — carousel dots are 6×6px — the *hit area* still has to reach 44px.

## Colour

| Token | Value | Notes |
| --- | --- | --- |
| `--color-ink` | `#231f20` | Logo black |
| `--color-ink-deep` | `#161312` | Dark section grounds |
| `--color-copy` | `#55504d` | Long-form copy |
| `--color-muted` | `#77706c` | Secondary text — do not go lighter |
| `--color-line` | `#e1ddda` | Rules and borders |
| `--color-off` | `#f7f5f3` | Quiet ground |
| `--color-paper` | `#ffffff` | |
| `--color-orange` | `#f4751f` | Logo orange — CTAs, date badges |
| `--color-orange-lift` | `#ff9138` | Accent text on dark grounds |

`--color-copy` is named "copy" rather than "body" on purpose: `--text-body` already
claims the `text-body` utility, and a `--color-body` would silently shadow it.

### Contrast, and the one token that matters

**Brand orange fails for small text at 2.83:1. `--color-orange-text` (`#cd5811`) is
4.20:1 and also fails.** Neither clears 4.5:1.

For anything under roughly 19px, use **`--color-accent-text`**. It is the accent darkened
to clear 4.5:1 on both white and off-white, and it follows `data-club`, so it themes
correctly on a club page. Four of the six club accents also fail as small text, which is
why this is a token and not a per-case judgement.

Large type and rules can use `--color-accent`.

## Club theming

Six club accents, each with a tint:

| Club | Accent | Tint |
| --- | --- | --- |
| Diving | `#0086a4` | `#e4f5fa` |
| Kayaking | `#2d78bd` | `#e6f1fc` |
| Trekking | `#2a904b` | `#e5f4e9` |
| Biking | `#bc4757` | `#fbe9ec` |
| Skating | `#8160b5` | `#f0eaf9` |
| XSeed | `#9d7200` | `#f8f0da` |

Theming is runtime. A club page sets `data-club="diving"` on its wrapper, which overrides
`--color-accent`, `--color-accent-tint` and `--color-accent-text` for that subtree.

**Components use `accent` / `accent-tint` / `accent-text` and never a club colour
directly.** One wrapper attribute themes a whole page.

### The indirection that does not work

Do not reintroduce `--color-accent: var(--accent, …)`.

A custom property resolves on the element that declares it. Declaring that at `:root` —
where `--accent` is never set — computes to orange *there*, and every descendant inherits
the already-computed value. Setting `--accent` further down the tree cannot change it.
The mechanism was inert for all six clubs.

Overriding `--color-accent` itself, on the element carrying `data-club`, is what actually
re-resolves it for the subtree.

## Layout

Prefer CSS grid and flex with `gap` over margins. Check every change at 390px, not just
desktop. Tables, diagrams and code blocks may exceed the column inside their own
`overflow-x: auto` container; the page body must never scroll horizontally.

## Motion

Motion should aid orientation: short entrances, understated feedback. Content and
controls stay available without it.

`@media (prefers-reduced-motion: reduce)` collapses every animation and transition to
0.01ms. This is the one correct use of `!important` in the stylesheet — the reset has to
beat animations declared later or more specifically. It carries an explanatory
`biome-ignore`.

Reveal animations must be visible-by-default and opt in only once the observer can
actually reveal them. With JS blocked, content that starts at `opacity: 0` never appears.

## Images

Variants are generated at upload time; the site serves plain static files from R2. Never
resize at request time. Honour focal points when cropping with `object-cover`, and
reserve dimensions so layout does not shift.

The only `<img>` in the codebase is the check-in QR — a per-request private token that
must not pass through the image optimizer or its CDN cache. It carries an explanatory
`biome-ignore`.

## Rich text

Editors get h2–h4, the usual inline formatting, tables, and a fixed style menu defined in
`src/lib/richTextStates.ts`.

**That file is the single source for both ends.** Payload applies it in the editor;
`src/components/richTextConverters.tsx` applies it when rendering. Add a style to one
without the other and editors get formatting that vanishes on the site.

Two invariants, both asserted in `tests/unit/richTextStates.unit.spec.ts`:

- No fixed `px` font sizes — use `rem` or `clamp()`, or it breaks at 390px.
- No `width`, `position`, `float`, `margin` or `display` — styled text must not escape
  its column.

Do not use Payload's default JSX converters. They write `node.fields.url` straight into
an href with no validation, render uploads at full size outside the variant pipeline, and
throw on an upload with no mimeType.

## Placeholders

Facts we do not have yet stay in `[SQUARE BRACKETS]` so they are greppable. Never invent
a price, venue or email. Publishing a document containing a placeholder is blocked by
`noPlaceholderWhenPublished`.
