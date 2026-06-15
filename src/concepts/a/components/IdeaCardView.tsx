import { Lightbulb, Users, DollarSign, Rocket, AlertTriangle, ArrowRight, Share2 } from 'lucide-react';
import clsx from 'clsx';
import type { IdeaCard } from '../../../shared/types';
import { DIRECTION_MAP } from '../../../shared/directions';
import { THEME } from '../theme';

interface IdeaCardViewProps {
  card: IdeaCard;
  index: number;
  loading: boolean;
  onEvolve: (card: IdeaCard) => void;
  onShare: (card: IdeaCard) => void;
}

const FIELDS: { key: keyof IdeaCard; label: string; icon: typeof Lightbulb }[] = [
  { key: 'twist', label: 'The twist', icon: Lightbulb },
  { key: 'audience', label: "Who it's for", icon: Users },
  { key: 'businessModel', label: 'How it makes money', icon: DollarSign },
  { key: 'weekendMvp', label: 'Weekend MVP', icon: Rocket },
  { key: 'biggestRisk', label: 'Biggest risk', icon: AlertTriangle },
];

export default function IdeaCardView({ card, index, loading, onEvolve, onShare }: IdeaCardViewProps) {
  const meta = DIRECTION_MAP[card.direction];
  const theme = THEME[card.direction];

  return (
    <article
      className={clsx(
        'a-pop-in group relative flex flex-col overflow-hidden rounded-3xl',
        'border border-white/10 bg-slate-900/70 backdrop-blur',
        'shadow-xl transition hover:-translate-y-1 hover:shadow-2xl',
        theme.glow,
      )}
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* Glowing header strip */}
      <div className={clsx('h-1.5 w-full bg-gradient-to-r', theme.gradient)} />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <header className="flex items-start gap-3">
          <span
            className={clsx(
              'a-float grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl',
              'bg-gradient-to-br shadow-lg',
              theme.gradient,
            )}
            aria-hidden
          >
            {meta.emoji}
          </span>
          <div className="min-w-0">
            <p className={clsx('text-xs font-bold uppercase tracking-wider', theme.text)}>
              {meta.label}
            </p>
            <h3 className="truncate text-xl font-extrabold text-white">{card.name}</h3>
          </div>
        </header>

        <p className="text-base font-medium leading-snug text-white/85">{card.tagline}</p>

        <dl className="flex flex-col gap-3">
          {FIELDS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex gap-2.5">
              <span
                className={clsx(
                  'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1',
                  theme.chipBg,
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <dt className={clsx('text-[11px] font-bold uppercase tracking-wide', theme.text)}>
                  {label}
                </dt>
                <dd className="text-sm leading-snug text-white/75">{card[key]}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEvolve(card)}
            disabled={loading}
            className={clsx(
              'a-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5',
              'font-bold disabled:opacity-60',
              theme.button,
            )}
          >
            Evolve this
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onShare(card)}
            aria-label={`Share ${card.name}`}
            className={clsx(
              'a-press inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5',
              'font-semibold text-white ring-1 ring-white/15 hover:bg-white/10',
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
