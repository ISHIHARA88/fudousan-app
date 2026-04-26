import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// フォームの初期値
const EMPTY_FORM = { name: '', rent: '', area: '', layout: '' }

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null) // 編集中の物件ID（nullなら新規登録モード）

  useEffect(() => {
    fetchProperties()
  }, [])

  // Supabaseから自分の物件一覧を取得（RLSにより自動的に自分のものだけ返る）
  const fetchProperties = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // フォーム入力値の更新
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 物件の新規登録（INSERT）
  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('properties').insert({
      name: form.name,
      rent: Number(form.rent),
      area: form.area,
      layout: form.layout,
      user_id: user.id,
    })
    if (error) {
      setError(error.message)
    } else {
      handleCancel()
      fetchProperties()
    }
  }

  // 編集ボタン押下時：フォームに既存値をセットして編集モードへ
  const handleEditStart = (property) => {
    setEditingId(property.id)
    setForm({
      name: property.name,
      rent: String(property.rent),
      area: property.area,
      layout: property.layout,
    })
    setShowForm(true)
    // フォームまでスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 物件の更新（UPDATE）
  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase
      .from('properties')
      .update({
        name: form.name,
        rent: Number(form.rent),
        area: form.area,
        layout: form.layout,
      })
      .eq('id', editingId)
    if (error) {
      setError(error.message)
    } else {
      handleCancel()
      fetchProperties()
    }
  }

  // 物件の削除（DELETE）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      fetchProperties()
    }
  }

  // フォームを閉じてリセット
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <div className="header-actions">
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM) }}
            className="btn-add"
          >
            ＋ 新規登録
          </button>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {/* 登録・編集フォーム */}
      {showForm && (
        <div className="property-form-card">
          <h2>{editingId ? '物件を編集' : '物件を新規登録'}</h2>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="property-form">
            <div className="form-row">
              <div className="form-group">
                <label>物件名</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="例：渋谷マンション101"
                  required
                />
              </div>
              <div className="form-group">
                <label>家賃（円）</label>
                <input
                  name="rent"
                  type="number"
                  value={form.rent}
                  onChange={handleChange}
                  placeholder="例：80000"
                  min={0}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>エリア名</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="例：東京都渋谷区"
                  required
                />
              </div>
              <div className="form-group">
                <label>間取り</label>
                <input
                  name="layout"
                  value={form.layout}
                  onChange={handleChange}
                  placeholder="例：1LDK"
                  required
                />
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? '更新する' : '登録する'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 物件一覧 */}
      {loading ? (
        <p className="status-text">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="status-text">物件が登録されていません。「＋ 新規登録」から追加してください。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <h2 className="property-name">{property.name}</h2>
              <p className="property-area">📍 {property.area}</p>
              <p className="property-layout">🏠 {property.layout}</p>
              <p className="property-rent">
                月額 <span>{property.rent.toLocaleString('ja-JP')}円</span>
              </p>
              <div className="card-actions">
                <button onClick={() => handleEditStart(property)} className="btn-edit">
                  編集
                </button>
                <button onClick={() => handleDelete(property.id)} className="btn-delete">
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
