'use client';

import { ToneType, getToneLabel } from '@/types';

interface ToneSelectorProps {
  tone: ToneType;
  onOpen: () => void;
}

export default function ToneSelector({ tone, onOpen }: ToneSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[#475569] shrink-0">
        トーン：
      </span>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex-1 md:flex-none md:min-w-[280px] flex items-center justify-between gap-2 rounded-lg bg-[#f1f5f9] border border-[#cbd5e1] px-4 py-2.5 text-[#1e3a5f] font-bold text-sm hover:bg-[#e2e8f0] transition-colors"
      >
        <span>{getToneLabel(tone)}</span>
        <svg
          className="w-4 h-4 shrink-0 text-[#64748b]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
