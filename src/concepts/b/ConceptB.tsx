// ──────────────────────────────────────────────────────────────────────────
// CONCEPT B — "calm / editorial / pro tool".
// A serious thinking tool: generous whitespace, serif display type over a
// clean sans body, an ink palette with a single restrained accent per
// direction, and subtle transitions only. Owned by build agent B; everything
// lives under src/concepts/b/.
// ──────────────────────────────────────────────────────────────────────────
import { Check, Copy, RotateCcw } from 'lucide-react';
import { useEnhancer } from './useEnhancer';
import { useShare } from './useShare';
import { SeedInput } from './components/SeedInput';
import { IdeaCardView } from './components/IdeaCardView';
import { CardSkeleton } from './components/CardSkeleton';
import { Lineage } from './components/Lineage';
import { DemoBadge } from './components/DemoBadge';

export default function ConceptB() {
  const { state, enhance, evolve, reset } = useEnhancer();
  const { status: setShareStatus, shareSet } = useShare();
  const loading = state.status === 'loading';
  const hasCards = state.cards.length > 0;
  const currentSeed = state.lineage[state.lineage.length - 1] ?? '';

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-24">
        {/* Header */}
        <header className="max-w-2xl">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">
            Idea Enhancer
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
            Turn a sentence into four serious directions.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Type a small idea. We&rsquo;ll develop it four ways: focused,
            tenfold, contrarian, and commercial, then let you evolve any one of
            them further.
          </p>
        </header>

        {/* Input */}
        <section aria-label="Enter your idea" className="mt-10 max-w-2xl">
          <SeedInput loading={loading} error={state.error} onEnhance={enhance} />
        </section>

        {/* Results */}
        {(loading || hasCards) && (
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_15rem]">
            <main aria-busy={loading ? 'true' : 'false'}>
              {/* Toolbar: demo notice on the left, set-level actions on the right */}
              {hasCards && !loading && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>{state.source === 'mock' && <DemoBadge />}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void shareSet(currentSeed, state.cards)}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 ring-1 ring-stone-200 transition hover:text-stone-900 hover:ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 motion-reduce:transition-none"
                    >
                      {setShareStatus === 'idle' ? (
                        <>
                          <Copy className="h-4 w-4" aria-hidden />
                          Copy all
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" aria-hidden />
                          {setShareStatus === 'shared' ? 'Shared' : 'Copied'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 ring-1 ring-stone-200 transition hover:text-stone-900 hover:ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 motion-reduce:transition-none"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden />
                      New idea
                    </button>
                  </div>
                </div>
              )}

              {loading && !hasCards ? (
                <SkeletonGrid />
              ) : (
                <div
                  key={state.revision}
                  className="grid gap-6 motion-safe:animate-[fadeIn_400ms_ease-out] sm:grid-cols-2"
                >
                  {state.cards.map((card) => (
                    <IdeaCardView
                      key={`${state.revision}-${card.direction}`}
                      card={card}
                      loading={loading}
                      onEvolve={evolve}
                    />
                  ))}
                </div>
              )}
            </main>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Lineage lineage={state.lineage} />
            </aside>
          </div>
        )}

        {/* Local keyframes for the subtle fade. Scoped, no global CSS edits.
            Respect reduced-motion at the source as well as via motion-safe. */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes fadeIn { from { opacity: 1; } to { opacity: 1; } }
          }
        `}</style>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
