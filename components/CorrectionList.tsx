'use client';

import { useState } from 'react';

interface CorrectionListProps {
  corrections: string[];
}

export default function CorrectionList({ corrections }: CorrectionListProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section aria-label="推敲ポイント" className="rounded-lg bg-white border border-[#e2e8f0]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="correction-list-body"
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-bold text-[#334155]">📝 推敲ポイント</span>
        <svg
          className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul
          id="correction-list-body"
          className="px-4 pb-4 space-y-2"
        >
          {corrections.map((correction, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-[#475569]"
            >
              <span className="text-[#2563eb] shrink-0" aria-hidden="true">
                •
              </span>
              <span>{correction}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
