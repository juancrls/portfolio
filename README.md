# Portfolio

Personal site for Juan Costa. Next.js 15 (App Router), TypeScript, Tailwind v4.

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Routes

| Route | |
| --- | --- |
| `/` | Positioning, work index, contact |
| `/work/debt-recovery` | .NET microservices platform for contract and claims management |
| `/work/incident-dispatch` | Distributed case creation and patrol dispatch |
| `/work/caligrafia` | Handwriting synthesis engine for Portuguese |
| `/playground` | Live component sandbox |

Every route prerenders as static. There is no backend and no environment configuration.

## Playground

`src/features/playground` is the frontend argument of the site rather than a description of it.

Each block declares what it publishes and what it consumes in `model/registry.ts`. The canvas resolves provider to consumer from those declarations and draws the resulting graph; there is no pairwise wiring anywhere in the code. Removing a provider leaves its consumers reporting what they are missing instead of throwing.

State is a small `useSyncExternalStore` store with per-slice subscriptions (`src/lib/store.ts`) rather than Context, so typing in the filter does not re-render a 50,000-row table. The live panel measures frame rate, filter and sort cost, request and cache counts and per-block render counts, and the toolbar switch genuinely removes `useMemo`, `useDeferredValue`, windowing and `memo()` so the cost of each is visible rather than asserted.

Blocks are dragged by their header with Pointer Events, which works on touch. The same handle is a keyboard control: Enter picks a block up, arrows move it, Enter drops, Escape restores, Delete removes.

## Design

`DESIGN.md` documents the palette, type, surfaces, motion and icon rules.

## Deployment

Vercel. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is attached; without it the production URL Vercel exposes is used for Open Graph metadata.
