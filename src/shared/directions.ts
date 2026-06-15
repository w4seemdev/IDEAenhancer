import type { DirectionKey, DirectionMeta } from './types';

/** The four divergent directions every seed is expanded into. */
export const DIRECTIONS: DirectionMeta[] = [
  {
    key: 'focused',
    label: 'Focused MVP',
    emoji: '🎯',
    blurb: 'Stripped to the core — ship it this weekend.',
    accent: 'emerald',
  },
  {
    key: 'tenx',
    label: 'The 10x',
    emoji: '🚀',
    blurb: 'What if this were huge?',
    accent: 'violet',
  },
  {
    key: 'contrarian',
    label: 'The Contrarian',
    emoji: '🤿',
    blurb: 'The weird, against-the-grain version.',
    accent: 'amber',
  },
  {
    key: 'moneymaker',
    label: 'The Money-Maker',
    emoji: '💰',
    blurb: 'The version with an obvious business model.',
    accent: 'rose',
  },
];

export const DIRECTION_MAP: Record<DirectionKey, DirectionMeta> = Object.fromEntries(
  DIRECTIONS.map((d) => [d.key, d]),
) as Record<DirectionKey, DirectionMeta>;
