'use client';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function SubmitButton({
  isLoading,
  disabled,
  onClick,
}: SubmitButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className="w-full md:w-auto md:min-w-[320px] flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-6 py-3.5 text-white font-bold text-base hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <span className="spinner" aria-hidden="true" />}
        {isLoading ? '作成中...' : '文章を作成する'}
      </button>
      {disabled && !isLoading && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          内容を入力してください
        </p>
      )}
    </div>
  );
}
