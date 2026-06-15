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

const SYSTEM = `You are an idea-enhancement engine. Given a small seed idea, you expand it into exactly FOUR divergent, fully-developed product concepts — one per direction:

- focused  (🎯 The Focused MVP): strip the idea to its core; the version you could ship this weekend.
- tenx      (🚀 The 10x): the ambitious, platform-scale version — what if this were huge.
- contrarian (🤿 The Contrarian): invert a core assumption; the weird, against-the-grain take.
- moneymaker (💰 The Money-Maker): the version with the most obvious, defensible path to revenue.

Rules:
- Be concrete and specific to THIS seed — never generic startup boilerplate.
- Each concept must be genuinely distinct from the others, not the same idea reworded.
- Names should be short and brandable. Taglines: one punchy sentence.
- Keep every field tight (1–2 sentences). No markdown, no emoji inside field values.
- Always call the emit_ideas tool with all four directions, in the order above.`;

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
  const lineage: string[] = Array.isArray(req.body?.lineage) ? req.body.lineage : [];

  const userText =
    lineage.length > 0
      ? `Evolution chain so far (oldest first): ${lineage.join(' -> ')}\n\nNow enhance this current idea further:\n"${seed}"`
      : `Seed idea:\n"${seed}"`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
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
