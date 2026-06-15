import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SeedInputProps {
  loading: boolean;
  error: string | null;
  onEnhance: (seed: string) => void;
}

const SLOT_EMOJIS = ['🎯', '🚀', '🤿', '💰', '✨', '🎯'];

export default function SeedInput({ loading, error, onEnhance }: SeedInputProps) {
  const [seed, setSeed] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onEnhance(seed);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor="a-seed" className="block text-sm font-semibold text-white/70 mb-2">
        Drop a tiny idea — we'll spin up four wild versions
      </label>

      <div
        className={clsx(
          'group relative rounded-2xl p-[2px] transition',
          'bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-500',
          'shadow-lg shadow-violet-900/30',
        )}
      >
        <div className="rounded-[14px] bg-slate-950/90 p-3 sm:p-4">
          <textarea
            id="a-seed"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e);
            }}
            placeholder="e.g. an app that reminds me to water my plants"
            rows={2}
            aria-describedby={error ? 'a-seed-error' : undefined}
            aria-invalid={Boolean(error)}
            className={clsx(
              'w-full resize-none bg-transparent text-lg text-white placeholder:text-white/55',
              'outline-none',
            )}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="hidden text-xs text-white/55 sm:block">
              Tip: press ⌘/Ctrl + Enter to launch
            </span>
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'a-press inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold',
                'bg-gradient-to-r from-emerald-400 via-violet-500 to-rose-500 text-white',
                'shadow-lg shadow-violet-900/40 disabled:opacity-70',
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

      {error && (
        <p id="a-seed-error" role="alert" className="mt-3 text-sm font-medium text-rose-300">
          {error}
        </p>
      )}
    </form>
  );
}
