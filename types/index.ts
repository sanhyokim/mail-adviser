export type ToneType =
  | 'business'
  | 'formal'
  | 'internal'
  | 'polite_casual'
  | 'apology';

export interface ToneOption {
  value: ToneType;
  label: string;
  description: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'business',
    label: 'ビジネス（標準）',
    description: '一般的なビジネスメール向け',
  },
  {
    value: 'formal',
    label: 'フォーマル（敬語最大）',
    description: '社外・目上の方向け',
  },
  {
    value: 'internal',
    label: '社内LINE',
    description: '社内連絡向け。入力の口調に合わせて仕上げます',
  },
  {
    value: 'polite_casual',
    label: '丁寧カジュアル（LINE公式向け）',
    description: 'LINE公式での顧客対応向け',
  },
  {
    value: 'apology',
    label: 'お詫び・謝罪',
    description: 'クレーム対応・謝罪メール向け',
  },
];

export const TONE_VALUES: ToneType[] = TONE_OPTIONS.map((t) => t.value);

export function getToneLabel(tone: ToneType): string {
  return TONE_OPTIONS.find((t) => t.value === tone)?.label ?? tone;
}

export interface CorrectRequest {
  tone: ToneType;
  userMessage: string;
  receivedMessage: string | null;
}

export interface CorrectResponse {
  correctedMessage: string;
  corrections: string[];
}

export interface ErrorResponse {
  error: string;
}

export const MAX_MESSAGE_LENGTH = 3000;
