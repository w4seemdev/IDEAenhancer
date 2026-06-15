// ──────────────────────────────────────────────────────────────────────────
// Concept A — "Idea Arcade": the playful / vibrant / shareable direction.
// Everything here is self-contained under src/concepts/a/ and talks to the
// shared layer ONLY through enhanceIdea() + the shared types/directions.
// ──────────────────────────────────────────────────────────────────────────
import { useCallback, useState } from 'react';
import { Gamepad2, RotateCcw, Copy, History } from 'lucide-react';
import type { EnhanceResult, IdeaCard } from '../../shared/types';
import { randomExample } from '../../shared/examples';
import { useEnhancer } from './useEnhancer';
import { formatCard, formatSet, shareText } from './share';
import ArcadeStyles from './components/ArcadeStyles';
import SeedInput from './components/SeedInput';
import LineageTrail from './components/LineageTrail';
import IdeaCardView from './components/IdeaCardView';
import DemoBadge from './components/DemoBadge';
import Toast, { type ToastState } from './components/Toast';

export default function ConceptA() {
  const { state, enhance, evolve, reset } = useEnhancer();
  const [seed, setSeed] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);

  const loading = state.status === 'loading';
  const hasCards = state.cards.length > 0;
  const isDemo = state.source === 'mock';
  const currentSeed = state.lineage[state.lineage.length - 1] ?? '';

  const handleShareCard = useCallback(async (card: IdeaCard) => {
    const outcome = await shareText(card.name, formatCard(card));
    setToast({ id: Date.now(), outcome });
  }, []);

  const handleShareAll = useCallback(async () => {
    const lastSeed = state.lineage[state.lineage.length - 1] ?? '';
    const result: EnhanceResult = {
      seed: lastSeed,
      cards: state.cards,
      lineage: state.lineage,
      source: state.source ?? 'mock',
    };
    const outcome = await shareText('4 ideas from Idea Enhancer', formatSet(result));
    setToast({ id: Date.now(), outcome });
  }, [state.cards, state.lineage, state.source]);

  const handleSurprise = useCallback(() => {
    const example = randomExample();
    setSeed(example);
    enhance(example);
  }, [enhance]);

  const handleReset = useCallback(() => {
    reset();
    setSeed('');
  }, [reset]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <ArcadeStyles />

      {/* Ambient arcade glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70 ring-1 ring-white/10">
            <Gamepad2 className="h-4 w-4" aria-hidden />
            Idea Arcade · Concept A
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            One idea in.{' '}
            <span className="a-gradient-text">Four wild concepts</span> out.
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/70 sm:text-lg">
            Type something small. We spin the reels and hand you four fully formed,
            divergent takes, then let you evolve and share the ones you love.
          </p>
        </header>

        {/* Input */}
        <section className="mx-auto w-full max-w-2xl">
          <SeedInput
            value={seed}
            loading={loading}
            error={state.error}
            onChange={setSeed}
            onEnhance={enhance}
            onSurprise={handleSurprise}
          />
        </section>

        {/* Restored-session hint */}
        {hasCards && state.restored && (
          <p className="mx-auto inline-flex items-center gap-1.5 text-xs font-semibold text-white/55">
            <History className="h-3.5 w-3.5" aria-hidden />
            Picked up where you left off. Start a fresh idea any time.
          </p>
        )}

        {/* Lineage trail */}
        {hasCards && (
          <section className="mx-auto w-full max-w-5xl">
            <LineageTrail lineage={state.lineage} />
          </section>
        )}

        {/* Results */}
        {hasCards && (
          <section aria-busy={loading ? 'true' : 'false'}>
            {/* Concise polite status — announces that results arrived without a
                screen reader reading the entire four-card grid aloud. */}
            <p className="sr-only" role="status">
              {currentSeed ? `Four new ideas ready for "${currentSeed}".` : 'Four new ideas ready.'}
            </p>
            {isDemo && (
              <div className="mb-5 flex justify-center">
                {/* Keyed on revealKey so each fresh demo result gets a fresh,
                    dismissible badge rather than staying hidden forever. */}
                <DemoBadge key={`demo-${state.revealKey}`} />
              </div>
            )}

            <div
              key={state.revealKey}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {state.cards.map((card, i) => (
                <IdeaCardView
                  key={`${state.revealKey}-${card.direction}`}
                  card={card}
                  index={i}
                  loading={loading}
                  onEvolve={evolve}
                  onShare={handleShareCard}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleShareAll}
                disabled={loading}
                className="a-press a-focus inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-60"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Copy all four
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="a-press a-focus inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/5 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Start a fresh idea
              </button>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!hasCards && !loading && (
          <section className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="grid w-full grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {[
                { e: '🎯', t: 'Focused MVP' },
                { e: '🚀', t: 'The 10x' },
                { e: '🤿', t: 'The Contrarian' },
                { e: '💰', t: 'The Money Maker' },
              ].map((p) => (
                <div key={p.t} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="a-float text-3xl" aria-hidden>
                    {p.e}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-white/70">{p.t}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-white/60">
              Not sure where to start?{' '}
              <button
                type="button"
                onClick={handleSurprise}
                className="a-focus rounded font-bold text-white underline decoration-violet-400/60 decoration-2 underline-offset-4 hover:decoration-violet-300"
              >
                Try a random idea
              </button>
              .
            </p>
          </section>
        )}
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
