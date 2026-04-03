import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gpx/gpx.js'

// ============ 賽事資料 ============
const EVENT_DATE = new Date('2026-04-11T04:30:00+08:00')
const GPX_URL = 'https://reurl.cc/Xqx0ve'

export const legs = [
  { num: 1, runner: "韋翰", start: "04:30", end: "05:17", min: 47, km: 6.7, difficulty: "易", startAddr: "宜蘭縣蘇澳鎮武荖坑路116號", endAddr: "宜蘭縣蘇澳鎮信義路101號", car: "A", gateOpen: "", gateClose: "" },
  { num: 2, runner: "小哲", start: "05:20", end: "06:03", min: 43, km: 7.7, difficulty: "易", startAddr: "宜蘭縣蘇澳鎮信義路101號", endAddr: "宜蘭縣五結鄉五濱路二段99號", car: "A", gateOpen: "", gateClose: "", transferMin: 8 },
  { num: 3, runner: "阿賢", start: "06:05", end: "06:52", min: 47, km: 6.6, difficulty: "易", startAddr: "宜蘭縣五結鄉五濱路二段99號", endAddr: "宜蘭縣壯圍鄉壯濱路二段72號", car: "A", gateOpen: "", gateClose: "", transferMin: 15 },
  { num: 4, runner: "湘宜", start: "06:55", end: "07:59", min: 64, km: 7.1, difficulty: "易", startAddr: "宜蘭縣壯圍鄉壯濱路二段72號", endAddr: "宜蘭縣壯圍鄉壯濱路六段180號", car: "B", gateOpen: "", gateClose: "" },
  { num: 5, runner: "洧辰", start: "08:00", end: "08:51", min: 51, km: 7.7, difficulty: "易", startAddr: "宜蘭縣壯圍鄉壯濱路六段180號", endAddr: "宜蘭頭城煙火節 宜蘭縣頭城鎮大武路", car: "B", gateOpen: "11:20", gateClose: "" },
  { num: 6, runner: "建穎", start: "08:55", end: "09:30", min: 35, km: 6.2, difficulty: "易", startAddr: "宜蘭頭城煙火節 宜蘭縣頭城鎮大武路", endAddr: "宜蘭縣頭城鎮北部濱海公路494-562號", car: "B", gateOpen: "", gateClose: "" },
  { num: 7, runner: "小歐", start: "09:30", end: "10:14", min: 44, km: 6.2, difficulty: "易", startAddr: "宜蘭縣頭城鎮北部濱海公路494-562號", endAddr: "關德宮 宜蘭縣礁溪路六段", car: "B", gateOpen: "", gateClose: "" },
  { num: 8, runner: "佳吟", start: "10:15", end: "11:02", min: 47, km: 7.2, difficulty: "適中", startAddr: "關德宮 宜蘭縣礁溪路六段", endAddr: "宜蘭縣頭城鎮濱海路七段251號", car: "B", gateOpen: "", gateClose: "" },
  { num: 9, runner: "冠任", start: "11:05", end: "11:43", min: 38, km: 6.8, difficulty: "易", startAddr: "宜蘭縣頭城鎮濱海路七段251號", endAddr: "四角窟觀景台 新北市貢寮區", car: "B", gateOpen: "", gateClose: "" },
  { num: 10, runner: "敬鴻", start: "11:45", end: "12:43", min: 58, km: 8.2, difficulty: "易", startAddr: "四角窟觀景台 新北市貢寮區", endAddr: "新北市貢寮區東興街3號", car: "B", gateOpen: "", gateClose: "15:30" },
  { num: 11, runner: "阿賢", start: "12:45", end: "13:37", min: 52, km: 7.4, difficulty: "易", startAddr: "新北市貢寮區東興街3號", endAddr: "新北市貢寮區丁子蘭坑道路102號", car: "A", gateOpen: "", gateClose: "" },
  { num: 12, runner: "湘宜", start: "13:40", end: "14:38", min: 58, km: 6.4, difficulty: "易", startAddr: "新北市貢寮區丁子蘭坑道路102號", endAddr: "鄰廣場[新巴士] 新北市雙溪區", car: "A", gateOpen: "", gateClose: "" },
  { num: 13, runner: "冠任", start: "14:40", end: "15:17", min: 37, km: 6.6, difficulty: "難中之王", startAddr: "新北市雙溪區", endAddr: "北37鄉道 新北市瑞芳區", car: "A", gateOpen: "", gateClose: "", transferMin: 11 },
  { num: 14, runner: "小哲", start: "15:20", end: "14:06", min: 46, km: 8.2, difficulty: "適中", startAddr: "北37鄉道 新北市瑞芳區", endAddr: "瑞濱公路觀景台 新北市瑞芳區", car: "A", gateOpen: "", gateClose: "", transferMin: 12 },
  { num: 15, runner: "韋翰", start: "14:10", end: "14:57", min: 47, km: 6.7, difficulty: "易", startAddr: "瑞濱公路觀景台 新北市瑞芳區", endAddr: "基隆市中山區湖海路一段11號", car: "A", gateOpen: "", gateClose: "", transferMin: 23 },
  { num: 16, runner: "建穎", start: "15:00", end: "15:30", min: 30, km: 5.4, difficulty: "適中", startAddr: "基隆市中山區湖海路一段11號", endAddr: "富東登船處 新北市萬里區獅頭路15-3號", car: "B", gateOpen: "", gateClose: "", transferMin: 12 },
  { num: 17, runner: "佳吟", start: "15:30", end: "16:14", min: 44, km: 6.7, difficulty: "易", startAddr: "富東登船處 新北市萬里區獅頭路15-3號", endAddr: "國聖埔 新北市萬里區", car: "B", gateOpen: "", gateClose: "", transferMin: 11 },
  { num: 18, runner: "小歐", start: "16:15", end: "17:03", min: 48, km: 7.3, difficulty: "易", startAddr: "國聖埔 新北市萬里區", endAddr: "水尾景觀休憩公園 新北市金山區", car: "B", gateOpen: "", gateClose: "", transferMin: 7, night: true },
  { num: 19, runner: "洧辰", start: "17:05", end: "17:48", min: 43, km: 6.6, difficulty: "極難", startAddr: "水尾景觀休憩公園 新北市金山區", endAddr: "朱銘美術館 新北市金山區", car: "B", gateOpen: "", gateClose: "", transferMin: 8, night: true },
  { num: 20, runner: "敬鴻", start: "17:50", end: "18:40", min: 50, km: 7.1, difficulty: "適中", startAddr: "朱銘美術館 新北市金山區", endAddr: "Nhà làm, No.1 -1 金山區新北市", car: "B", gateOpen: "", gateClose: "", transferMin: 13, night: true },
  { num: 21, runner: "阿賢", start: "00:50", end: "01:37", min: 47, km: 6.6, difficulty: "適中", startAddr: "Nhà làm, No.1 -1 金山區新北市", endAddr: "小坑 新北市石門區", car: "A", gateOpen: "23:50", gateClose: "02:00", transferMin: 12, night: true },
  { num: 22, runner: "冠任", start: "01:40", end: "02:18", min: 38, km: 6.9, difficulty: "難", startAddr: "小坑 新北市石門區", endAddr: "北21鄉道 新北市石門區", car: "A", gateOpen: "", gateClose: "", transferMin: 15, night: true },
  { num: 23, runner: "韋翰", start: "02:20", end: "03:14", min: 54, km: 7.6, difficulty: "易", startAddr: "北21鄉道 新北市石門區", endAddr: "石門尖鹿福安宮 新北市石門區中山路54號", car: "A", gateOpen: "", gateClose: "", transferMin: 8, night: true },
  { num: 24, runner: "小哲", start: "03:15", end: "03:54", min: 39, km: 7.0, difficulty: "極難", startAddr: "石門尖鹿福安宮 新北市石門區中山路54號", endAddr: "嵩山梯田觀景台 新北市石門區", car: "A", gateOpen: "", gateClose: "", transferMin: 12, night: true },
  { num: 25, runner: "湘宜", start: "03:55", end: "04:58", min: 63, km: 7.1, difficulty: "易", startAddr: "嵩山梯田觀景台 新北市石門區", endAddr: "石門婚紗廣場 新北市石門區", car: "A", gateOpen: "", gateClose: "07:00", transferMin: 13, night: true },
  { num: 26, runner: "建穎", start: "05:00", end: "05:39", min: 39, km: 7.0, difficulty: "易", startAddr: "石門婚紗廣場 新北市石門區", endAddr: "新北市三芝區北部濱海公路2號", car: "B", gateOpen: "", gateClose: "", transferMin: 12 },
  { num: 27, runner: "小歐", start: "05:40", end: "06:30", min: 50, km: 7.6, difficulty: "極難", startAddr: "新北市三芝區北部濱海公路2號", endAddr: "圓山頂 新北市三芝區", car: "B", gateOpen: "", gateClose: "", transferMin: 11 },
  { num: 28, runner: "佳吟", start: "06:30", end: "07:14", min: 44, km: 6.7, difficulty: "易", startAddr: "圓山頂 新北市三芝區", endAddr: "新北市三芝區淡金公路45號", car: "B", gateOpen: "", gateClose: "", transferMin: 12 },
  { num: 29, runner: "敬鴻", start: "07:15", end: "08:16", min: 61, km: 8.7, difficulty: "適中", startAddr: "新北市三芝區淡金公路45號", endAddr: "崁頂裡 新北市淡水區", car: "B", gateOpen: "", gateClose: "", transferMin: 15 },
  { num: 30, runner: "洧辰", start: "08:20", end: "08:56", min: 36, km: 5.4, difficulty: "易", startAddr: "崁頂裡 新北市淡水區", endAddr: "新北市淡水區觀海路201號", car: "B", gateOpen: "", gateClose: "", transferMin: 10 },
]

