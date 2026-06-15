import { useCallback, useRef, useState } from 'react';
import type { IdeaCard } from '../../shared/types';
import { DIRECTION_MAP } from '../../shared/directions';

/** Format a single card into clean, shareable plain text. */
function formatCard(card: IdeaCard): string {
  const meta = DIRECTION_MAP[card.direction];
  return [
    `${card.name}`,
    `${card.tagline}`,
    ``,
    `Direction: ${meta.label}`,
    `Twist: ${card.twist}`,
    `Who it's for: ${card.audience}`,
    `How it makes money: ${card.businessModel}`,
    `Weekend MVP: ${card.weekendMvp}`,
    `Biggest risk: ${card.biggestRisk}`,
  ].join('\n');
}

/** Format the whole set — the seed plus all four directions — for sharing. */
function formatSet(seed: string, cards: IdeaCard[]): string {
  const header = [`Idea: ${seed}`, `Four directions from Idea Enhancer:`, ``];
  const body = cards.map((c) => formatCard(c)).join('\n\n———\n\n');
  return [...header, body].join('\n');
}

type ShareStatus = 'idle' | 'copied' | 'shared';

/**
 * Share/copy helper. Prefers the native share sheet when present, otherwise
 * falls back to the clipboard with a brief confirmation. Both paths are guarded
 * for environments that expose neither. `share` handles one card; `shareSet`
 * handles the whole result set with the identical guarded pattern.
 */
export function useShare() {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((next: ShareStatus) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1800);
  }, []);

  /** Core guarded share: try native share, then clipboard, then give up. */
  const shareText = useCallback(
    async (title: string, text: string) => {
      const nav = typeof navigator !== 'undefined' ? navigator : undefined;

      if (nav?.share) {
        try {
          await nav.share({ title, text });
          flash('shared');
          return;
        } catch {
          // User dismissed the sheet, or share failed — fall through to copy.
        }
      }

      if (nav?.clipboard?.writeText) {
        try {
          await nav.clipboard.writeText(text);
          flash('copied');
          return;
        } catch {
          // Clipboard blocked — nothing more we can safely do.
        }
      }
    },
    [flash],
  );

  const share = useCallback(
    (card: IdeaCard) => shareText(card.name, formatCard(card)),
    [shareText],
  );

  const shareSet = useCallback(
    (seed: string, cards: IdeaCard[]) =>
      shareText(`Idea Enhancer — ${seed}`, formatSet(seed, cards)),
    [shareText],
  );

  return { status, share, shareSet };
}
