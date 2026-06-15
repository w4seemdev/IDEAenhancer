/**
 * Calm loading placeholder mirroring the card layout. A gentle pulse only —
 * no spinners, no flash.
 */
export function CardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col rounded-xl border-l-2 border-stone-200 bg-white/60 p-6 shadow-sm ring-1 ring-stone-100 motion-safe:animate-pulse sm:p-7"
    >
      <div className="h-3 w-24 rounded bg-stone-200" />
      <div className="mt-4 h-6 w-3/4 rounded bg-stone-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-stone-100" />
      <div className="mt-6 space-y-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-20 rounded bg-stone-200" />
            <div className="h-3.5 w-full rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