export const vehicles = [
  { name: "A車", driver: "云暄", color: "#ff6b35", legs: "1-5, 11-15, 21-25" },
  { name: "B車", driver: "建穎", color: "#22c55e", legs: "6-10, 16-20, 26-30" },
  { name: "C車", driver: "羽羚", passengers: "欣湄", color: "#3b82f6", legs: "" },
]

// ============ 工具函式 ============
function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case "極難":
    case "難中之王":
      return { emoji: "🔴", text: difficulty, color: "bg-red-500/20 text-red-400 border-red-500/30", bar: 100 }
    case "難":
      return { emoji: "🟠", text: difficulty, color: "bg-orange-500/20 text-orange-400 border-orange-500/30", bar: 70 }
    case "適中":
      return { emoji: "🟡", text: difficulty, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", bar: 50 }
    default:
      return { emoji: "🟢", text: difficulty, color: "bg-green-500/20 text-green-400 border-green-500/30", bar: 30 }
  }
}

// Haversine 計算兩點間距離（公里）
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// GPX 解析類型
interface GPXPoint {
  lat: number
  lon: number
  ele: number
  dist: number
}

function parseTime(timeStr: string, baseDate: Date): Date {
  const [h, m] = timeStr.split(':').map(Number)
  let date = new Date(baseDate)
  date.setHours(h, m, 0, 0)
  if (h < 12 && baseDate.getHours() >= 12) {
    date.setDate(date.getDate() + 1)
  }
  return date
}

