import type { DirectionKey } from '../../shared/types';

/**
 * One restrained accent per direction. We keep static class strings (rather
 * than building them from the `accent` token at runtime) so Tailwind's JIT can
 * see every class. The palette stays muted — a single hue per card, used only
 * for the rule, the label, and the focus ring.
 */
export interface Accent {
  /** Text color for the small direction label. */
  text: string;
  /** Left border / rule that anchors the card. */
  rule: string;
  /** Soft tint behind the direction marker. */
  dot: string;
}

const ACCENTS: Record<DirectionKey, Accent> = {
  focused: {
    text: 'text-emerald-700',
    rule: 'border-emerald-600/70',
    dot: 'bg-emerald-600',
  },
  tenx: {
    text: 'text-violet-700',
    rule: 'border-violet-600/70',
    dot: 'bg-violet-600',
  },
  contrarian: {
    text: 'text-amber-700',
    rule: 'border-amber-600/70',
    dot: 'bg-amber-600',
  },
  moneymaker: {
    text: 'text-rose-700',
    rule: 'border-rose-600/70',
    dot: 'bg-rose-600',
  },
};

export function accentFor(direction: DirectionKey): Accent {
  return ACCENTS[direction];
}
