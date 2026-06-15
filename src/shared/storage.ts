import type { EnhanceResult, IdeaCard } from './types';

// Session persistence for the last enhancement result, namespaced per concept
// ('a' | 'b') so the two demos never clobber each other. Everything here is
// fully guarded: storage access can throw (private mode, disabled cookies, SSR,
// quota) and we must NEVER let that break the UI. On any failure we no-op or
// return null.

export type SessionKey = 'a' | 'b';

const PREFIX = 'idea-enhancer:session:';
const VALID_DIRECTIONS = new Set(['focused', 'tenx', 'contrarian', 'moneymaker']);

/** Resolve localStorage defensively — returns null when it is unavailable. */
function store(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    // Accessing localStorage itself can throw (e.g. sandboxed iframes).
    return null;
  }
}

function keyFor(key: SessionKey): string {
  return `${PREFIX}${key}`;
}

function isCard(value: unknown): value is IdeaCard {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.direction === 'string' &&
    VALID_DIRECTIONS.has(c.direction) &&
    typeof c.name === 'string' &&
    typeof c.tagline === 'string' &&
    typeof c.twist === 'string' &&
    typeof c.audience === 'string' &&
    typeof c.businessModel === 'string' &&
    typeof c.weekendMvp === 'string' &&
    typeof c.biggestRisk === 'string'
  );
}

/** Validate the parsed JSON is a well-formed EnhanceResult before trusting it. */
function isEnhanceResult(value: unknown): value is EnhanceResult {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.seed === 'string' &&
    Array.isArray(r.lineage) &&
    r.lineage.every((s) => typeof s === 'string') &&
    (r.source === 'live' || r.source === 'mock') &&
    Array.isArray(r.cards) &&
    r.cards.length === 4 &&
    r.cards.every(isCard)
  );
}

/** Persist a result for the given concept. No-ops if storage is unavailable. */
export function saveSession(key: SessionKey, result: EnhanceResult): void {
  const s = store();
  if (!s) return;
  try {
    s.setItem(keyFor(key), JSON.stringify(result));
  } catch {
    // Quota exceeded or serialization failure — safe to ignore.
  }
}

/** Load a previously-saved result, or null if missing/unavailable/malformed. */
export function loadSession(key: SessionKey): EnhanceResult | null {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(keyFor(key));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isEnhanceResult(parsed) ? parsed : null;
  } catch {
    // Bad JSON or read failure — treat as absent.
    return null;
  }
}

/** Remove the saved result for a concept. No-ops if storage is unavailable. */
export function clearSession(key: SessionKey): void {
  const s = store();
  if (!s) return;
  try {
    s.removeItem(keyFor(key));
  } catch {
    // Ignore.
  }
}
