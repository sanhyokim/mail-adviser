'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'warning';
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({
  message,
  type,
  onDismiss,
  durationMs = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="alert"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-32px)] max-w-[480px] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg view-fade ${
        type === 'error' ? 'bg-red-600' : 'bg-amber-500'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="通知を閉じる"
          className="shrink-0 opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
