/**
 * All the playful keyframes for Concept A live here as a single inline <style>.
 * No animation libraries — just CSS. Classes are referenced from components.
 */
export default function ArcadeStyles() {
  return (
    <style>{`
      @keyframes a-pop-in {
        0%   { opacity: 0; transform: translateY(28px) scale(0.94) rotate(-1.5deg); }
        60%  { opacity: 1; transform: translateY(-6px) scale(1.02) rotate(0.5deg); }
        100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
      }
      @keyframes a-slot-spin {
        0%   { transform: translateY(0); }
        100% { transform: translateY(-66.666%); }
      }
      @keyframes a-float {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-6px); }
      }
      @keyframes a-shimmer {
        0%   { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes a-confetti-fall {
        0%   { transform: translateY(-10%) rotate(0deg); opacity: 1; }
        100% { transform: translateY(120vh) rotate(540deg); opacity: 0; }
      }
      @keyframes a-toast-in {
        0%   { opacity: 0; transform: translateY(16px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      .a-pop-in { animation: a-pop-in 0.55s cubic-bezier(0.18, 0.89, 0.32, 1.28) both; }
      .a-float  { animation: a-float 4s ease-in-out infinite; }
      .a-toast-in { animation: a-toast-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) both; }

      .a-gradient-text {
        background-image: linear-gradient(110deg,#34d399,#a78bfa,#fbbf24,#f472b6,#34d399);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: a-shimmer 6s linear infinite;
      }

      /* Slot machine: a vertical strip of emojis that spins while loading. */
      .a-slot {
        height: 1.4em;
        line-height: 1.4em;
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
      }
      .a-slot-strip {
        display: flex;
        flex-direction: column;
        animation: a-slot-spin 0.45s steps(6) infinite;
      }

      .a-press { transition: transform 0.12s ease, box-shadow 0.2s ease, filter 0.2s ease; }
      .a-press:hover { transform: translateY(-2px); }
      .a-press:active { transform: translateY(1px) scale(0.98); }

      /* Consistent, high-contrast focus ring for keyboard users on dark bg. */
      .a-focus:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px #020617, 0 0 0 4px #ffffff;
      }

      @media (prefers-reduced-motion: reduce) {
        .a-pop-in, .a-float, .a-toast-in, .a-gradient-text, .a-slot-strip {
          animation: none !important;
        }
        .a-press { transition: none; }
        .a-press:hover, .a-press:active { transform: none; }
      }
    `}</style>
  );
}
