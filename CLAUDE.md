# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# fudousan-app

Supabase認証付きの不動産管理Webアプリ。React + Viteで構成。

## 重要: 開発環境のセットアップ

**Google Drive上ではnpmが正常に動作しない**（EBADFエラー、.binディレクトリ未作成）。  
ソースコードはGoogleドライブ（git管理）に置き、**開発はローカルの `C:\Users\ryoya\Documents\fudousan-app` で行う**。

```bash
# ローカルにコピーしてからインストール
cd C:\Users\ryoya\Documents\fudousan-app
npm install
npm run dev
```

## コマンド

```bash
npm run dev      # 開発サーバー起動（localhost:5173）
npm run build    # プロダクションビルド（dist/ に出力）
npm run lint     # ESLint
npm run preview  # ビルド結果のプレビュー
```

## アーキテクチャ

```
src/
  supabaseClient.js   # Supabaseクライアント（環境変数から初期化）
  App.jsx             # ルーティングと認証状態管理
  pages/
    Login.jsx         # ログインフォーム
    Register.jsx      # 会員登録フォーム
    Properties.jsx    # 物件一覧（ダミーデータ）
  index.css           # 全スタイル（CSSフレームワーク未使用）
```

**認証フロー:**  
`App.jsx` が `supabase.auth.onAuthStateChange` でセッションを監視。`PrivateRoute` コンポーネントが未ログイン時に `/login` へリダイレクト。セッション確認中（`undefined`）は描画をスキップして画面フラッシュを防ぐ。

## 環境変数（.env）

`.env` は `.gitignore` で除外済み。ローカルで手動作成が必要：

```
VITE_SUPABASE_URL=https://xfrccvnlkyvoyowghagj.supabase.co
VITE_SUPABASE_ANON_KEY=<SupabaseダッシュボードのPublishable Key>
```

## 技術スタック

- React 19 + Vite 6
- @supabase/supabase-js 2
- react-router-dom 7（BrowserRouter）
- Vanilla CSS（`src/index.css` に全スタイル集約）

## デプロイ情報

- 本番URL：https://fudousan-app.vercel.app
- Supabaseプロジェクト名：realestate-app
