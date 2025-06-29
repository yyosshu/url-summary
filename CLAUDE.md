# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Google Gemini APIを使用してウェブページのURLから内容を抽出し、日本語で要約する（最大200文字）Webアプリケーションです。Next.js 15で構築されています。

## 技術スタック

- **Next.js 15** (App Router) + TypeScript
- **React 18** UIコンポーネント用
- **Tailwind CSS** スタイリング用
- **Google Gemini 2.0 Flash Experimental** AI要約用
- **@extractus/article-extractor** ウェブコンテンツ抽出用
- **Node.js 18+** 実行環境要件

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # 本番ビルド
npm run start    # 本番サーバー起動
npm run lint     # ESLintコード検証
```

## 主要アーキテクチャ

### APIエンドポイント
- **POST /api/summarize** (`app/api/summarize/route.ts`): URLを受け取り、コンテンツを抽出して日本語要約を返すメインエンドポイント
- レート制限: クライアントIPあたり10リクエスト/時間
- 入力検証: HTTP/HTTPSのURLのみ
- コンテンツ制限: 抽出テキスト10KB

### コアライブラリ
- **lib/extractor.ts**: @extractus/article-extractorを使用したウェブコンテンツ抽出
- **lib/gemini.ts**: 日本語要約プロンプトを含むGemini API統合
- **lib/rateLimiter.ts**: クライアントIPによるメモリ内レート制限

### フロントエンド
- **app/page.tsx**: URL入力フォームを含む単一ページReactコンポーネント
- **app/layout.tsx**: 日本語ローカライゼーション対応のルートレイアウト
- URL入力、ローディング、エラー、要約状態の状態管理

## 環境設定

必要な環境変数:
- `GEMINI_API_KEY`: Google AI Studio APIキー

## Gitコミットメッセージ
- シンプルで簡潔なコミットメッセージにする
- 形式: `type: 簡潔な説明`
- 追加説明、生成署名、共著者クレジットは含めない
- 例: `fix: update TypeScript target to es2015 for deployment`

## デプロイ
- デプロイ環境: Render.com
- TypeScriptターゲット: es2015 (Renderデプロイ用に必要)
- ビルドコマンド: `npm install && npm run build`
- GEMINI_API_KEY環境変数が必要