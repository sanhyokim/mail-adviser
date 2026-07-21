# Mail Adviser

メール文章推敲Webアプリケーション。

ユーザーが書いたメール文章（メモ書き・箇条書きでもOK）の意図を汲み取り、選択したトーンに合った完成度の高いビジネス文章に推敲・再構成します。メールやLINE公式アカウントへのコピー＆ペーストして使う想定の社内向けツールです。

## 主な機能

- **5つのトーン選択**: ビジネス（標準）／フォーマル（敬語最大）／カジュアル（社内向け）／丁寧カジュアル（LINE向け）／お詫び・謝罪
- **返信モード**: 受信メールを貼り付けると、文脈に合った返信文を生成
- **推敲ポイントの解説**: 何をなぜ変更・補完したかを箇条書きで表示
- **ワンタップコピー**: 完成文章をクリップボードにコピー
- **レスポンシブデザイン**: スマートフォン・PC両対応

## 技術スタック

- Next.js 14（App Router）+ TypeScript + Tailwind CSS
- OpenRouter API（OpenAI互換エンドポイント、`fetch` 直接呼び出し）
- デプロイ想定: Vercel

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` を作成し、以下を設定します。

```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
OPENROUTER_MODEL=google/gemini-2.5-flash
APP_URL=http://localhost:3000
```

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `OPENROUTER_API_KEY` | ✅ | OpenRouterのAPIキー。[https://openrouter.ai/keys](https://openrouter.ai/keys) から取得 |
| `OPENROUTER_MODEL` | - | 使用するモデルID（未設定時: `google/gemini-2.5-flash`）。[モデル一覧](https://openrouter.ai/models) |
| `APP_URL` | - | アプリのURL（OpenRouterのHTTP-Refererヘッダーに使用。未設定時: `http://localhost:3000`） |

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開きます。

## ビルド・本番起動

```bash
npm run build
npm run start
```

Vercelにデプロイする場合は、プロジェクトの環境変数に `OPENROUTER_API_KEY`（および必要に応じて `OPENROUTER_MODEL`、`APP_URL`）を設定してください。
