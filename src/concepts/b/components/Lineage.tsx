interface LineageProps {
  lineage: string[];
}

/**
 * The evolution chain as a quiet vertical timeline. Oldest seed first, the
 * current one emphasized at the end. Understated — just a rule, dots, and text.
 */
export function Lineage({ lineage }: LineageProps) {
  if (lineage.length === 0) return null;

  return (
    <nav aria-label="Idea lineage" className="text-sm">
      <h2 className="mb-4 font-serif text-base text-stone-700">Lineage</h2>
      <ol className="relative space-y-4 border-l border-stone-200 pl-5">
        {lineage.map((seed, i) => {
          const current = i === lineage.length - 1;
          return (
            <li key={`${i}-${seed}`} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full ring-2 ring-stone-50 ${
                  current ? 'bg-stone-900' : 'bg-stone-300'
                }`}
              />
              <p
                className={`leading-snug ${
                  current ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                {seed}
              </p>
              {current && (
                <span className="mt-1 inline-block text-xs uppercase tracking-wider text-stone-400">
                  Current
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
