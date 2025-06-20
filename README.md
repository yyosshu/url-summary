# URL要約アプリ

Google Gemini APIを使用してウェブページのURLから内容を抽出し、日本語で要約するWebアプリケーションです。

## 機能

- URLを入力するだけで、ウェブページの内容を自動的に要約
- 最大200文字以内の簡潔な日本語要約
- レスポンシブデザインで、モバイルデバイスにも対応
- エラーハンドリングとロード状態の表示

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **API**: Google Gemini 2.0 Flash Experimental
- **記事抽出**: @extractus/article-extractor
- **実行環境**: Node.js 18+

## セットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd url-summary
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

1. `.env.example`を`.env`にコピー:
```bash
cp .env.example .env
```

2. Google AI Studioで[APIキーを取得](https://aistudio.google.com/app/apikey)

3. `.env`ファイルを編集してAPIキーを設定:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 使用方法

1. テキストフィールドに要約したいウェブページのURLを入力
2. 「要約する」ボタンをクリック
3. 処理が完了すると、200文字以内の日本語要約が表示されます

## プロジェクト構造

```
.
├── app/
│   ├── page.tsx              # メインページ（URL入力フォーム）
│   ├── layout.tsx            # レイアウトコンポーネント
│   ├── globals.css           # グローバルCSS
│   └── api/
│       └── summarize/route.ts # 要約API エンドポイント
├── lib/
│   ├── extractor.ts          # ウェブページテキスト抽出
│   └── gemini.ts             # Gemini API クライアント
├── .env.example              # 環境変数のサンプル
├── package.json              # 依存関係とスクリプト
└── README.md                 # このファイル
```

## ビルドとデプロイ

### 本番ビルド

```bash
npm run build
npm start
```

### デプロイ

このアプリケーションは以下のプラットフォームでデプロイできます:

- **Vercel**: `vercel --prod`
- **Netlify**: `npm run build && netlify deploy --prod --dir=.next`
- **Render**: Node.js サービスとして直接デプロイ

環境変数 `GEMINI_API_KEY` をデプロイプラットフォームで設定することを忘れずに。

## API仕様

### POST /api/summarize

ウェブページのURLを受け取り、要約されたテキストを返します。

**リクエスト:**
```json
{
  "url": "https://example.com/article"
}
```

**レスポンス (成功時):**
```json
{
  "summary": "記事の要約テキスト（200文字以内）"
}
```

**レスポンス (エラー時):**
```json
{
  "error": "エラーメッセージ"
}
```

## 制限事項

- 一部のウェブサイトでは、アクセス制限によりコンテンツを取得できない場合があります
- JavaScript で動的に生成されるコンテンツは抽出できません
- 画像や動画の内容は要約に含まれません
- 要約は最大200文字に制限されます

## トラブルシューティング

### よくある問題

1. **「記事の内容を取得できませんでした」エラー**
   - URLが正しいかどうか確認
   - ウェブサイトがアクセス制限を設けていないか確認

2. **「Gemini API エラー」**
   - APIキーが正しく設定されているか確認
   - APIキーの利用制限に達していないか確認

3. **「ネットワークエラー」**
   - インターネット接続を確認
   - ファイアウォールの設定を確認

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。