function formatCountdown(ms: number): { days: string, hours: string, minutes: string, seconds: string } {
  if (ms <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }
}

// ============ 天氣預報元件 ============
function WeatherCard() {
  return (
    <section className="bg-bg-card rounded-2xl border border-white/10 p-5">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📅 活動天氣（4/11-12）</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-secondary/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3"><span className="text-3xl">🌤️</span><div><p className="font-semibold">Day 1 - 4/11 (六)</p><p className="text-text-secondary text-sm">宜蘭武荖坑出發</p></div></div>
          <div className="space-y-2 text-sm"><div className="flex items-center gap-2"><span className="text-text-secondary">宜蘭</span><span className="font-mono text-accent font-semibold">20-26°C</span></div><div className="flex items-center gap-2"><span className="text-text-secondary">降雨機率</span><span className="text-blue-400">20%</span><span className="text-xs text-green-400">✨ 適合跑步</span></div></div>
        </div>
        <div className="bg-bg-secondary/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-3"><span className="text-3xl">🌙</span><div><p className="font-semibold">Day 2 - 4/12 (日)</p><p className="text-text-secondary text-sm">淡水終點衝刺</p></div></div>
          <div className="space-y-2 text-sm"><div className="flex items-center gap-2"><span className="text-text-secondary">新北</span><span className="font-mono text-accent font-semibold">21-27°C</span></div><div className="flex items-center gap-2"><span className="text-text-secondary">降雨機率</span><span className="text-blue-400">30%</span><span className="text-xs text-yellow-400">⛅ 多雲</span></div></div>
        </div>
      </div>
      <div className="mt-4 bg-warning/10 border border-warning/20 rounded-lg px-4 py-3"><p className="text-warning text-sm flex items-center gap-2">⚠️ <span>夜間山區偏涼，攜帶外套</span></p></div>
    </section>
  )
}

