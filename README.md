# Idea Enhancer

Type a small idea, get **four divergent, fully-developed concepts** back —
🎯 Focused MVP · 🚀 The 10x · 🤿 The Contrarian · 💰 The Money-Maker — each with
a name, tagline, the twist, audience, business model, weekend MVP, and biggest
risk. Any card can be **evolved** further; the app tracks the lineage chain.

This repo holds **two design concepts of the same product** so we can compare:

- **`/a`** — playful, arcade, shareable
- **`/b`** — calm, editorial, pro tool

Both call the same engine, so the comparison is purely UX/visual.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173  ->  /  /a  /b
```

Without an API key the app uses a **deterministic mock** generator, so every
screen is fully demoable offline. To enable live Claude enhancement, copy
`.env.example` to `.env` and set `ANTHROPIC_API_KEY` (used by `api/enhance.ts`
on Vercel).

## Architecture

```
api/enhance.ts        Vercel serverless proxy -> Claude (strict tool use).
                      Returns 501 with no key, so the client falls back to mock.
src/shared/           The contract both concepts build against:
  types.ts            IdeaCard / EnhanceResult / DirectionMeta
  directions.ts       The four directions + display metadata
  enhance.ts          enhanceIdea(seed, lineage) — the ONLY entry point UIs use
  mock.ts             deterministic offline fallback
src/concepts/a, b/    The two design concepts (one per build agent)
```

## Roadmap

- **v1 (this):** enhancement core — input → 4 cards → evolve → shareable card.
- **v2:** "Make it real →" generates a deployable landing page from the
  template-market library + Vercel deploy.
