# Design

## World

Warm bone ground, sage panels, one electric lime. The page reads as a worktable rather than a dark developer template: content sits on paper-coloured stock, and the things worth touching are the only saturated objects on the surface.

Light only. The visitor is at a desk in daylight, comparing tabs, not browsing at night. `color-scheme: light` is declared so native controls follow.

## Colour

Defined once in `src/app/globals.css` as CSS custom properties, exposed to Tailwind through `@theme inline`.

| Token | Value | Role |
| --- | --- | --- |
| `--bone` | `#f4f2ea` | Page ground |
| `--bone-deep` | `#ebe8dd` | Recessed wells, inputs, code blocks |
| `--paper` | `#fbfaf5` | Raised cards |
| `--sage` | `#dde3d2` | Panels that carry a whole region |
| `--sage-deep` | `#cdd6c0` | Panel hover, dividers inside sage |
| `--ink` | `#1b1e19` | Body text, primary surfaces |
| `--ink-soft` | `#545b4e` | Secondary text, tinted from the ground, never grey |
| `--ink-faint` | `#6e7468` | Labels and metadata, still above 4.5:1 on bone |
| `--rule` / `--rule-firm` | `#dcd8ca` / `#c3bfae` | Hairlines and firm edges |
| `--lime` | `#c8f24c` | The single accent. Fills only, never text |
| `--lime-edge` | `#a9cc3f` | Lime as a stroke, where the fill would be too light |
| `--clay` | `#b4491a` | Destructive and warning state |
| `--moss` | `#2f6b45` | Positive state, wires, accent text |

Strategy is restrained: neutrals plus one accent. Lime appears at most once per viewport and always on the element the visitor should touch, which is why it is never used for text or decoration.

## Type

- Display: **Bricolage Grotesque**, weight 500, tracking `-0.035em`. Headings and product names.
- Text: **Archivo**. Body, UI, labels.
- Numerals: `.numeral`, Bricolage at weight 300 with tabular figures. Metrics are set at display scale because the numbers are the argument.
- Mono: **JetBrains Mono**, restricted to code, capability identifiers and measured values. Not used as a costume for "technical".

Body measure is capped at 68ch, display at roughly 6rem via `clamp()`.

## Surfaces

Two radii: `--radius-panel` (22px) for regions, `--radius-card` (16px) for cards. Depth is a real offset plus a soft blur (`--shadow-rest`, `--shadow-lift`); there are no zero-offset halos and no hard block shadows.

Panels carry regions. Cards are used only where something is genuinely a discrete object, such as a playground block. There are no nested cards and no grid of equal tiles as page structure.

## Browser surfaces

Selection, caret, scrollbars, focus ring and tabular numerals are themed from the palette rather than left at browser defaults. Focus is a 2px ink outline at 3px offset, visible on every surface in the system.

## Motion

One authored moment: the pen stroke under the headline writing itself once, tying the page to the handwriting engine in the work below.

Everything else is functional. Easing is exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`); no bounce or elastic. The drag lift interpolates transform and shadow together over 340ms. Section entrances use `.settle`, which combines opacity, an 8px rise and a blur release. All of it collapses under `prefers-reduced-motion`.

## Icons

`src/components/icons.tsx`. One family, 24px grid, 1.6 stroke, round caps and joins, `currentColor`. No emoji and no Unicode glyphs stand in for an icon.

## Structure

```
src/
  app/                  routes and route metadata
  components/           shared presentation, icons, case-study primitives
  content/              copy and project data, kept out of layout
  features/playground/  the sandbox
    blocks/             the six composable blocks
    model/              store, contracts, registry, data, instrumentation
    ui/                 canvas, palette, wires, panels
    hooks/              pointer and keyboard drag
  lib/                  framework-agnostic helpers
```

Copy lives in `src/content`, never inline in a page, so the wording can change without touching layout.