// ============ 配速速查表 ============
function PaceTable() {
  const paceData = legs.slice(0, 10).map(leg => ({ num: leg.num, runner: leg.runner, pace: (leg.min / leg.km).toFixed(1), estimatedTime: `${leg.min}min` }))
  return (
    <section className="bg-bg-card rounded-2xl border border-white/10 p-5">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⛽ 配速速查表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10"><th className="text-left py-2 px-3 text-text-secondary font-medium">棒次</th><th className="text-left py-2 px-3 text-text-secondary font-medium">跑者</th><th className="text-left py-2 px-3 text-text-secondary font-medium">配速(分/公里)</th><th className="text-left py-2 px-3 text-text-secondary font-medium">預估</th></tr></thead>
          <tbody>{paceData.map((row) => (<tr key={row.num} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="py-2 px-3 font-mono text-accent">{row.num}</td><td className="py-2 px-3 font-semibold">{row.runner}</td><td className="py-2 px-3 font-mono text-green-400">{row.pace}</td><td className="py-2 px-3 text-text-secondary">{row.estimatedTime}</td></tr>))}</tbody>
        </table>
      </div>
    </section>
  )
}

// ============ 攜帶物品建議 ============
function GearList() {
  const essential = [
    { icon: "🔦", name: "頭燈", note: "夜間棒必備" },
    { icon: "🧥", name: "保暖外套", note: "深夜山區偏涼" },
    { icon: "📱", name: "手機 + 行動電源", note: "必備" },
    { icon: "💧", name: "水壺 / 運動飲料", note: "補水必備" },
  ]
  const suggested = [
    { icon: "🦺", name: "反光背心", note: "安全加分" },
    { icon: "👕", name: "替換衣物", note: "住宿點可換" },
    { icon: "🍫", name: "簡單零食", note: "能量包/能量棒" },
  ]

  return (
    <section className="bg-bg-card rounded-2xl border border-white/10 p-5">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🎒 建議攜帶</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">必備</h4>
          <div className="space-y-2">
            {essential.map((item) => (
              <div key={item.name} className="flex items-center gap-3 bg-bg-secondary/30 rounded-lg px-3 py-2">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-text-secondary">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">建議</h4>
          <div className="space-y-2">
            {suggested.map((item) => (
              <div key={item.name} className="flex items-center gap-3 bg-bg-secondary/30 rounded-lg px-3 py-2">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-text-secondary">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ 住宿資訊 ============
function AccommodationCard() {
  return (
    <div className="bg-bg-card rounded-xl border border-white/10 p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2"><span>🏨</span> 中途住宿</h3>
      <p className="text-text-primary font-medium">水芳</p>
      <p className="text-text-secondary text-sm">九份山城</p>
      <p className="text-text-secondary text-sm">Day 1 傍晚（約 18:30-19:00）</p>
      <a href="https://maps.app.goo.gl/QUqAxnjEj55van9d6?g_st=ipc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent text-sm hover:underline mt-2">📍 查看地圖</a>
    </div>
  )
}

// ============ 倒數計時 ============
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => EVENT_DATE.getTime() - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = EVENT_DATE.getTime() - Date.now()
      setTimeLeft(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const { days, hours, minutes, seconds } = formatCountdown(timeLeft)
  const isFinished = timeLeft <= 0

  return (
    <div className="text-center py-8">
      <h2 className="text-text-secondary text-sm uppercase tracking-widest mb-4">
        {isFinished ? "🏃 比賽進行中！" : "⏱️ 距離起跑還有"}
      </h2>
      <div className="flex justify-center gap-4">
        {[{ value: days, label: "天" }, { value: hours, label: "時" }, { value: minutes, label: "分" }, { value: seconds, label: "秒" }].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="bg-bg-card border border-white/10 rounded-xl px-4 py-3 min-w-[72px]">
              <span className="font-mono text-4xl font-semibold text-accent tabular-nums">{value}</span>
            </div>
            <span className="text-text-secondary text-xs mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ 即時進度指示器 ============
function CurrentLegIndicator() {
  const [info, setInfo] = useState<{ leg: typeof legs[0], status: string } | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const abs = legs.map(l => ({ ...l, s: parseTime(l.start, EVENT_DATE), e: parseTime(l.end, EVENT_DATE) }))
      if (now < EVENT_DATE) { setInfo(null); return }
      if (now > abs[abs.length - 1].e) { setInfo({ leg: legs[29], status: 'done' }); return }
      const cur = abs.find(l => now >= l.s && now <= l.e)
      setInfo(cur ? { leg: cur, status: 'running' } : null)
    }
    update(); const i = setInterval(update, 1000); return () => clearInterval(i)
  }, [])

  if (!info) return <div className="bg-bg-card rounded-xl border border-accent/30 p-4 mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl">🏃</div><div><p className="text-text-primary font-semibold">第 1 棒將由韋翰打頭陣！</p><p className="text-text-secondary text-sm">4/11 04:30 從武荖坑起跑</p></div></div></div>
  if (info.status === 'done') return <div className="bg-bg-card rounded-xl border border-success/30 p-4 mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-xl">🎉</div><div><p className="text-success font-semibold text-lg">全部完賽！</p><p className="text-text-secondary text-sm">恭喜 CRUFU RUN 7th 完賽！</p></div></div></div>

  return (
    <div className="bg-bg-card rounded-xl border border-accent/30 p-4 mb-6 animate-pulse-slow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">{info.leg.num}</div>
          <div>
            <p className="text-text-primary font-semibold">目前第 {info.leg.num} 棒：{info.leg.runner} 正在跑！</p>
            <p className="text-text-secondary text-sm font-mono">{info.leg.start} - {info.leg.end} <span className="ml-2">• {info.leg.km}km</span></p>
          </div>
        </div>
        <div className="text-2xl">⏱️</div>
      </div>
    </div>
  )
}

// ============ 路線高度剖面圖 ============
function ElevationChart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ gain: number, loss: number, max: number, min: number } | null>(null)

  useEffect(() => {
    const fetchAndParseGPX = async () => {
      try {
        const res = await fetch(`https://api.allorigins.win/raw?url=https://reurl.cc/Xqx0ve`)
        const text = await res.text()
        const parser = new DOMParser()
        const xml = parser.parseFromString(text, 'text/xml')
        const pts = xml.querySelectorAll('trkpt')

        const points: GPXPoint[] = []
        let totalDist = 0

        pts.forEach((pt, i) => {
          const lat = parseFloat(pt.getAttribute('lat') || '0')
          const lon = parseFloat(pt.getAttribute('lon') || '0')
          const ele = parseFloat(pt.querySelector('ele')?.textContent || '0')

          if (i > 0) {
            const prev = points[i - 1]
            const d = getDistance(prev.lat, prev.lon, lat, lon)
            totalDist += d
          }

          points.push({ lat, lon, ele, dist: totalDist })
        })

        if (points.length === 0) throw new Error('No points found')

        // 計算統計數據
        let gain = 0
        let loss = 0
        let maxEle = points[0].ele
        let minEle = points[0].ele

        for (let i = 1; i < points.length; i++) {
          const diff = points[i].ele - points[i - 1].ele
          if (diff > 0) gain += diff
          else loss += Math.abs(diff)
          maxEle = Math.max(maxEle, points[i].ele)
          minEle = Math.min(minEle, points[i].ele)
        }

        setStats({
          gain: Math.round(gain),
          loss: Math.round(loss),
          max: Math.round(maxEle),
          min: Math.round(minEle)
        })

        // 繪製剖面圖
        drawElevationChart(points)
        setLoading(false)
      } catch (e) {
        console.error('GPX fetch failed:', e)
        setError('載入失敗')
        setLoading(false)
      }
    }

    fetchAndParseGPX()
  }, [])

  const drawElevationChart = (points: GPXPoint[]) => {
    const container = document.getElementById('elevation-chart')
    if (!container) return

    const width = container.clientWidth
    const height = 180
    const padding = { top: 20, right: 20, bottom: 30, left: 50 }

    // 清除舊內容
    container.innerHTML = ''

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // 計算範圍
    const maxDist = points[points.length - 1].dist
    const eleValues = points.map(p => p.ele)
    const maxEle = Math.max(...eleValues)
    const minEle = Math.min(...eleValues)
    const eleRange = maxEle - minEle || 1

    // 座標轉換
    const scaleX = (d: number) => padding.left + (d / maxDist) * (width - padding.left - padding.right)
    const scaleY = (e: number) => padding.top + (1 - (e - minEle) / eleRange) * (height - padding.top - padding.bottom)

    // 建立路徑
    const pathPoints = points.map(p => `${scaleX(p.dist)},${scaleY(p.ele)}`)
    const linePath = `M ${pathPoints.join(' L ')}`

    // 填充區域
    const areaPath = `${linePath} L ${scaleX(maxDist)},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`

    // 漸層定義
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', 'ele-gradient')
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '0%')
    gradient.setAttribute('y2', '100%')

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', '#4ade80')
    stop1.setAttribute('stop-opacity', '0.4')

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', '#4ade80')
    stop2.setAttribute('stop-opacity', '0.05')

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // 繪製填充區域
    const areaEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    areaEl.setAttribute('d', areaPath)
    areaEl.setAttribute('fill', 'url(#ele-gradient)')
    svg.appendChild(areaEl)

    // 繪製線條
    const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    lineEl.setAttribute('d', linePath)
    lineEl.setAttribute('fill', 'none')
    lineEl.setAttribute('stroke', '#4ade80')
    lineEl.setAttribute('stroke-width', '2')
    svg.appendChild(lineEl)

    // X軸標籤
    const xLabels = [0, Math.round(maxDist / 2), Math.round(maxDist)]
    xLabels.forEach(dist => {
      const x = scaleX(dist)
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', String(x))
      label.setAttribute('y', String(height - 8))
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('fill', '#8ba89a')
      label.setAttribute('font-size', '10')
      label.textContent = `${dist}km`
      svg.appendChild(label)
    })

    // Y軸標籤
    const yLabels = [minEle, minEle + eleRange / 2, maxEle]
    yLabels.forEach(ele => {
      const y = scaleY(ele)
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', String(padding.left - 8))
      label.setAttribute('y', String(y + 4))
      label.setAttribute('text-anchor', 'end')
      label.setAttribute('fill', '#8ba89a')
      label.setAttribute('font-size', '10')
      label.textContent = `${Math.round(ele)}m`
      svg.appendChild(label)
    })

    container.appendChild(svg)
  }

  return (
    <section className="bg-bg-card rounded-2xl border border-white/10 p-5 mt-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📊 路線高度剖面圖</h3>
      {loading ? (
        <div className="h-[180px] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="h-[180px] flex items-center justify-center text-warning">{error}</div>
      ) : (
        <>
          <div id="elevation-chart" className="w-full" />
          {stats && (
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-accent font-bold text-lg">↑{stats.gain}m</p>
                <p className="text-text-secondary text-xs">總爬升</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-bold text-lg">↓{stats.loss}m</p>
                <p className="text-text-secondary text-xs">總下降</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-bold text-lg">{stats.max}m</p>
                <p className="text-text-secondary text-xs">最高點</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-lg">{stats.min}m</p>
                <p className="text-text-secondary text-xs">最低點</p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// ============ GPX 地圖 ============
function GPXMap() {
  const mapRef = useRef<L.Map | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gpxLayerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 起點和終點 marker
  const startIcon = new L.DivIcon({
    html: '<div style="background:#22c55e;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);font-size:16px;">🏁</div>',
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  const endIcon = new L.DivIcon({
    html: '<div style="background:#f97316;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);font-size:16px;">🏁</div>',
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadGPX = async () => {
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url='
        const response = await fetch(proxyUrl + encodeURIComponent(GPX_URL))
        
        if (!response.ok) throw new Error('Failed to fetch GPX')
        
        const gpxText = await response.text()
        
        if (mapRef.current && !gpxLayerRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gpx = new (window as any).L.GPX(gpxText, {
            async: false,
            marker_options: {
              startIconUrl: undefined,
              endIconUrl: undefined,
              shadowUrl: undefined,
            },
            polyline_options: {
              color: '#4ade80',
              weight: 4,
              opacity: 0.8,
            },
          })
          
          gpx.addTo(mapRef.current)
          gpxLayerRef.current = gpx
          
          gpx.on('loaded', () => {
            setLoading(false)
            if (mapRef.current) {
              mapRef.current.fitBounds(gpx.getBounds(), { padding: [20, 20] })
            }
          })
        }
      } catch (err) {
        console.error('GPX load error:', err)
        setError('載入路線失敗')
        setLoading(false)
      }
    }

    const timer = setTimeout(loadGPX, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10">
      <MapContainer center={[24.8, 121.8]} zoom={10} className="h-[400px] w-full" ref={mapRef} zoomControl={true}>
        <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[24.5937, 121.8268]} icon={startIcon}><Popup><div className="text-center"><p className="font-bold text-green-600">🏁 起點</p><p className="text-sm">宜蘭武荖坑</p></div></Popup></Marker>
        <Marker position={[25.1706, 121.3869]} icon={endIcon}><Popup><div className="text-center"><p className="font-bold text-orange-600">🏁 終點</p><p className="text-sm">淡水漁人碼頭</p></div></Popup></Marker>
      </MapContainer>
      {loading && (
        <div className="absolute inset-0 bg-bg-secondary/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-text-secondary text-sm">載入路線中...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-bg-card/90 backdrop-blur rounded-lg p-3 text-center">
          <span className="text-warning text-sm">{error}</span>
        </div>
      )}
      <div className="absolute top-3 left-3 z-[1000]">
        <span className="gpx-tag">GPX</span>
      </div>
    </div>
  )
}

// ============ 難度進度條 ============
function DifficultyBar({ difficulty }: { difficulty: string }) {
  const config = getDifficultyConfig(difficulty)
  const barColor = config.bar >= 100 ? 'bg-red-500' : config.bar >= 70 ? 'bg-orange-500' : config.bar >= 50 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${config.bar}%` }} />
      </div>
      <span className="text-xs text-text-secondary">{config.text}</span>
    </div>
  )
}

// ============ 棒次卡片 ============
function LegCard({ leg, isExpanded, onToggle }: { leg: typeof legs[0], isExpanded: boolean, onToggle: () => void }) {
  const difficulty = getDifficultyConfig(leg.difficulty)
  const startTime = parseTime(leg.start, EVENT_DATE)
  const endTime = parseTime(leg.end, EVENT_DATE)
  const now = new Date()
  const isPast = endTime < now
  const isCurrent = startTime <= now && endTime >= now

  // 找下一棒
  const nextLeg = legs.find(l => l.num === leg.num + 1)

  return (
    <div className={`bg-bg-card rounded-xl border transition-all duration-300 overflow-hidden ${isCurrent ? 'border-accent shadow-lg shadow-accent/20' : isPast ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'}`}>
      <button onClick={onToggle} className="w-full px-4 py-4 flex items-center gap-3 text-left">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 ${isCurrent ? 'bg-accent text-white' : isPast ? 'bg-white/10 text-text-secondary' : 'bg-bg-secondary text-text-primary'}`}>
          {leg.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text-primary">{leg.runner}</span>
            {leg.night && <span className="text-lg" title="夜間路段">🌙</span>}
            <span className={`px-2 py-0.5 rounded-full text-xs border ${difficulty.color}`}>{difficulty.emoji} {difficulty.text}</span>
            {isCurrent && <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-white animate-pulse">進行中</span>}
          </div>
          <div className="text-text-secondary text-sm font-mono mt-0.5">
            {leg.start} → {leg.end}
            <span className="ml-2 text-text-secondary/60">({leg.min}分鐘)</span>
            <span className="ml-2 text-route">{leg.km}km</span>
          </div>
          <div className="mt-1.5"><DifficultyBar difficulty={leg.difficulty} /></div>
        </div>
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-secondary text-xs mb-1">🚩 起點</p>
                <p className="text-text-primary">{leg.startAddr}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs mb-1">🏁 終點</p>
                <p className="text-text-primary">{leg.endAddr}</p>
              </div>
            </div>
            {leg.transferMin && (
              <div className="bg-bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                <span className="text-text-secondary">⏱️ 交接準備時間：</span>
                <span className="text-accent font-mono">{leg.transferMin} 分鐘</span>
              </div>
            )}
            {leg.gateOpen && (
              <div className="flex gap-3 text-sm">
                {leg.gateOpen && <div className="bg-warning/10 text-warning px-3 py-1 rounded-full">關門開始：{leg.gateOpen}</div>}
                {leg.gateClose && <div className="bg-danger/10 text-danger px-3 py-1 rounded-full">關門時間：{leg.gateClose}</div>}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: vehicles.find(v => v.name.includes(leg.car))?.color || '#666' }} />
              <span className="text-text-secondary">{vehicles.find(v => v.name.includes(leg.car))?.name} 支援</span>
              <span className="text-text-secondary/50">({vehicles.find(v => v.name.includes(leg.car))?.driver})</span>
            </div>
            {/* 預計抵達時間 */}
            {leg.num === 30 ? (
              <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 text-sm">
                <span className="text-success">🏁 終點預計抵達：{leg.end}</span>
              </div>
            ) : nextLeg && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg px-3 py-2 text-sm">
                <span className="text-accent">🚩 下一棒預計開始：{nextLeg.runner} @ {nextLeg.start}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 支援車輛卡片 ============
function VehicleCard({ vehicle }: { vehicle: typeof vehicles[0] }) {
  return (
    <div className="bg-bg-card rounded-xl border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: vehicle.color }}
        />
        <span className="font-semibold">{vehicle.name}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">司機</span>
          <span className="text-text-primary">{vehicle.driver}</span>
        </div>
        {vehicle.passengers && (
          <div className="flex justify-between">
            <span className="text-text-secondary">乘客</span>
            <span className="text-text-primary">{vehicle.passengers}</span>
          </div>
        )}
        {vehicle.legs && (
          <div className="flex justify-between">
            <span className="text-text-secondary">負責棒次</span>
            <span className="text-accent font-mono">{vehicle.legs}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 棒次時間軸 ============
function LegsTimeline() {
  const [expandedLeg, setExpandedLeg] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const totalKm = legs.reduce((sum, leg) => sum + leg.km, 0)
  const totalMin = legs.reduce((sum, leg) => sum + leg.min, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">棒次時間軸</h3>
          <p className="text-text-secondary text-sm mt-1">
            共 {legs.length} 棒 • {totalKm.toFixed(1)}km • 約 {Math.round(totalMin / 60)}小時{totalMin % 60}分
          </p>
        </div>
        <button onClick={() => setShowAll(!showAll)} className="text-sm text-accent hover:underline">
          {showAll ? '全部收合' : '全部展開'}
        </button>
      </div>
      <div className="space-y-2">
        {legs.map((leg) => (
          <LegCard key={leg.num} leg={leg} isExpanded={showAll || expandedLeg === leg.num}
            onToggle={() => setExpandedLeg(expandedLeg === leg.num ? null : leg.num)} />
        ))}
      </div>
    </div>
  )
}

// ============ 主應用 ============
export default function App() {
  const totalKm = legs.reduce((sum, leg) => sum + leg.km, 0)
  const nightLegs = legs.filter(leg => leg.night).length

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight"><span className="text-accent">CRUFU</span> RUN 7th</h1>
              <p className="text-text-secondary text-xs">北台灣 240km 接力賽</p>
            </div>
            <a href={GPX_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              下載 GPX
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-6">
          <div className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            🏃 2026/4/11 (六) 04:30 起跑
          </div>
          <h2 className="text-3xl font-bold mb-2">靠緣分組隊，靠意志完賽</h2>
          <p className="text-text-secondary">宜蘭武荖坑 → 淡水漁人碼頭</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div><span className="text-2xl font-bold text-accent">{legs.length}</span><span className="text-text-secondary ml-1">棒</span></div>
            <div><span className="text-2xl font-bold text-route">{totalKm.toFixed(1)}</span><span className="text-text-secondary ml-1">公里</span></div>
            <div><span className="text-2xl font-bold text-warning">{nightLegs}</span><span className="text-text-secondary ml-1">夜跑棒</span></div>
          </div>
        </section>

        {/* Countdown */}
        <section className="bg-bg-card rounded-2xl border border-white/10"><CountdownTimer /></section>
        {/* Current Leg Indicator */}
        <CurrentLegIndicator />
        {/* Weather */}
        <WeatherCard />

        {/* Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-card rounded-xl border border-white/10 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><span>📍</span> 集合地點</h3>
            <p className="text-text-primary">湘豐客棧</p>
            <p className="text-text-secondary text-sm">宜蘭縣礁溪鄉塭底路70-14號</p>
            <p className="text-accent text-sm mt-2">2026/4/10 (五) 集合</p>
          </div>
          <AccommodationCard />
        </section>

        <PaceTable />
        <GearList />

        {/* GPX Map */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span>🗺️</span> 路線地圖</h3>
          <GPXMap />
        </section>
        <ElevationChart />

        {/* Vehicles */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span>🚗</span> 支援車輛</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (<VehicleCard key={vehicle.name} vehicle={vehicle} />))}
          </div>
        </section>

        <LegsTimeline />

        {/* Footer */}
        <footer className="text-center py-8 text-text-secondary text-sm border-t border-white/5">
          <p>CRUFU RUN 7th 北台灣</p>
          <p className="mt-1">靠緣分組隊，靠意志完賽</p>
        </footer>
      </main>
    </div>
  )
}
