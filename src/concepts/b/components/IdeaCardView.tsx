import { Check, GitBranch, Share2 } from 'lucide-react';
import type { IdeaCard } from '../../../shared/types';
import { DIRECTION_MAP } from '../../../shared/directions';
import { accentFor } from '../accents';
import { useShare } from '../useShare';

interface IdeaCardViewProps {
  card: IdeaCard;
  loading: boolean;
  onEvolve: (card: IdeaCard) => void;
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <dt className="font-serif text-xs uppercase tracking-widest text-stone-400">
        {label}
      </dt>
      <dd className="mt-1 leading-relaxed text-stone-700">{value}</dd>
    </div>
  );
}

/**
 * One refined editorial block. An accent rule + small label anchor the
 * direction; the body lays out every IdeaCard field with typographic labels.
 * Quiet Evolve and Share actions sit at the foot.
 */
export function IdeaCardView({ card, loading, onEvolve }: IdeaCardViewProps) {
  const meta = DIRECTION_MAP[card.direction];
  const accent = accentFor(card.direction);
  const { status, share } = useShare();

  return (
    <article
      className={`flex flex-col rounded-xl border-l-2 ${accent.rule} bg-white/80 p-6 shadow-sm ring-1 ring-stone-100 transition hover:shadow-md motion-reduce:transition-none sm:p-7`}
    >
      <header className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`inline-block h-1.5 w-1.5 rounded-full ${accent.dot}`}
        />
        <span
          className={`font-serif text-xs uppercase tracking-widest ${accent.text}`}
        >
          {meta.emoji} {meta.label}
        </span>
      </header>

      <h3 className="mt-3 font-serif text-2xl leading-tight text-stone-900">
        {card.name}
      </h3>
      <p className="mt-1.5 text-base italic leading-relaxed text-stone-600">
        {card.tagline}
      </p>

      <dl className="mt-6 space-y-4 text-sm">
        <Field label="Twist" value={card.twist} />
        <Field label="Who it's for" value={card.audience} />
        <Field label="How it makes money" value={card.businessModel} />
        <Field label="Weekend MVP" value={card.weekendMvp} />
        <Field label="Biggest risk" value={card.biggestRisk} />
      </dl>

      <div className="mt-7 flex items-center gap-2 border-t border-stone-100 pt-4">
        <button
          type="button"
          onClick={() => onEvolve(card)}
          disabled={loading}
          aria-label={`Evolve ${card.name} further`}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <GitBranch size={15} aria-hidden />
          Evolve
        </button>
        <button
          type="button"
          onClick={() => void share(card)}
          aria-label={`Share ${card.name}`}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 motion-reduce:transition-none"
        >
          {status === 'idle' ? (
            <>
              <Share2 size={15} aria-hidden />
              Share
            </>
          ) : (
            <>
              <Check size={15} aria-hidden />
              {status === 'shared' ? 'Shared' : 'Copied'}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
