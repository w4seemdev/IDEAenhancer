import { useEffect } from 'react';
import { Check, Copy, Share2, X } from 'lucide-react';
import clsx from 'clsx';
import type { ShareOutcome } from '../share';

export interface ToastState {
  id: number;
  outcome: ShareOutcome;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

const COPY: Record<ShareOutcome, { icon: typeof Check; text: string; tone: string }> = {
  shared: { icon: Share2, text: 'Shared! 🎉', tone: 'from-emerald-500 to-teal-500' },
  copied: { icon: Copy, text: 'Copied to clipboard! 📋', tone: 'from-violet-500 to-fuchsia-500' },
  failed: { icon: X, text: "Couldn't share — copy it manually.", tone: 'from-rose-600 to-rose-500' },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDismiss, 2400);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const { icon: Icon, text, tone } = COPY[toast.outcome];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      aria-live="polite"
    >
      <div
        key={toast.id}
        className={clsx(
          'a-toast-in pointer-events-auto flex items-center gap-2 rounded-full px-5 py-3',
          'bg-gradient-to-r font-bold text-white shadow-xl shadow-black/40',
          tone,
        )}
        role="status"
      >
        <Icon className="h-5 w-5" aria-hidden />
        {text}
      </div>
    </div>
  );
}
