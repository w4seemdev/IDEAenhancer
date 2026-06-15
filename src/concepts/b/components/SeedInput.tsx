import { useId, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

interface SeedInputProps {
  loading: boolean;
  error: string | null;
  onEnhance: (seed: string) => void;
}

/**
 * The seed entry: a labelled textarea + a single primary action. Submitting an
 * empty seed is allowed through to enhanceIdea, which throws a friendly message
 * that we surface inline.
 */
export function SeedInput({ loading, error, onEnhance }: SeedInputProps) {
  const [value, setValue] = useState('');
  const fieldId = useId();
  const errorId = useId();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onEnhance(value);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor={fieldId}
        className="block font-serif text-sm tracking-wide text-stone-500"
      >
        Your idea
      </label>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="A few words is enough — e.g. “a calendar that protects deep work”"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="w-full resize-none rounded-lg border border-stone-300 bg-white/70 px-4 py-3 text-lg leading-relaxed text-stone-800 placeholder:text-stone-400 shadow-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-400/40"
      />
      <div className="flex items-center justify-between gap-4">
        <p
          id={errorId}
          role={error ? 'alert' : undefined}
          className={`text-sm text-rose-700 transition-opacity duration-300 ${
            error ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {error ?? ' '}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Enhance'}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </button>
      </div>
    </form>
  );
}
