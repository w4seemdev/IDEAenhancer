import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

// Minimal serverless proxy for the idea-enhancement feature.
// Forces structured output via a single strict tool (`tool_choice` -> emit_ideas),
// so the response is guaranteed to match the IdeaCard[] shape the UI expects.
//
// Model: claude-opus-4-8 (best idea quality). Override with ANTHROPIC_MODEL —
// e.g. claude-sonnet-4-6 / claude-haiku-4-5 to cut cost on a free tier.
// (Idea cards are short, so output cost per call is modest.)
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// Hard caps. Seeds are one-liners; anything past this is abuse or a paste accident.
const MAX_SEED_CHARS = 600;
// Keep the evolution chain bounded so the prompt (and cost) can't grow unbounded.
const MAX_LINEAGE = 8;
// Four short cards via strict tool use fit comfortably here; bump only if cards grow.
const MAX_TOKENS = 2048;

// Simple in-memory per-IP rate limiter. Good enough for a single serverless
// instance / demo; for real scale use a shared store (KV/Redis). State resets on
// cold start, which is acceptable here.
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

/** Returns true if this IP is over the limit; records the hit otherwise. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent); // keep the window pruned even when blocking
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/** Best-effort client IP from the proxy header, falling back to the socket. */
function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown');
}

const SYSTEM = `You are an idea enhancement engine. Given a small seed idea, you expand it into exactly FOUR divergent, fully developed product concepts, one per direction:

• focused  (🎯 The Focused MVP): strip the idea to its core; the version you could ship this weekend.
• tenx      (🚀 The 10x): the ambitious, platform scale version. What if this were huge.
• contrarian (🤿 The Contrarian): invert a core assumption; the weird, against the grain take.
• moneymaker (💰 The Money Maker): the version with the most obvious, defensible path to revenue.

Rules:
• Be concrete and specific to THIS seed, never generic startup boilerplate.
• Each concept must be genuinely distinct from the others, not the same idea reworded.
• Names should be short and brandable. Taglines: one punchy sentence.
• Keep every field tight (1 to 2 sentences). No markdown, no emoji inside field values.
• Never use dashes of any kind (em dashes, en dashes, or hyphens) in any field value; rephrase to avoid them.
• Always call the emit_ideas tool with all four directions, in the order above.`;

const CARD_PROPS = {
  direction: { type: 'string', enum: ['focused', 'tenx', 'contrarian', 'moneymaker'] },
  name: { type: 'string', description: 'Short, brandable product name.' },
  tagline: { type: 'string', description: 'One punchy sentence that sells it.' },
  twist: { type: 'string', description: 'The single non-obvious insight that makes this version work.' },
  audience: { type: 'string', description: 'Who it is for, concretely.' },
  businessModel: { type: 'string', description: 'How it makes money.' },
  weekendMvp: { type: 'string', description: 'The smallest thing you could ship this weekend.' },
  biggestRisk: { type: 'string', description: 'The thing most likely to kill it.' },
} as const;

const TOOL: Anthropic.Tool = {
  name: 'emit_ideas',
  description: 'Return exactly four enhanced idea cards, one per direction.',
  // strict: true guarantees the arguments validate against this schema.
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      cards: {
        type: 'array',
        description: 'Exactly four cards: focused, tenx, contrarian, moneymaker (in that order).',
        items: {
          type: 'object',
          properties: CARD_PROPS,
          required: Object.keys(CARD_PROPS),
          additionalProperties: false,
        },
      },
    },
    required: ['cards'],
    additionalProperties: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  // Per-IP rate limit before doing any work (incl. the API key check).
  if (isRateLimited(clientIp(req))) {
    res.status(429).json({ error: 'rate_limited', detail: 'Too many requests. Wait a minute and try again.' });
    return;
  }

  // No key configured -> 501 so the client falls back to the deterministic mock.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(501).json({ error: 'no_api_key', detail: 'Set ANTHROPIC_API_KEY to enable live enhancement.' });
    return;
  }

  const seed = typeof req.body?.seed === 'string' ? req.body.seed.trim() : '';
  if (!seed) {
    res.status(400).json({ error: 'missing_seed' });
    return;
  }
  // Hard input cap: reject overly long seeds rather than silently truncating.
  if (seed.length > MAX_SEED_CHARS) {
    res.status(400).json({ error: 'seed_too_long', detail: `Keep the idea under ${MAX_SEED_CHARS} characters.` });
    return;
  }

  // Lineage cap: ignore anything beyond the most recent MAX_LINEAGE entries so the
  // prompt can't grow without bound. Non-string entries are dropped defensively.
  const lineage: string[] = (Array.isArray(req.body?.lineage) ? req.body.lineage : [])
    .filter((s: unknown): s is string => typeof s === 'string')
    .slice(-MAX_LINEAGE);

  const userText =
    lineage.length > 0
      ? `Evolution chain so far (oldest first): ${lineage.join(' → ')}\n\nNow enhance this current idea further:\n"${seed}"`
      : `Seed idea:\n"${seed}"`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'emit_ideas' },
      messages: [{ role: 'user', content: userText }],
    });

    const block = message.content.find((b) => b.type === 'tool_use');
    if (!block || block.type !== 'tool_use') {
      res.status(502).json({ error: 'no_tool_use' });
      return;
    }

    res.status(200).json(block.input);
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'unknown';
    res.status(502).json({ error: 'enhance_failed', detail });
  }
}
