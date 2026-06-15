import { useCallback, useRef, useState } from 'react';
import type { IdeaCard } from '../../shared/types';
import { DIRECTION_MAP } from '../../shared/directions';

/** Format a card into clean, shareable plain text. */
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

type ShareStatus = 'idle' | 'copied' | 'shared';

/**
 * Per-card share/copy. Prefers the native share sheet when present, otherwise
 * falls back to the clipboard with a brief "Copied" confirmation. Both paths
 * are guarded for environments that expose neither.
 */
export function useShare() {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((next: ShareStatus) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1800);
  }, []);

  const share = useCallback(
    async (card: IdeaCard) => {
      const text = formatCard(card);
      const title = card.name;

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

  return { status, share };
}
