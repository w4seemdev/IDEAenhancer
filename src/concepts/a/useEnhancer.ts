import { useCallback, useEffect, useRef, useState } from 'react';
import { enhanceIdea } from '../../shared/enhance';
import { clearSession, loadSession, saveSession } from '../../shared/storage';
import type { EnhanceResult, IdeaCard } from '../../shared/types';

export type EnhancerStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface EnhancerState {
  status: EnhancerStatus;
  cards: IdeaCard[];
  lineage: string[];
  /** Where the current cards came from: the live API or the offline mock. */
  source: EnhanceResult['source'] | null;
  error: string | null;
  /** Increments on every successful result — drives re-trigger of reveal animations. */
  revealKey: number;
  /** True for the first render after a saved session was restored from storage. */
  restored: boolean;
}

const INITIAL: EnhancerState = {
  status: 'idle',
  cards: [],
  lineage: [],
  source: null,
  error: null,
  revealKey: 0,
  restored: false,
};

/** Build the initial state, rehydrating from a saved session when one exists. */
function initState(): EnhancerState {
  const saved = loadSession('a');
  if (!saved) return INITIAL;
  return {
    status: 'ready',
    cards: saved.cards,
    lineage: saved.lineage,
    source: saved.source,
    error: null,
    revealKey: 0,
    restored: true,
  };
}

/**
 * Owns all enhancement state for Concept A.
 * `enhance` starts a fresh chain from a typed seed; `evolve` continues the
 * existing lineage from a chosen card. Both share one in-flight guard.
 *
 * The last successful result is persisted (and rehydrated on mount) via the
 * shared session storage, namespaced to concept 'a'. All storage access is
 * guarded internally, so restoring never crashes on empty/old/malformed data.
 */
export function useEnhancer() {
  const [state, setState] = useState<EnhancerState>(initState);

  // Keep the latest lineage available to callbacks without re-creating them,
  // so `evolve` stays referentially stable across renders.
  const lineageRef = useRef(state.lineage);
  useEffect(() => {
    lineageRef.current = state.lineage;
  }, [state.lineage]);

  const run = useCallback(async (seed: string, lineage: string[]) => {
    setState((s) => ({ ...s, status: 'loading', error: null, restored: false }));
    try {
      const result: EnhanceResult = await enhanceIdea(seed, lineage);
      saveSession('a', result);
      setState((s) => ({
        status: 'ready',
        cards: result.cards,
        lineage: result.lineage,
        source: result.source,
        error: null,
        revealKey: s.revealKey + 1,
        restored: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went sideways. Try again.';
      setState((s) => ({ ...s, status: 'error', error: message, restored: false }));
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
      void run(`${card.name} — ${card.tagline}`, lineageRef.current);
    },
    [run],
  );

  const reset = useCallback(() => {
    clearSession('a');
    setState(INITIAL);
  }, []);

  return { state, enhance, evolve, reset };
}
