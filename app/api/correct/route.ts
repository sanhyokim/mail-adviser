import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import {
  CorrectRequest,
  MAX_MESSAGE_LENGTH,
  TONE_VALUES,
  ToneType,
  getToneLabel,
} from '@/types';

const SYSTEM_PROMPT = `あなたは日本語のビジネスメール・メッセージの推敲専門アシスタントです。

## あなたの役割
- ユーザーが入力した内容から「伝えたいこと」を正確に読み取ってください
- 入力はメモ書き・箇条書き・不完全な文章・話し言葉の場合があります
- ユーザーの意図を推測し、指定されたトーンに合った完成度の高いメール文章に仕上げてください
- 足りない要素（挨拶文、締めの言葉、適切な接続詞など）は自然に補完してください
- ただし、ユーザーが伝えたい事実・内容を勝手に追加したり変更したりしないでください

## トーン別の指針
- **ビジネス（標準）**: 一般的なビジネスメール。丁寧語ベース、簡潔で明確。適切な挨拶と締めを含む
- **フォーマル（敬語最大）**: 社外の目上・重要顧客向け。最上級の敬語、謙譲語を適切に使用。格式のある文面
- **社内LINE**: 社内の相手へのLINEメッセージ。ユーザーの入力の口調から相手との距離感を読み取り、それに合わせて仕上げる。入力が敬語なら、敬語は崩さないがメールのような堅苦しさはない文に（先輩・上司宛の想定）。入力がため口・フランクな口調なら、フランクで簡潔な文に（同僚・部下宛の想定）。いずれも定型挨拶や署名は付けず、命令口調にならず感じの良い頼み方・伝え方にする
- **丁寧カジュアル（LINE公式向け）**: LINE公式アカウントでの顧客対応向け。親しみやすく丁寧。短めの文で読みやすく。絵文字は使わない
- **お詫び・謝罪**: 謝罪の意を明確に伝える。誠意ある表現、具体的な対応策の提示を促す。言い訳がましくならないよう注意

LINE系のトーンでは、メール特有の形式（件名・宛名・署名・長い挨拶文）を使わず、チャットとして自然な文章にしてください。

## 受信メールがある場合
受信メールの内容を踏まえ、文脈に合った適切な返信になるよう文章を構成してください。
- 相手の質問や依頼に対する回答漏れがないかチェックしてください
- 相手のメールのトーンも参考にして自然な返信にしてください
- ユーザーの入力が「了解です」程度の短いものでも、受信メールの内容に合った適切な返信文に仕上げてください

## 出力形式
必ず以下のJSON形式で返してください。JSON以外の文字は含めないでください。
{
  "correctedMessage": "完成した文章全文",
  "corrections": ["推敲ポイント1の説明", "推敲ポイント2の説明", ...]
}

推敲ポイントは3〜7個程度で、以下の観点から説明してください：
- 元の入力からどのように意図を解釈したか
- どのような要素を補完・追加したか
- 表現をどのように改善したか、なぜその表現にしたか
入力がよく書けている場合はその点もコメントしてください。`;

function buildUserPrompt(
  tone: ToneType,
  userMessage: string,
  receivedMessage: string | null
): string {
  const parts: string[] = [`## 指定トーン\n${getToneLabel(tone)}`];

  if (receivedMessage) {
    parts.push(`## 受信メール（このメールへの返信を作成します）\n${receivedMessage}`);
  }

  parts.push(`## ユーザーが伝えたい内容\n${userMessage}`);

  return parts.join('\n\n');
}

export async function POST(request: NextRequest) {
  let body: Partial<CorrectRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'リクエスト形式が不正です' },
      { status: 400 }
    );
  }

  const { tone, userMessage, receivedMessage } = body;

  if (typeof userMessage !== 'string' || userMessage.trim() === '') {
    return NextResponse.json(
      { error: '内容を入力してください' },
      { status: 400 }
    );
  }

  if (userMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `内容は${MAX_MESSAGE_LENGTH}文字以内で入力してください` },
      { status: 400 }
    );
  }

  if (!tone || !TONE_VALUES.includes(tone as ToneType)) {
    return NextResponse.json(
      { error: 'トーンの指定が不正です' },
      { status: 400 }
    );
  }

  if (receivedMessage != null) {
    if (typeof receivedMessage !== 'string') {
      return NextResponse.json(
        { error: '受信メールの形式が不正です' },
        { status: 400 }
      );
    }
    if (receivedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `受信メールは${MAX_MESSAGE_LENGTH}文字以内で入力してください` },
        { status: 400 }
      );
    }
  }

  try {
    const userPrompt = buildUserPrompt(
      tone as ToneType,
      userMessage,
      receivedMessage && receivedMessage.trim() !== '' ? receivedMessage : null
    );
    const result = await callOpenRouter(SYSTEM_PROMPT, userPrompt);
    return NextResponse.json(result);
  } catch (err) {
    console.error('correct API error:', err);
    return NextResponse.json(
      { error: '作成に失敗しました。もう一度お試しください' },
      { status: 500 }
    );
  }
}
