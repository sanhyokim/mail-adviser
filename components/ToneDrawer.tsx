'use client';

import { useEffect, useRef } from 'react';
import { TONE_OPTIONS, ToneType } from '@/types';

interface ToneDrawerProps {
  isOpen: boolean;
  tone: ToneType;
  onSelect: (tone: ToneType) => void;
  onClose: () => void;
}

export default function ToneDrawer({
  isOpen,
  tone,
  onSelect,
  onClose,
}: ToneDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ドロワー開閉時のbodyスクロールロック
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
      closeButtonRef.current?.focus();
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isOpen]);

  // Escキーで閉じる + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ドロワー本体 */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="トーンを選択"
        className={`fixed top-0 right-0 z-50 h-full w-[80vw] max-w-[300px] md:w-[320px] md:max-w-[320px] bg-white shadow-[-4px_0_16px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-bold text-[#1e3a5f]">トーンを選択</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
          >
            ✕
          </button>
        </div>

        <ul className="py-2" role="listbox" aria-label="トーン一覧">
          {TONE_OPTIONS.map((option) => {
            const selected = option.value === tone;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => onSelect(option.value)}
                  className={`w-full text-left px-4 py-3 border-l-4 transition-colors ${
                    selected
                      ? 'border-[#2563eb] bg-[#eff6ff]'
                      : 'border-transparent hover:bg-[#f8fafc]'
                  }`}
                >
                  <span className="block font-bold text-base text-[#1e3a5f]">
                    {option.label}
                  </span>
                  <span className="block text-[13px] text-[#64748b] mt-0.5">
                    {option.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
