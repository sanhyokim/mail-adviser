'use client';

interface ReplyToggleProps {
  isOn: boolean;
  onChange: (isOn: boolean) => void;
}

export default function ReplyToggle({ isOn, onChange }: ReplyToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label="受信メールへの返信"
        onClick={() => onChange(!isOn)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          isOn ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className="text-sm font-medium text-[#334155]"
        onClick={() => onChange(!isOn)}
      >
        受信メールへの返信
      </span>
    </label>
  );
}
