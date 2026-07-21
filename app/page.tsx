'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToneSelector from '@/components/ToneSelector';
import ToneDrawer from '@/components/ToneDrawer';
import ReplyToggle from '@/components/ReplyToggle';
import TextInput from '@/components/TextInput';
import SubmitButton from '@/components/SubmitButton';
import ResultCard from '@/components/ResultCard';
import CorrectionList from '@/components/CorrectionList';
import ClearButton from '@/components/ClearButton';
import Toast from '@/components/Toast';
import { CorrectResponse, ToneType } from '@/types';

interface ToastState {
  message: string;
  type: 'error' | 'warning';
}

export default function Home() {
  // 入力データ（修正する時に保持するため、結果表示中もクリアしない）
  const [tone, setTone] = useState<ToneType>('business');
  const [userMessage, setUserMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isReplyMode, setIsReplyMode] = useState(false);

  // UI状態
  const [viewMode, setViewMode] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 結果データ
  const [result, setResult] = useState<CorrectResponse | null>(null);

  // トースト通知（エラー・警告）
  const [toast, setToast] = useState<ToastState | null>(null);

  const isSubmitDisabled = userMessage.trim() === '';

  const handleSelectTone = (selected: ToneType) => {
    setTone(selected);
    setIsDrawerOpen(false);
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled || isLoading) return;

    if (isReplyMode && receivedMessage.trim() === '') {
      setToast({ message: '受信メールが未入力です', type: 'warning' });
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone,
          userMessage,
          receivedMessage:
            isReplyMode && receivedMessage.trim() !== ''
              ? receivedMessage
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '作成に失敗しました。もう一度お試しください');
      }

      setResult(data as CorrectResponse);
      setViewMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setToast({
        message:
          err instanceof Error && err.message
            ? err.message
            : '作成に失敗しました。もう一度お試しください',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setViewMode('input');
  };

  const handleClear = () => {
    setUserMessage('');
    setReceivedMessage('');
    setIsReplyMode(false);
    setTone('business');
    setResult(null);
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <main className="flex-1 w-full max-w-[720px] mx-auto px-4 py-6">
        {viewMode === 'input' ? (
          <div className="view-fade space-y-5">
            <ToneSelector tone={tone} onOpen={() => setIsDrawerOpen(true)} />

            <ReplyToggle isOn={isReplyMode} onChange={setIsReplyMode} />

            {/* 返信モード切替時の高さ+opacityトランジション */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isReplyMode
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
              aria-hidden={!isReplyMode}
            >
              <div className="overflow-hidden">
                <TextInput
                  id="received-message"
                  label="相手のメール本文"
                  value={receivedMessage}
                  onChange={setReceivedMessage}
                  placeholder="ここに受信メールの本文を貼り付けてください"
                  minRows={4}
                  maxRows={12}
                  variant="gray"
                />
              </div>
            </div>

            <TextInput
              id="user-message"
              label="あなたが伝えたい内容"
              value={userMessage}
              onChange={setUserMessage}
              placeholder="伝えたいことを書いてください（箇条書きやメモ書きでもOK）"
              minRows={6}
              maxRows={15}
              variant="white"
            />

            <SubmitButton
              isLoading={isLoading}
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            />
          </div>
        ) : (
          result && (
            <div className="view-fade space-y-5">
              <ResultCard
                message={result.correctedMessage}
                onEdit={handleEdit}
              />
              <CorrectionList corrections={result.corrections} />
              <ClearButton onClick={handleClear} />
            </div>
          )
        )}
      </main>

      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[55] bg-white/70 flex flex-col items-center justify-center gap-3"
          role="status"
          aria-live="polite"
        >
          <span className="spinner-lg" aria-hidden="true" />
          <p className="text-sm font-medium text-[#334155]">作成中…</p>
        </div>
      )}

      <ToneDrawer
        isOpen={isDrawerOpen}
        tone={tone}
        onSelect={handleSelectTone}
        onClose={() => setIsDrawerOpen(false)}
      />

      <Footer />
    </div>
  );
}
