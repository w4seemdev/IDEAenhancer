# Handoff — Idea Enhancer

Status: **the app is live on Vercel and production-ready in demo (mock) mode.**
It's deployed at **https://ide-aenhancer.vercel.app** (auto-deploys on every push
to `main`). The build is green (`tsc --noEmit && vite build`), everything is pushed
to `https://github.com/w4seemdev/IDEAenhancer` on `main`, and it runs fully offline
without any API key (deterministic mock). The only thing left to make it *live*
(real Claude instead of mock) needs *your* API key — see below.

---

## Done (no action needed)

- **Real landing page** at `/` (hero, the four directions, "how it works", CTAs, footer) → funnels to `/b`.
- **Two polished concepts**: `/a` playful/arcade, `/b` calm/editorial (recommended).
- **New features in both**: session persistence (localStorage — refresh keeps your last result), a "Demo mode" badge when running on the mock, **Surprise me** (random example seed), **Copy all four** (share the whole set), full keyboard + accessibility pass.
- **SEO/social**: title, meta description, Open Graph + Twitter card, `public/og.png` (1200×630 social image), `robots.txt`.
- **API hardening** (`api/enhance.ts`): 600-char seed cap, lineage bound, **~20 req/min per-IP rate limit**, strict-tool-use structured output, `claude-opus-4-8` default. Returns 501 with no key → client falls back to mock.
- **Repo hygiene**: MIT `LICENSE`, expanded `README.md`, GitHub Actions CI (`npm run build` on push/PR).

---

## Needs you (in order)

### 1. Deploy to Vercel — ✅ DONE (2026-06-15)
- Live at **https://ide-aenhancer.vercel.app** (Vercel project slug `ide-aenhancer`).
- Imported from GitHub, so **every push to `main` auto-deploys**. First Production deploy succeeded for commit `013d6dc`.
- Currently running in **demo/mock mode** (no API key yet — see step 2).

### 2. Enable live Claude (flip off demo mode)
- Vercel → Project → **Settings → Environment Variables** → add `ANTHROPIC_API_KEY = <your key>`.
- Optional `ANTHROPIC_MODEL` — default `claude-opus-4-8` (best ideas). For a cheaper free tier use `claude-sonnet-4-6` or `claude-haiku-4-5`. (Cards are short, so per-call cost is modest, but Opus is the priciest tier — your call.)
- **Redeploy** so the function picks up the env var. The "Demo mode" badge disappears once live.
- Local test: `cp .env.example .env`, paste the key, `npm run dev`.

### 3. (Optional) Custom domain + finish SEO
- Add your domain in Vercel. Then the only SEO gap is domain-dependent: add `<link rel="canonical">`, `og:url`, and `og:site_name` to `index.html`, and switch `og:image` to the absolute `https://<domain>/og.png` (some crawlers don't resolve root-relative OG paths). Tell me the domain and I'll do it in one commit.

### 4. Pick the final concept
- Right now both ship (`/a` playful, `/b` pro). The landing recommends `/b`. If you want a single product, say which and I'll make it the default and retire the other (kept in git history either way).

---

## Notes
- **Cost control**: the per-IP rate limit is in-memory (resets on cold start) — fine for launch; move to a shared store (Upstash/KV) if traffic grows.
- **v2** (not started): "Make it real →" — generate a deployable landing page for an enhanced idea from the template-market template library.
