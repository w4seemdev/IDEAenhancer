import { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * A subtle, dismissible "demo mode" badge shown only when the current result
 * came from the offline mock (source === 'mock'). It explains how to get live
 * AI ideas without nagging — once dismissed it stays gone for the session.
 */
export default function DemoBadge() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="note"
      className={clsx(
        'mx-auto inline-flex items-center gap-2 rounded-full py-1.5 pl-3.5 pr-2',
        'bg-amber-400/10 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25',
      )}
    >
      <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        Demo mode: add an API key for live AI ideas
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo mode notice"
        className="a-focus grid h-5 w-5 shrink-0 place-items-center rounded-full text-amber-200/70 hover:bg-amber-400/20 hover:text-amber-100"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
