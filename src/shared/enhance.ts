import type { EnhanceResult, IdeaCard } from './types';
import { mockEnhance } from './mock';

const VALID_DIRECTIONS = new Set(['focused', 'tenx', 'contrarian', 'moneymaker']);

function looksValid(cards: unknown): cards is IdeaCard[] {
  return (
    Array.isArray(cards) &&
    cards.length === 4 &&
    cards.every(
      (c) =>
        c &&
        typeof c === 'object' &&
        VALID_DIRECTIONS.has((c as IdeaCard).direction) &&
        typeof (c as IdeaCard).name === 'string',
    )
  );
}

/**
 * Enhance a seed idea into four divergent cards.
 *
 * Calls the /api/enhance Claude proxy when available; falls back to the
 * deterministic mock generator otherwise (no API key, or local dev with no
 * serverless runtime). Both concepts call ONLY this function — they never talk
 * to the API or the mock directly.
 *
 * @param seed    the user's raw idea text
 * @param lineage prior seeds in the evolution chain (oldest first)
 */
export async function enhanceIdea(seed: string, lineage: string[] = []): Promise<EnhanceResult> {
  const trimmed = seed.trim();
  if (!trimmed) throw new Error('Type an idea first — even a few words works.');

  try {
    const res = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ seed: trimmed, lineage }),
    });
    if (!res.ok) throw new Error(`enhance failed: ${res.status}`);
    const data = (await res.json()) as { cards?: unknown };
    if (!looksValid(data.cards)) throw new Error('malformed response');
    return { seed: trimmed, cards: data.cards, lineage: [...lineage, trimmed] };
  } catch {
    // Graceful fallback so the experience never breaks for a demo.
    return mockEnhance(trimmed, lineage);
  }
}
