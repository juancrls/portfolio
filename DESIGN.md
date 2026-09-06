# DESIGN.md — Juan Costa portfolio

Recorded after the build, from the shipped code. Every token and rule below is
implemented in `src/app/globals.css` or in the components named. Nothing here is
aspirational; if the code does not do it, it is not in this file.

Source of truth for tokens: `src/app/globals.css`.
Machine-readable mirror: `DESIGN.tokens.json`.

World: an engineer's worktable. Bone ground, sage-tinted panels, one electric
lime on the thing you should touch, large-radius layered surfaces, oversized
light numerals. Not a dark terminal, not a grid of equal cards.

---

## 1. Colour

All colour is declared once as CSS custom properties on `:root` and re-exported
into Tailwind through `@theme inline`. Use the Tailwind alias in components
(`bg-sage`, `text-faint`); use `var(--token)` only where Tailwind has no alias
(`--lime-edge`, `--rule-firm` in SVG, inline `boxShadow`).

### Grounds

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| `--bone` | `#f4f2ea` | `bg-bone` | The page. `html` and `body` background. Nothing else is the page. |
| `--bone-deep` | `#ebe8dd` | `bg-bone-deep` | Inset and hover ground for controls: select fields, icon-button hover, ghost toggle track. |
| `--paper` | `#fbfaf5` | `bg-paper` | Raised surfaces that sit *above* bone: playground block shells, HUD, toolbar, code panel, the nav pill (`bg-paper/80` + `backdrop-blur-md`). |
| `--sage` | `#dde3d2` | `bg-sage` | Editorial panels: work entries on the home page, the case fact list, the unwired warning strip. |
| `--sage-deep` | `#cdd6c0` | `bg-sage-deep` | Hover state of a sage panel, and the divider colour inside one. Never a resting ground. |

Rule: a surface is distinguished by ground, not by a border box. Sage panels on
the home page carry no border at all. Paper surfaces carry the default 1px rule.

### Ink

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| `--ink` | `#1b1e19` | `text-ink` | Headlines, numerals, primary body, anything on lime. |
| `--ink-soft` | `#545b4e` | `text-soft` | Secondary prose: ledes, taglines, case body, captions. |
| `--ink-faint` | `#5f6659` | `text-faint` | Metadata only: stack lists, metric labels, HUD field names, small caps headers. |

Real contrast ratios for `--ink-faint` `#5f6659` (WCAG 2.1, computed from the
shipped hex):

| Ground | Ratio | Verdict |
|---|---|---|
| paper `#fbfaf5` | 5.69:1 | passes AA normal text |
| bone `#f4f2ea` | 5.31:1 | passes AA normal text |
| bone-deep `#ebe8dd` | 4.85:1 | passes AA normal text |
| **sage `#dde3d2`** | **4.53:1** | **passes AA, with 0.03 of margin** |
| sage-deep `#cdd6c0` | 3.96:1 | fails AA normal text |

**Sage is the binding ground.** The smallest type in the build — the 11px stack
list and the 12px metric label inside the home work panels — is `text-faint` on
sage. That 4.53:1 is the number the token has to clear, and it does so with
almost no headroom. Consequence, and this is a hard rule: **`--ink-faint` may
darken but must never lighten.** Any future change to the token is checked
against sage, not against bone.

Second hard rule: **`--ink-faint` is not permitted on `--sage-deep`.** At 3.96:1
it fails. Metadata that lives inside a panel whose hover state is sage-deep must
either move to `--ink-soft` (5.36:1 on sage, 4.68:1 on sage-deep) or the panel
must not swap ground under it.

`--ink-soft` for reference: 6.74:1 on paper, 6.28:1 on bone, 5.36:1 on sage.
`--ink` is 12.83:1 or better on every ground including lime (13.05:1).

