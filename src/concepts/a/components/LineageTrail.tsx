import { ChevronRight, Flag, Zap } from 'lucide-react';
import clsx from 'clsx';

interface LineageTrailProps {
  lineage: string[];
}

/** A fun arcade "level map" breadcrumb of the evolution chain. */
export default function LineageTrail({ lineage }: LineageTrailProps) {
  if (lineage.length === 0) return null;

  return (
    <nav aria-label="Idea evolution trail" className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/60">
          <Flag className="h-3.5 w-3.5" aria-hidden />
          Trail
        </span>

        {lineage.map((seed, i) => {
          const isLast = i === lineage.length - 1;
          return (
            <div key={`${i}-${seed}`} className="flex shrink-0 items-center gap-2">
              <span
                className={clsx(
                  'rounded-full px-3 py-1 text-xs font-semibold ring-1 transition',
                  isLast
                    ? 'bg-gradient-to-r from-violet-500/30 to-rose-500/30 text-white ring-white/30'
                    : 'bg-white/5 text-white/60 ring-white/10',
                )}
                title={seed}
              >
                <span className="inline-block max-w-[10rem] truncate align-bottom sm:max-w-[16rem]">
                  {seed}
                </span>
              </span>
              {!isLast && <ChevronRight className="h-4 w-4 shrink-0 text-white/40" aria-hidden />}
            </div>
          );
        })}

        <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30">
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Evolve any card to go deeper
        </span>
      </div>
    </nav>
  );
}
