-- =============================================
-- 不動産管理アプリ: propertiesテーブル
-- Supabase SQL Editorで実行してください
-- =============================================

-- 物件テーブルの作成
CREATE TABLE properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT        NOT NULL,           -- 物件名
  rent        INTEGER     NOT NULL,           -- 家賃（円）
  area        TEXT        NOT NULL,           -- エリア名
  layout      TEXT        NOT NULL,           -- 間取り（例：1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security（RLS）を有効化
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分が登録した物件のみ参照できるポリシー
CREATE POLICY "自分の物件のみ参照" ON properties
  FOR SELECT USING (auth.uid() = user_id);

-- 自分のuser_idでのみ登録できるポリシー
CREATE POLICY "自分の物件のみ登録" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ編集できるポリシー
CREATE POLICY "自分の物件のみ編集" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できるポリシー
CREATE POLICY "自分の物件のみ削除" ON properties
  FOR DELETE USING (auth.uid() = user_id);
