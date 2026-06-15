import type { EnhanceResult, IdeaCard } from './types';

// Deterministic fallback generator. Used when /api/enhance is unavailable
// (no API key, or local dev with no serverless runtime) so both concepts are
// fully demoable. Same seed in -> same cards out, so the UI never flickers.

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function titleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

const SUFFIXES = ['Lite', 'Now', 'Loop', 'Kit', 'HQ', 'Lab', 'Flow', 'Pilot'];
const BIG_PREFIXES = ['Hyper', 'Open', 'Super', 'Every', 'One'];
const ODD_WORDS = ['Backwards', 'Anti', 'Slow', 'Quiet', 'Tiny'];

function build(seed: string): IdeaCard[] {
  const h = hash(seed.toLowerCase());
  const t = titleCase(seed).slice(0, 40);
  const short = t.split(' ').slice(0, 2).join(' ') || 'It';

  return [
    {
      direction: 'focused',
      name: `${short} ${pick(SUFFIXES, h)}`,
      tagline: 'The 20% of the idea that delivers 80% of the value.',
      twist: `Cut everything except the single action that makes "${seed.trim()}" useful, and ship only that.`,
      audience: 'Early adopters who feel the pain today and want it solved this week, not this quarter.',
      businessModel: 'Free to try; one simple paid tier the moment people rely on it daily.',
      weekendMvp: 'A single-screen app: one input, one output, no accounts, no settings.',
      biggestRisk: 'So minimal it looks unremarkable — the magic has to live in how well the one thing works.',
    },
    {
      direction: 'tenx',
      name: `${pick(BIG_PREFIXES, h)}${short.replace(/\s/g, '')}`,
      tagline: `What if every team on earth ran on "${short}"?`,
      twist: 'Turn the one-off tool into the default platform others build on top of — an ecosystem, not a feature.',
      audience: 'Starts with power users, expands to whole organizations and then their partners.',
      businessModel: 'Seat-based SaaS plus a marketplace / API that takes a cut of everything built on it.',
      weekendMvp: 'Nail the single most viral workflow first; the platform story comes after people are hooked.',
      biggestRisk: 'Scope is enormous — easy to build a shallow everything and a deep nothing.',
    },
    {
      direction: 'contrarian',
      name: `${pick(ODD_WORDS, h)} ${short}`,
      tagline: 'Everyone does it one way. Do the opposite — on purpose.',
      twist: `Invert the core assumption behind "${seed.trim()}": what most people treat as the goal, treat as the thing to remove.`,
      audience: 'People underserved or actively annoyed by how the mainstream version works.',
      businessModel: 'A sharp, opinionated paid product for a niche that will happily pay to feel understood.',
      weekendMvp: 'A manifesto landing page plus the smallest proof that the contrarian take actually works.',
      biggestRisk: 'Contrarian can mean "wrong" — you need a real reason the consensus is leaving value on the table.',
    },
    {
      direction: 'moneymaker',
      name: `${short} Pro`,
      tagline: 'Same idea, but the path to revenue is impossible to miss.',
      twist: 'Aim it where budgets already exist — attach the idea to a workflow someone is paid to get right.',
      audience: 'A specific business buyer with a line-item budget and a number they are measured on.',
      businessModel: 'Higher-priced B2B tiers, annual contracts, and usage-based add-ons for heavy accounts.',
      weekendMvp: 'A concierge MVP: do the work manually for 3 paying customers before automating anything.',
      biggestRisk: 'Chasing revenue early can sand off the spark that made the idea worth doing at all.',
    },
  ];
}

export function mockEnhance(seed: string, lineage: string[] = []): EnhanceResult {
  const trimmed = seed.trim();
  return {
    seed: trimmed,
    cards: build(trimmed),
    lineage: [...lineage, trimmed],
  };
}
