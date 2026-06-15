import type { EnhanceResult, IdeaCard } from '../../shared/types';
import { DIRECTION_MAP } from '../../shared/directions';

/** Format a single card into a tidy, shareable block of text. */
export function formatCard(card: IdeaCard): string {
  const dir = DIRECTION_MAP[card.direction];
  return [
    `${dir.emoji} ${card.name}: ${card.tagline}`,
    '',
    `${dir.label}`,
    `• Twist: ${card.twist}`,
    `• Who it's for: ${card.audience}`,
    `• How it makes money: ${card.businessModel}`,
    `• Weekend MVP: ${card.weekendMvp}`,
    `• Biggest risk: ${card.biggestRisk}`,
    '',
    'Made with Idea Enhancer ✨',
  ].join('\n');
}

/** Format the whole set of four cards into one shareable digest. */
export function formatSet(result: EnhanceResult): string {
  const seed = result.lineage[result.lineage.length - 1] ?? result.seed;
  const blocks = result.cards.map((card) => {
    const dir = DIRECTION_MAP[card.direction];
    return [
      `${dir.emoji} ${dir.label}: ${card.name}`,
      `“${card.tagline}”`,
      `• Twist: ${card.twist}`,
      `• Who it's for: ${card.audience}`,
      `• How it makes money: ${card.businessModel}`,
      `• Weekend MVP: ${card.weekendMvp}`,
      `• Biggest risk: ${card.biggestRisk}`,
    ].join('\n');
  });

  return [`💡 4 ways to build "${seed}"`, '', blocks.join('\n\n'), '', 'Made with Idea Enhancer ✨'].join(
    '\n',
  );
}

export type ShareOutcome = 'shared' | 'copied' | 'failed';

/**
 * Try the native share sheet first; fall back to clipboard copy.
 * Both APIs are feature-detected so this is safe in any environment.
 */
export async function shareText(title: string, text: string): Promise<ShareOutcome> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;

  if (nav && typeof nav.share === 'function') {
    try {
      await nav.share({ title, text });
      return 'shared';
    } catch {
      // User dismissed the sheet, or share rejected — fall through to copy.
    }
  }

  if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
    try {
      await nav.clipboard.writeText(text);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
