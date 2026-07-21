'use client';

interface ClearButtonProps {
  onClick: () => void;
}

export default function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="w-full md:w-auto md:min-w-[280px] rounded-lg border border-[#e2e8f0] py-2.5 px-4 text-sm text-[#6b7280] hover:bg-[#f1f5f9] transition-colors"
      >
        🗑️ クリアして新規作成
      </button>
    </div>
  );
}
