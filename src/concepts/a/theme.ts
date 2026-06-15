import type { DirectionKey } from '../../shared/types';

/**
 * Per-direction visual theme for Concept A (playful / arcade).
 * Tailwind v4 with the JIT scanner can't see dynamically-built class names,
 * so every class string a card might use is spelled out as a full literal here.
 */
export interface DirectionTheme {
  /** Gradient used for the card's glow / header bar. */
  gradient: string;
  /** Solid accent text color. */
  text: string;
  /** Soft tinted background for chips / field labels. */
  chipBg: string;
  /** Ring / border color when focused or hovered. */
  ring: string;
  /** Button background. */
  button: string;
  /** Shadow color tint for the arcade glow. */
  glow: string;
}

export const THEME: Record<DirectionKey, DirectionTheme> = {
  focused: {
    gradient: 'from-emerald-400 to-teal-500',
    text: 'text-emerald-300',
    chipBg: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30',
    ring: 'ring-emerald-400/60',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950',
    glow: 'shadow-emerald-500/40',
  },
  tenx: {
    gradient: 'from-violet-500 to-fuchsia-500',
    text: 'text-violet-300',
    chipBg: 'bg-violet-500/15 text-violet-200 ring-violet-400/30',
    ring: 'ring-violet-400/60',
    button: 'bg-violet-500 hover:bg-violet-400 text-violet-950',
    glow: 'shadow-violet-500/40',
  },
  contrarian: {
    gradient: 'from-amber-400 to-orange-500',
    text: 'text-amber-300',
    chipBg: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
    ring: 'ring-amber-400/60',
    button: 'bg-amber-400 hover:bg-amber-300 text-amber-950',
    glow: 'shadow-amber-500/40',
  },
  moneymaker: {
    gradient: 'from-rose-500 to-pink-500',
    text: 'text-rose-300',
    chipBg: 'bg-rose-500/15 text-rose-200 ring-rose-400/30',
    ring: 'ring-rose-400/60',
    button: 'bg-rose-500 hover:bg-rose-400 text-rose-950',
    glow: 'shadow-rose-500/40',
  },
};
