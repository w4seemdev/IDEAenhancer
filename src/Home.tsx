import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code } from 'lucide-react';
import { DIRECTIONS } from './shared/directions';

// The real product landing page. Sells the value prop, explains the four
// directions, and routes visitors into the recommended concept (/b) with a
// tasteful secondary link to the playful concept (/a). Dark, responsive,
// accessible (landmarks, real heading order, visible focus states).

const HOW = [
  { step: '1', title: 'Type a seed', body: 'A half-formed thought, a shower idea, one scrappy line. That is enough.' },
  { step: '2', title: 'Get four angles', body: 'We expand it into four distinct directions — not four reworded clones.' },
  { step: '3', title: 'Evolve the best', body: 'Pick the one with a spark and push it further. The lineage is tracked.' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950';

export default function Home() {
  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-violet-500/30">
      {/* Decorative top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(139,92,246,0.18),transparent)]"
      />

      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col px-6">
        {/* Header / brand */}
        <header className="flex items-center justify-between py-6">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-lg font-semibold ${focusRing}`}
            aria-label="Idea Enhancer home"
          >
            <Sparkles className="h-5 w-5 text-violet-400" aria-hidden="true" />
            <span>Idea Enhancer</span>
          </Link>
          <a
            href="https://github.com/w4seemdev"
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-100 ${focusRing}`}
          >
            <Code className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </header>

        <main id="main" className="flex flex-1 flex-col">
          {/* Hero */}
          <section className="flex flex-col items-center pt-12 pb-16 text-center sm:pt-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-violet-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Idea expander
            </p>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-6xl">
              Type a small idea.{' '}
              <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Get four bigger, better ones.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg text-neutral-400">
              Idea Enhancer takes one scrappy line and expands it into four fully-developed
              product concepts — focused, ambitious, contrarian, and built to make money.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/b"
                className={`group inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-colors hover:bg-violet-400 ${focusRing}`}
              >
                Try it
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                to="/a"
                className={`inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-6 py-3 text-base font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white ${focusRing}`}
              >
                See the playful version
              </Link>
            </div>
            <p className="mt-4 text-sm text-neutral-500">Free to try. No sign-up. Works offline.</p>
          </section>

          {/* The four directions */}
          <section aria-labelledby="directions-heading" className="py-12">
            <h2 id="directions-heading" className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Every idea, four ways
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIRECTIONS.map((d) => (
                <li
                  key={d.key}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700"
                >
                  <div className="text-3xl" aria-hidden="true">
                    {d.emoji}
                  </div>
                  <h3 className="mt-3 font-semibold text-neutral-100">{d.label}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{d.blurb}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-heading" className="py-12">
            <h2 id="how-heading" className="text-center text-2xl font-bold sm:text-3xl">
              How it works
            </h2>
            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {HOW.map((h) => (
                <li key={h.step} className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 font-semibold text-violet-300"
                    aria-hidden="true"
                  >
                    {h.step}
                  </span>
                  <h3 className="mt-4 font-semibold">{h.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{h.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Closing CTA */}
          <section className="my-12 rounded-3xl border border-violet-500/20 bg-linear-to-b from-violet-500/10 to-transparent px-6 py-14 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Got a half-formed idea?</h2>
            <p className="mx-auto mt-3 max-w-md text-neutral-400">
              Spend thirty seconds. Walk away with four directions worth building.
            </p>
            <Link
              to="/b"
              className={`group mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-colors hover:bg-violet-400 ${focusRing}`}
            >
              Try it now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </section>
        </main>

        <footer className="border-t border-neutral-900 py-8 text-center text-sm text-neutral-500">
          <p>
            Idea Enhancer — built with Claude. Compare the{' '}
            <Link to="/a" className={`rounded text-neutral-300 underline-offset-4 hover:underline ${focusRing}`}>
              playful
            </Link>{' '}
            and{' '}
            <Link to="/b" className={`rounded text-neutral-300 underline-offset-4 hover:underline ${focusRing}`}>
              pro
            </Link>{' '}
            concepts.
          </p>
        </footer>
      </div>
    </div>
  );
}
