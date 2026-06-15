# Idea Enhancer

Type a small idea, get **four divergent, fully-developed concepts** back. Idea
Enhancer takes one scrappy line and expands it into four product directions, each
with a name, tagline, the twist, audience, business model, weekend MVP, and
biggest risk. Any card can be **evolved** further; the app tracks the lineage chain.

🎯 **Focused MVP** — stripped to the core; ship it this weekend.
🚀 **The 10x** — the ambitious, platform-scale version.
🤿 **The Contrarian** — invert a core assumption; the against-the-grain take.
💰 **The Money-Maker** — the version with an obvious, defensible path to revenue.

The repo holds **two design concepts of the same product** so we can compare:

- **`/`** — the product landing page (start here).
- **`/b`** — calm, editorial, pro tool (the recommended concept).
- **`/a`** — playful, arcade, shareable.

Both concepts call the same engine, so the comparison is purely UX/visual.

## Run / dev

```bash
npm install
npm run dev      # http://localhost:5173  ->  /  /a  /b
npm run build    # tsc --noEmit && vite build
npm run preview  # serve the production build locally
```

Stack: Vite + React 19 + TypeScript (strict) + Tailwind v4. No state library —
the shared contract in `src/shared/` is the whole API surface the UIs depend on.

## Mock vs live

Without an API key the app uses a **deterministic mock** generator (`src/shared/mock.ts`),
so every screen is fully demoable offline. Same seed in, same cards out — the UI
never flickers. Each result carries a `source` field (`'mock'` or `'live'`) so the
UI can show where the cards came from.

To enable **live** Claude enhancement, copy `.env.example` to `.env` and set
`ANTHROPIC_API_KEY` (used by `api/enhance.ts`). Optionally set `ANTHROPIC_MODEL`
to override the default (`claude-opus-4-8`). The serverless route:

- Forces structured output via a single strict tool (`tool_choice` -> `emit_ideas`),
  so the response always matches the `IdeaCard[]` shape.
- Returns **501** when no key is set, so the client transparently falls back to the mock.
- Caps seeds at 600 chars (**400**), bounds the lineage chain to the last ~8 entries,
  and rate-limits to ~20 requests/min per IP (**429**).

## Deploy (Vercel)

The repo is Vercel-ready (`vercel.json`, `api/enhance.ts` as a serverless function):

1. Import the repo into Vercel.
2. Add the `ANTHROPIC_API_KEY` environment variable (and optionally `ANTHROPIC_MODEL`).
3. Deploy. Without the key the live deploy still works — it serves the mock.

## Project structure

```
api/enhance.ts          Vercel serverless proxy -> Claude (strict tool use).
                        501 with no key; input/lineage caps; per-IP rate limit.
public/                 og.svg (social card, rasterized to og.png), spark.svg, robots.txt
index.html              Title, meta description, Open Graph + Twitter tags, theme-color.
src/Home.tsx            The product landing page (hero, how-it-works, CTAs).
src/main.tsx            Router: /  ->  Home,  /a  ->  ConceptA,  /b  ->  ConceptB.
src/shared/             The contract both concepts build against:
  types.ts              IdeaCard / EnhanceResult (incl. source) / DirectionMeta
  directions.ts         The four directions + display metadata
  enhance.ts            enhanceIdea(seed, lineage) — the ONLY entry point UIs use
  mock.ts               deterministic offline fallback (source: 'mock')
  storage.ts            localStorage session persistence, namespaced by 'a' | 'b'
  examples.ts           EXAMPLE_SEEDS + randomExample() for the "surprise me" input
src/concepts/a, b/      The two design concepts (one per build agent)
```

## Roadmap

- **v1 (this):** enhancement core — input -> 4 cards -> evolve -> shareable card.
- **v2:** "Make it real ->" generates a deployable landing page from the
  template-market library and deploys it to Vercel.

## License

MIT — see [LICENSE](./LICENSE).
