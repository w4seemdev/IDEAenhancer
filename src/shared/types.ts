// The shared contract both design concepts (A and B) build against.
// Do not change these shapes without updating api/enhance.ts and the mock.

export type DirectionKey = 'focused' | 'tenx' | 'contrarian' | 'moneymaker';

/** One enhanced "idea card" — the unit both concepts render. */
export interface IdeaCard {
  direction: DirectionKey;
  /** A short, brandable product name. */
  name: string;
  /** One punchy sentence that sells it. */
  tagline: string;
  /** The single non-obvious insight that makes this version work. */
  twist: string;
  /** Who it's for, concretely. */
  audience: string;
  /** How it makes money. */
  businessModel: string;
  /** The smallest thing you could ship this weekend. */
  weekendMvp: string;
  /** The thing most likely to kill it. */
  biggestRisk: string;
}

/** The result of enhancing one seed idea: four divergent cards + the lineage chain. */
export interface EnhanceResult {
  /** The seed that produced these cards. */
  seed: string;
  /** Exactly four cards, one per DirectionKey. */
  cards: IdeaCard[];
  /** Seeds in evolution order, oldest first, this seed last. */
  lineage: string[];
}

/** Display metadata for each of the four directions. */
export interface DirectionMeta {
  key: DirectionKey;
  label: string;
  emoji: string;
  blurb: string;
  /** A tailwind color family name (e.g. "emerald") concepts may use for theming. */
  accent: string;
}