### Signal

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| `--lime` | `#c8f24c` | `bg-lime` | The single accent. See the lime rule below. |
| `--lime-edge` | `#a9cc3f` | `var(--lime-edge)` | Not an accent. The darker sibling used for hover on the lime pill, for the picked-up-block ring, and as a data mark in SVG (chart line, chart points, chart bar fill, accent edges in the topology diagrams). |
| `--clay` | `#b4491a` | `text-clay` | Destructive and degraded: "release to remove", optimisations off, the 50k-row stutter warning, low frame rate. Also `caret-color`. 5.14:1 on paper, 4.79:1 on bone. |
| `--moss` | `#2f6b45` | `text-moss` | Wired and healthy: live wires and their ports, healthy frame rate, memoisation on, the keyboard-drag hint. 6.07:1 on paper, 4.83:1 on sage. |
| `--rule` | `#dcd8ca` | `border-rule` | The global border colour. `* { border-color: var(--rule) }`, so `border` alone is always correct. |
| `--rule-firm` | `#c3bfae` | `border-rule-firm` | The visible hairline: secondary button outline, link underline, scrollbar thumb, the signature stroke, non-accent edges in diagrams. |

### The lime rule, as shipped

`--lime` is a fill, never a stroke, never a tint, never a decoration. It appears
**once per viewport, always on the thing you should touch.** Exactly two
referents ship:

1. **The primary action pill** — `bg-lime` with `text-ink`, `rounded-full`.
   "Open the playground" on the home hero; the single CTA at the foot of a case
   page. Hover moves the fill to `--lime-edge` and lifts the pill.
2. **The Optimisations switch in the playground toolbar** — `bg-lime` when on,
   `bg-bone-deep` when off. The switch is the one control on that surface that
   changes what the demonstration proves, so it holds the accent.

The signature stroke under the name is **`--rule-firm`, not lime.** It is
drawing, not action, so it does not take the accent.

`::selection` is `--lime` on `--ink`. This is the browser's surface, not a
composed element, and does not count against the one-per-viewport budget.

If a new surface needs a second lime thing, the answer is that one of them is
not the primary action.

### Browser-drawn surfaces

Themed in `globals.css` because they belong to the palette too:

- `::selection` — `--lime` ground, `--ink` text.
- `caret-color: var(--clay)` — the only warm mark in a text field.
- `color-scheme: light` — form controls render light, never auto-darkened.
- Scrollbar — `scrollbar-width: thin`, `scrollbar-color: var(--rule-firm) var(--bone)`; WebKit gets an 11px track on `--bone`, a `--rule-firm` thumb with a 3px bone border and `border-radius: 99px`, darkening to `--ink-faint` on hover.
- `:focus-visible` — `2px solid var(--ink)` with `outline-offset: 3px`. One focus ring for the whole site; do not restyle it per component.

---

## 2. Type

Three families, loaded via `next/font/google` in `src/app/layout.tsx` with
`display: "swap"`, exposed as `--font-bricolage`, `--font-archivo`,
`--font-jet` and aliased in `@theme` as `--font-display`, `--font-sans`,
`--font-mono`. No system display face ships.

| Family | Alias | Where |
|---|---|---|
| Bricolage Grotesque | `font-display` | Voice only: h1, panel and case headings, wordmark, and all large numerals. Applied through `.display` / `.numeral`, not by raw class. |
| Archivo | `font-sans` | Everything else. Set on `body` with `font-feature-settings: "ss01","cv05"`, antialiased, `text-rendering: optimizeLegibility`. |
| JetBrains Mono | `font-mono` | **Restricted.** Code, identifiers, and measured values only. |

Mono is allowed on: source in the code panel, capability names in the unwired
strip (`dataset`, `filter`), HUD metric values, `on`/`off` state words, block
`proves` strings, and node labels in the topology diagrams. Mono is **not**
allowed for prose, labels, headings, eyebrows, or "technical flavour". Section
headers inside the HUD are deliberately `font-sans` even though the panel is
`font-mono` — the panel is mono because its contents are measurements, so the
labels step back out.

### The two composition classes

```css
.display  { font-family: var(--font-display); font-weight: 500;
            letter-spacing: -0.035em; line-height: 0.98; }
.numeral  { font-family: var(--font-display); font-weight: 300;
            letter-spacing: -0.05em; font-variant-numeric: tabular-nums;
            line-height: 0.86; }
```

`.display` is for words. `.numeral` is for figures only: weight drops to 300,
tracking tightens further, leading goes sub-unity, and figures are tabular. A
metric set in `.display` or a headline set in `.numeral` is a mistake.

`.tnum` exists separately for tabular figures in body or mono contexts, where
numbers are compared down a column.

### Ramp, as actually used

Display sizes are fluid `clamp()`; text sizes are fixed px. There is no `rem`
step scale in this build and inventing one would misdescribe it.

