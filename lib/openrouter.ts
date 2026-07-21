const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// メモ帳等の編集で紛れ込みやすい引用符・空白を除去してキーを取得する
function getApiKey(): string {
  const raw = (process.env.OPENROUTER_API_KEY ?? '').trim().replace(/^["']|["']$/g, '');
  if (!raw) {
    throw new Error(
      'OPENROUTER_API_KEY が設定されていません。.env.local を確認し、サーバーを再起動してください'
    );
  }
  return raw;
}

// キー全体を晒さずにどのキーが使われたか判別するための表示
function keyFingerprint(key: string): string {
  return `${key.slice(0, 12)}...${key.slice(-3)} (長さ ${key.length})`;
}

export async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<{ correctedMessage: string; corrections: string[] }> {
  const apiKey = getApiKey();
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'Mail Adviser',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenRouter API error: ${response.status} - ${errorBody} [使用キー: ${keyFingerprint(apiKey)}]`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenRouter returned empty response');
  }

  const jsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(jsonString);

  if (!parsed.correctedMessage || !Array.isArray(parsed.corrections)) {
    throw new Error('Invalid response format from AI');
  }

  return {
    correctedMessage: parsed.correctedMessage,
    corrections: parsed.corrections,
  };
}
