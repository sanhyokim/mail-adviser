'use client';

import { useCallback, useEffect, useRef } from 'react';
import { MAX_MESSAGE_LENGTH } from '@/types';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minRows: number;
  maxRows: number;
  variant?: 'white' | 'gray';
}

const LINE_HEIGHT_PX = 24;
const VERTICAL_PADDING_PX = 24;

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  minRows,
  maxRows,
  variant = 'white',
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 内容に応じてテキストエリアを自動伸長（minRows〜maxRows）
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = minRows * LINE_HEIGHT_PX + VERTICAL_PADDING_PX;
    const maxH = maxRows * LINE_HEIGHT_PX + VERTICAL_PADDING_PX;
    const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
  }, [minRows, maxRows]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 文字数上限超過時は入力を受け付けない
    onChange(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#334155] mb-1.5"
      >
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={minRows}
        maxLength={MAX_MESSAGE_LENGTH}
        className={`w-full rounded-lg border border-[#cbd5e1] px-3 py-3 text-base leading-6 text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none ${
          variant === 'gray' ? 'bg-[#f1f5f9]' : 'bg-white'
        }`}
      />
      <p
        className="text-right text-xs text-[#94a3b8] mt-1"
        aria-live="polite"
      >
        {value.length} / {MAX_MESSAGE_LENGTH}
      </p>
    </div>
  );
}
