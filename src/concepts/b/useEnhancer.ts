import { useCallback, useEffect, useState } from 'react';
import { enhanceIdea } from '../../shared/enhance';
import { clearSession, loadSession, saveSession } from '../../shared/storage';
import type { EnhanceResult, IdeaCard } from '../../shared/types';

const SESSION_KEY = 'b' as const;

export type EnhancerStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface EnhancerState {
  status: EnhancerStatus;
  cards: IdeaCard[];
  lineage: string[];
  /** Where the current cards came from: the live API or the offline mock. */
  source: EnhanceResult['source'] | null;
  error: string | null;
  /** Bumps on every successful result so views can re-trigger a subtle fade. */
  revision: number;
}

const INITIAL: EnhancerState = {
  status: 'idle',
  cards: [],
  lineage: [],
  source: null,
  error: null,
  revision: 0,
};

/** Build the restored state from a persisted result, or fall back to INITIAL. */
function restore(): EnhancerState {
  const saved = loadSession(SESSION_KEY);
  if (!saved) return INITIAL;
  return {
    status: 'ready',
    cards: saved.cards,
    lineage: saved.lineage,
    source: saved.source,
    error: null,
    revision: 1,
  };
}

/**
 * Owns the enhance lifecycle for Concept B: the initial enhance, the running
 * lineage, and the per-card "evolve" that replaces the displayed set while
 * extending the lineage chain. The last successful result is persisted per
 * concept so a return visit picks up where it left off; a fresh "New idea"
 * clears it. All storage access is guarded and never throws.
 */
export function useEnhancer() {
  // Lazy initializer: restore once, synchronously, so there is no empty flash.
  const [state, setState] = useState<EnhancerState>(restore);

  // Re-run restore on mount in case the lazy initializer ran during SSR/hydrate
  // where storage was not yet available. Cheap and idempotent.
  useEffect(() => {
    setState((s) => (s.status === 'idle' ? restore() : s));
  }, []);

  const run = useCallback(async (seed: string, lineage: string[]) => {
    setState((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const result: EnhanceResult = await enhanceIdea(seed, lineage);
      saveSession(SESSION_KEY, result);
      setState((s) => ({
        status: 'ready',
        cards: result.cards,
        lineage: result.lineage,
        source: result.source,
        error: null,
        revision: s.revision + 1,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setState((s) => ({ ...s, status: 'error', error: message }));
    }
  }, []);

  /** First enhance from a fresh seed — resets the lineage. */
  const enhance = useCallback(
    (seed: string) => {
      void run(seed, []);
    },
    [run],
  );

  /** Evolve one card: feeds its name + tagline back in, keeping the lineage. */
  const evolve = useCallback(
    (card: IdeaCard) => {
      void run(`${card.name}: ${card.tagline}`, state.lineage);
    },
    [run, state.lineage],
  );

  /** Start over: drop the on-screen result and the persisted session. */
  const reset = useCallback(() => {
    clearSession(SESSION_KEY);
    setState(INITIAL);
  }, []);

  return { state, enhance, evolve, reset };
}
