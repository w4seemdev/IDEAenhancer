import { useCallback, useState } from 'react';
import { enhanceIdea } from '../../shared/enhance';
import type { EnhanceResult, IdeaCard } from '../../shared/types';

export type EnhancerStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface EnhancerState {
  status: EnhancerStatus;
  cards: IdeaCard[];
  lineage: string[];
  error: string | null;
  /** Increments on every successful result — drives re-trigger of reveal animations. */
  revealKey: number;
}

const INITIAL: EnhancerState = {
  status: 'idle',
  cards: [],
  lineage: [],
  error: null,
  revealKey: 0,
};

/**
 * Owns all enhancement state for Concept A.
 * `enhance` starts a fresh chain from a typed seed; `evolve` continues the
 * existing lineage from a chosen card. Both share one in-flight guard.
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
        revealKey: s.revealKey + 1,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went sideways. Try again.';
      setState((s) => ({ ...s, status: 'error', error: message }));
    }
  }, []);

  const enhance = useCallback(
    (seed: string) => {
      // A brand-new idea resets the chain.
      void run(seed, []);
    },
    [run],
  );

  const evolve = useCallback(
    (card: IdeaCard) => {
      void run(`${card.name} — ${card.tagline}`, state.lineage);
    },
    [run, state.lineage],
  );

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, enhance, evolve, reset };
}
