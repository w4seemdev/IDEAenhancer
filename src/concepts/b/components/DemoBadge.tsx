import { Info } from 'lucide-react';

/**
 * A quiet, on-brand notice shown only when the current cards came from the
 * offline mock (source === 'mock'). Static and understated — a small inline
 * note rather than a banner — so it informs without nagging. Rendered by the
 * parent only in the mock case, so it self-hides for live results.
 */
export function DemoBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/70 px-3 py-1 text-xs text-stone-500"
      title="These ideas are generated locally. Add an API key for live AI ideas."
    >
      <Info size={13} className="text-stone-400" aria-hidden />
      <span>
        Demo mode
        <span className="text-stone-400">: add an API key for live AI ideas</span>
      </span>
    </span>
  );
}
