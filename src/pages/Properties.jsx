import { supabase } from '../supabaseClient'

// ダミー物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: '渋谷マンション 101号室', rent: 120000, area: '東京都渋谷区' },
  { id: 2, name: '新宿レジデンス 202号室', rent: 95000, area: '東京都新宿区' },
  { id: 3, name: '品川アパート 305号室', rent: 80000, area: '東京都品川区' },
  { id: 4, name: '池袋スタジオ 410号室', rent: 65000, area: '東京都豊島区' },
  { id: 5, name: '恵比寿テラス 501号室', rent: 180000, area: '東京都渋谷区' },
  { id: 6, name: '目黒ハイツ 602号室', rent: 110000, area: '東京都目黒区' },
]

export default function Properties() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <button onClick={handleLogout} className="btn-logout">
          ログアウト
        </button>
      </header>

      <div className="property-grid">
        {DUMMY_PROPERTIES.map((property) => (
          <div key={property.id} className="property-card">
            <h2 className="property-name">{property.name}</h2>
            <p className="property-area">📍 {property.area}</p>
            <p className="property-rent">
              月額 <span>{property.rent.toLocaleString('ja-JP')}円</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
