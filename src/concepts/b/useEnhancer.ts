import { useCallback, useState } from 'react';
import { enhanceIdea } from '../../shared/enhance';
import type { EnhanceResult, IdeaCard } from '../../shared/types';

export type EnhancerStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface EnhancerState {
  status: EnhancerStatus;
  cards: IdeaCard[];
  lineage: string[];
  error: string | null;
  /** Bumps on every successful result so views can re-trigger a subtle fade. */
  revision: number;
}

const INITIAL: EnhancerState = {
  status: 'idle',
  cards: [],
  lineage: [],
  error: null,
  revision: 0,
};

/**
 * Owns the enhance lifecycle for Concept B: the initial enhance, the running
 * lineage, and the per-card "evolve" that replaces the displayed set while
 * extending the lineage chain.
 */
export function useEnhancer() {
  const [state, setState] = useState<EnhancerState>(INITIAL);

  const run = useCallback(async (seed: string, lineage: string[]) => {
    setState((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const result: EnhanceResult = await enhanceIdea(seed, lineage);
      setState((s) => ({
        status: 'ready',
        cards: result.cards,
        lineage: result.lineage,
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
      void run(`${card.name} — ${card.tagline}`, state.lineage);
    },
    [run, state.lineage],
  );

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, enhance, evolve, reset };
}