| Step | Value | Use |
|---|---|---|
| Hero | `clamp(2.6rem, 7.5vw, 5.2rem)` `.display` | Home h1 only, one per site. |
| Case title | `clamp(2.2rem, 6vw, 3.6rem)` `.display` | Case and playground page titles. |
| Metric | `clamp(2.4rem, 6vw, 3.6rem)` `.numeral` | The one number per work entry. |
| Panel head | `clamp(1.5rem, 3vw, 2.1rem)` `.display` | Work entry name. |
| Statement | `clamp(1.05rem, 2vw, 1.35rem)` / `leading-[1.5]` | The about paragraph. |
| Lede | `clamp(1rem, 1.6vw, 1.15rem)` / `leading-[1.55]` | Hero lede, case lede. |
| Body | `16px` / `leading-[1.65]` | Case prose. |
| Small body | `15px`, `14px` | Case captions, taglines, contact links. |
| UI | `13px`, `12px` | Controls, nav links, block headers. |
| Meta | `11px`, `10px` | HUD fields, stack lists, strip notes. |

Small-caps headers (`text-[11px] uppercase tracking-wider text-faint
font-semibold`) label instrument panels. They are labels for a live readout, not
section eyebrows, and they do not migrate to editorial pages.

### Measure

There is no single global measure and the page container is not one.

| Value | Applies to |
|---|---|
| `max-w-[68rem]` | **Page container.** Home, nav, footer. A layout width, not a measure. |
| `max-w-6xl` | Playground page container (wider working area). |
| `max-w-3xl` | Case article container. |
| `max-w-[68ch]` | Case body paragraphs (`[&_p]:max-w-[68ch]`). The widest measure that ships. |
| `max-w-[64ch]` | Case caption paragraph. |
| `max-w-[62ch]` | Figure captions under diagrams and flows. |
| `max-w-[52ch]` | The about statement, the case lede. |
| `max-w-[46ch]` | Hero lede, work-entry tagline. |
| `max-w-[34ch]` | Case fact-list definitions. |
| `max-w-[24ch]`, `max-w-[16ch]` | Metric label, hero headline. |

Rule: measure narrows as type grows. Display text is capped in `ch` so the line
breaks where it should (`16ch` on the hero), and running prose sits between
46ch and 68ch depending on size.

---

## 3. Surfaces, radii, depth

Two radii tokens, and only two:

```css
--radius-panel: 22px;   /* rounded-[--radius-panel] */
--radius-card:  16px;   /* rounded-[--radius-card]  */
```

- `--radius-panel` — the large editorial surfaces: home work entries, the case fact list.
- `--radius-card` — working surfaces: playground block shells, toolbar, HUD, drop ghost.
- `rounded-full` — pills and circular controls only: CTA pills, nav links, toggle track and knob, badges, skip link, scrollbar thumb.
- `rounded-md` — small controls inside a card (icon buttons, selects, reset/clear).

Nothing in this system has a square corner and nothing has a hard offset shadow.

### Depth

Two shadow tokens, and depth is a state, not a decoration:

```css
--shadow-rest: 0 1px 1px rgb(27 30 25 / 0.04), 0 10px 24px -18px rgb(27 30 25 / 0.35);
--shadow-lift: 0 18px 40px -20px rgb(27 30 25 / 0.4);
```

- `--shadow-rest` is the resting elevation of a paper surface: block shell, code panel, the "release to remove" badge.
- `--shadow-lift` applies **only while a block is physically picked up.** Nothing at rest may use it.
- The CTA pill is the one exception and carries its own inline pair: a 1px seat at rest, and a wider lift on hover, transitioned with `transform`, `box-shadow` and `background-color` over 300ms.

Shadows are warm — every shadow is `rgb(27 30 25 / …)`, the ink colour, never
neutral black.

Sage panels have no shadow at all. They separate by ground.

---

## 4. Motion

Four keyframe animations ship. Two are authored moments; two are state
indicators that exist only while a specific interaction is live. Every one of
them is neutralised under `prefers-reduced-motion: reduce`, which clamps all
animation and transition durations to `0.01ms`, forces a single iteration, and
turns off smooth scrolling.

The house easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Hover and colour
transitions use `ease`/`ease-out` at 160–340ms.

