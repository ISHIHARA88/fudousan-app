import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

// 認証済みユーザーのみアクセスできるルート
function PrivateRoute({ session, children }) {
  if (session === undefined) return null // セッション確認中は何も表示しない
  return session ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回レンダリング時に現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 認証状態の変化を購読（ログイン・ログアウト時に更新）
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/properties" replace /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/properties" replace /> : <Register />} />
        <Route
          path="/properties"
          element={
            <PrivateRoute session={session}>
              <Properties />
            </PrivateRoute>
          }
        />
        {/* ルートアクセスはセッション状態に応じてリダイレクト */}
        <Route path="/" element={<Navigate to={session ? '/properties' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
