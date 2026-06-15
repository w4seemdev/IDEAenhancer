import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowRight, Shuffle } from 'lucide-react';
import { randomExample } from '../../../shared/examples';

interface SeedInputProps {
  loading: boolean;
  error: string | null;
  onEnhance: (seed: string) => void;
}

/**
 * The seed entry: a labelled textarea + a single primary action, plus a quiet
 * "Surprise me" affordance that drops a random example into the field so a
 * first-time visitor never faces a blank box. Submitting an empty seed is
 * allowed through to enhanceIdea, which throws a friendly message we surface
 * inline. Cmd/Ctrl+Enter submits from within the textarea.
 */
export function SeedInput({ loading, error, onEnhance }: SeedInputProps) {
  const [value, setValue] = useState('');
  const fieldId = useId();
  const errorId = useId();
  const hintId = useId();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onEnhance(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter submits; Shift+Enter keeps a newline for longer ideas.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnhance(value);
    }
  }

  function surprise() {
    setValue(randomExample());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={fieldId}
          className="block font-serif text-sm tracking-wide text-stone-500"
        >
          Your idea
        </label>
        <button
          type="button"
          onClick={surprise}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-stone-500 transition hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Shuffle size={13} aria-hidden />
          Surprise me
        </button>
      </div>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="A few words is enough, e.g. “a calendar that protects deep work”"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hintId}
        className="w-full resize-none rounded-lg border border-stone-300 bg-white/70 px-4 py-3 text-lg leading-relaxed text-stone-800 placeholder:text-stone-400 shadow-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-400/40"
      />
      <div className="flex items-center justify-between gap-4">
        <p
          id={error ? errorId : hintId}
          role={error ? 'alert' : undefined}
          className={
            error
              ? 'text-sm text-rose-700'
              : 'text-sm text-stone-400'
          }
        >
          {error ?? 'Press Enter to enhance · Shift+Enter for a new line'}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Enhance'}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </button>
      </div>
    </form>
  );
}
