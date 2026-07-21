'use client';

import { useEffect, useRef, useState } from 'react';

interface ResultCardProps {
  message: string;
  onEdit: () => void;
}

export default function ResultCard({ message, onEdit }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボード非対応環境では何もしない
    }
  };

  return (
    <section aria-label="完成文章">
      <h2 className="text-sm font-bold text-[#334155] mb-2">✉️ 完成文章</h2>
      <div className="rounded-lg bg-[#eff6ff] border border-[#bfdbfe] p-4">
        <p className="whitespace-pre-wrap text-[16px] md:text-[17px] leading-relaxed text-[#1e293b] select-text">
          {message}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 min-w-[130px] rounded-lg py-2.5 px-3 text-white font-bold text-sm transition-colors ${
              copied
                ? 'bg-[#16a34a]'
                : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
            }`}
          >
            {copied ? '✅ コピーしました！' : '📋 コピー'}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 min-w-[130px] rounded-lg py-2.5 px-3 bg-white border border-[#cbd5e1] text-[#374151] font-bold text-sm hover:bg-[#f8fafc] transition-colors"
          >
            ✏️ 修正する
          </button>
        </div>
      </div>
    </section>
  );
}
