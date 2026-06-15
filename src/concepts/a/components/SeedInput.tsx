import { useId } from 'react';
import { Sparkles, Loader2, Shuffle } from 'lucide-react';
import clsx from 'clsx';

interface SeedInputProps {
  /** Controlled seed text — owned by the parent so "Surprise me" can fill it. */
  value: string;
  loading: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onEnhance: (seed: string) => void;
  onSurprise: () => void;
}

const SLOT_EMOJIS = ['🎯', '🚀', '🤿', '💰', '✨', '🎯'];

export default function SeedInput({
  value,
  loading,
  error,
  onChange,
  onEnhance,
  onSurprise,
}: SeedInputProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const canSubmit = !loading && value.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onEnhance(value);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Plain Enter submits; Shift+Enter inserts a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onEnhance(value);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-white/80">
        Drop a tiny idea, we'll spin up four wild versions
      </label>

      <div
        className={clsx(
          'group relative rounded-2xl p-[2px] transition',
          'bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-500',
          'shadow-lg shadow-violet-900/30',
          'focus-within:ring-2 focus-within:ring-white/70 focus-within:ring-offset-2 focus-within:ring-offset-slate-950',
        )}
      >
        <div className="rounded-[14px] bg-slate-950/90 p-3 sm:p-4">
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. an app that reminds me to water my plants"
            rows={2}
            disabled={loading}
            aria-describedby={error ? `${errorId} ${hintId}` : hintId}
            aria-invalid={Boolean(error)}
            className={clsx(
              'w-full resize-none bg-transparent text-lg text-white placeholder:text-white/60',
              'outline-none disabled:opacity-70',
            )}
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span id={hintId} className="hidden text-xs text-white/60 sm:block">
              Tip: press Enter to launch · Shift + Enter for a new line
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSurprise}
                disabled={loading}
                className={clsx(
                  'a-press a-focus inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold',
                  'text-white/80 ring-1 ring-white/15 hover:bg-white/5 hover:text-white',
                  'disabled:opacity-60',
                )}
              >
                <Shuffle className="h-4 w-4" aria-hidden />
                Surprise me
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className={clsx(
                  'a-press a-focus inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold',
                  'bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-500 text-white',
                  'shadow-lg shadow-violet-900/40 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    <span>Spinning</span>
                    <span className="a-slot" aria-hidden>
                      <span className="a-slot-strip">
                        {SLOT_EMOJIS.map((e, i) => (
                          <span key={i}>{e}</span>
                        ))}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" aria-hidden />
                    <span>Enhance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-rose-300">
          {error}
        </p>
      )}
    </form>
  );
}