| Name | Class | Trigger | Kind |
|---|---|---|---|
| `ink-in` | `.ink-stroke` | Page load, once. 2200ms, 200ms delay, `forwards`. | Authored moment |
| `settle` | `.settle` | Section and block mount. 520ms, `both`. | Authored moment |
| `wire-flow` | `.wire-live` | **Only while a drag is active.** | State indicator |
| `slot-breathe` | `.slot-ghost` | **Only while a card is lifted.** | State indicator |

**`ink-in`** is the signature. A single `--rule-firm` path under the name draws
itself by animating `stroke-dashoffset` from `--len` to 0. It runs once, on the
home page, and is the only purely decorative animation in the build.

**`settle`** is the arrival grammar: 8px up, opacity 0→1, 6px blur→0. Applied
to the home hero, case openers, and every playground block shell as it mounts,
so a newly dropped block arrives the same way the page did.

**`wire-flow`** marches a `4 3` dash along the connection paths at 900ms linear.
The wire is drawn with a static dash at all times; `Wires.tsx` adds `.wire-live`
**only when `selectDrag` is non-null**. Standing still, the canvas is still. The
motion means "you are rewiring right now", so it reads as information rather
than ambience.

**`slot-breathe`** pulses the vacated slot's border between `--rule-firm` and
`--lime-edge`, with a 22% lime wash, over 1.7s. `BlockShell.tsx` renders the
ghost **only while `lifted` is true**. It marks where the card will land.

Rule for new motion: perpetual animation is not permitted. An animation either
runs once on arrival or is bound to an active interaction state.

Two non-keyframe motion devices:

- `.rule-link` — underline at 1px, 4px offset, `--rule-firm` moving to `--ink` on hover over 160ms. This is the link treatment for prose.
- `.scroll-fade` — a right-edge mask fading the last 44px of a horizontally scrollable diagram, removed above 720px. A cut edge should read as "more this way", not as a clipped drawing.

---

## 5. Icons

`src/components/icons.tsx` is the entire icon system. No icon font, no glyph
character, no emoji, no third-party set.

Every icon is drawn by one shared `Svg` wrapper with fixed geometry:

- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`
- `strokeWidth={1.6}`, `strokeLinecap="round"`, `strokeLinejoin="round"`
- `aria-hidden`, `focusable="false"`
- `size` prop defaults to `16`; shipped sizes are 13, 14, 15, 16.

Because stroke is `currentColor`, an icon never carries its own colour. It
inherits from the text beside it, which is how a `text-faint` icon button turns
`text-ink` on hover with no icon-specific rule.

Ten icons ship: `IconGrip`, `IconClose`, `IconCode`, `IconTrash`,
`IconArrowRight`, `IconArrowLeft`, `IconExternal`, `IconPlus`, `IconRefresh`,
`IconCaret`. A new icon is added to this file with the same wrapper and the same
1.6 stroke, or it is not added.

Icon-only controls always carry `aria-label`, and `title` when they are also
pointer targets. Arrow icons in a link translate 1 unit on group hover over
300ms; that is the only icon animation.

---

## 6. Playground component contract

The playground blocks are the one place in the site with a formal component
contract, and it is part of the design system because it determines what a block
looks like.

`BlockSpec` (`src/features/playground/model/types.ts`) declares four capability
relationships:

```ts
provides:     Capability[]     // what this block publishes
consumes:     Capability[]     // required; absent input = broken
optionally?:  Capability[]     // enhancing; absent input = degraded, not broken
optionalNote?: string          // the sentence shown when an optional input is absent
```

Three visual states follow, and they must stay distinct:

1. **Wired.** Solid border, no strip. The block does what it says.
2. **Unwired** (`consumes` unsatisfied). The shell border goes `border-dashed`
   and a strip appears: `bg-sage`, `text-moss`, 11px, with the missing
   capability names in mono semibold — "Unwired, nothing provides `dataset`."
   Sage plus moss is the warning register.
3. **Degraded** (`consumes` satisfied, an `optionally` capability absent). The
   border stays solid and the strip is **neutral**: no sage ground, no moss
   text, just `text-soft` on the block's own paper, carrying `optionalNote`.
   Example: the Data Table with no paginator reads "No paginator on the canvas,
   so every matching row is scrollable."

The distinction is the rule. A missing optional input is not a fault and must
never borrow the fault colours. A block is only ever in one of these states —
the degraded note renders only when `missing.length === 0`.

Drag states, for completeness: keyboard-held blocks take a `--lime-edge` ring
and a moss key-hint strip; pointer-lifted blocks scale down, rotate `-1.6deg`,
take `--shadow-lift`, and leave a breathing ghost; dragged outside the canvas
they take a `--clay` ring and a clay "Release to remove" badge.

---

## 7. Layout and structure

### Page skeleton

Every page is `mx-auto` inside a container with `px-5 sm:px-8`. Container width
depends on the page type: `max-w-[68rem]` for home, nav and footer,
`max-w-3xl` for case articles, `max-w-6xl` for the playground.

`layout.tsx` ships a skip link (`sr-only` until focused, then an ink pill at
top-left, `z-50`), a sticky `Nav` at `z-40`, `<main id="main">`, and `Footer`.
`body` is `min-h-dvh`.

Nav is a sticky bar with the wordmark in `.display` at 15px and a translucent
`bg-paper/80 backdrop-blur-md` pill of links pushed right with `ml-auto`.
Anchor targets carry `scroll-mt-24` so the sticky bar never covers a heading.

### Rhythm

Spacing is Tailwind's 4px scale used with restraint. The recurring intervals in
this build: `gap-1.5`/`gap-2`/`gap-3` inside controls, `p-3`/`px-3 py-2.5` in
cards, `px-6 py-7` (`sm:px-9 sm:py-8`) in editorial panels, `space-y-3` between
work entries, `mt-5`–`mt-12` between blocks within a section, and
`py-12`–`py-20` between sections.

Work entries are a two-column CSS grid above `sm`
(`sm:grid-cols-[minmax(0,1fr)_auto]`) with explicit row/column placement, so the
metric sits right and spans, and everything collapses to one column on mobile.
They are a stacked list with `space-y-3`, never a tile grid.

### Folders

```
src/
  app/                     Routes. App Router, static export.
    globals.css            Token layer + motion grammar. Single source of truth.
    layout.tsx             Fonts, metadata, skip link, Nav, Footer.
    page.tsx               Home.
    playground/page.tsx
    work/<slug>/page.tsx   caligrafia, debt-recovery, incident-dispatch.
  components/              Cross-route presentation.
    icons.tsx              The whole icon system.
    Nav.tsx  Footer.tsx  case.tsx  SignatureStroke.tsx
    diagrams.tsx  Flow.tsx  FrameworkCompare.tsx  VueIsland.tsx
  content/profile.ts       All home copy and contact data. Copy is data, not JSX.
  features/playground/     The one feature with internal layering.
    model/                 types, registry, state, data, snippets, instrument.
    ui/                    Playground, Canvas, BlockShell, Palette, Toolbar,
                           Hud, Wires, CodePanel, CanvasContext.
    blocks/                One file per block kind + shared.ts.
    hooks/                 useBlockDrag.
    index.ts               The feature's only public entry.
  lib/                     store.ts, svgPath.ts. No feature knowledge.
```

Rules this structure encodes:

- Copy lives in `src/content`, never inline in a page component.
- A feature owns its model, ui, blocks and hooks, and exposes them through one `index.ts`. Nothing outside `features/playground` imports past that entry.
- `lib/` knows nothing about any feature.
- `components/` is presentation shared across routes; anything used by exactly one feature belongs to that feature.
- New colour, radius, shadow or animation goes in `globals.css` first and is used through its token. A raw hex in a component is a defect.

---

## 8. Building a new surface

1. Container: `mx-auto max-w-[68rem] px-5 sm:px-8`, or `max-w-3xl` if it is an article.
2. Ground stays `--bone`. Choose sage for an editorial panel (`--radius-panel`, no border, no shadow) or paper for a working surface (`--radius-card`, `border`, `--shadow-rest`).
3. One `.display` heading. If there is a figure worth reading, one `.numeral`, set large and right.
4. Body in Archivo, `text-soft`, measure between 46ch and 68ch by size.
5. Metadata in `text-faint` at 11–12px — and check the ground: sage is the floor at 4.53:1, sage-deep is off-limits.
6. Mono only for code, identifiers or measured values.
7. Exactly one lime thing, and it is the primary action.
8. Wrap the section in `.settle`. Add no other animation unless it is bound to an interaction state.
9. Icons from `src/components/icons.tsx` only, with `aria-label` on icon-only controls.
10. Leave `:focus-visible` alone.
