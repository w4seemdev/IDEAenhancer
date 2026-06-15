import { Link } from 'react-router-dom';

// Lightweight chooser so the two design concepts can be compared side by side.
// Owned by the orchestrator (not the build agents).
export default function Home() {
  return (
    <div className="min-h-full bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center gap-10 px-6 py-20">
      <div className="text-center max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Idea Enhancer</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold">
          Type a small idea. Get four bigger, better ones.
        </h1>
        <p className="mt-4 text-neutral-400">
          Two design concepts of the same product. Open each and compare.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <Link
          to="/a"
          className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition-colors"
        >
          <div className="text-2xl font-semibold">Concept A</div>
          <div className="mt-1 text-neutral-400">Playful · arcade · shareable</div>
          <div className="mt-4 text-sm text-neutral-500 group-hover:text-neutral-300">Open /a →</div>
        </Link>
        <Link
          to="/b"
          className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-600 transition-colors"
        >
          <div className="text-2xl font-semibold">Concept B</div>
          <div className="mt-1 text-neutral-400">Calm · editorial · pro tool</div>
          <div className="mt-4 text-sm text-neutral-500 group-hover:text-neutral-300">Open /b →</div>
        </Link>
      </div>
    </div>
  );
}
