import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import routeKML from './assets/route.kml?url'

// ============ 賽事資料 ============
const EVENT_DATE = new Date('2026-04-11T04:30:00+08:00')
const KML_URL = routeKML

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
  { name: "A車", driver: "云暄", color: "#f97316", legs: "1-5, 11-15, 21-25" },
  { name: "B車", driver: "建穎", color: "#22c55e", legs: "6-10, 16-20, 26-30" },
  { name: "C車", driver: "羽羚", passengers: "欣湄", color: "#3b82f6", legs: "" },
]

// ============ 工具函式 ============
function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case "極難":
    case "難中之王":
      return { emoji: "🔴", text: difficulty, color: "bg-red-500/20 text-red-400 border-red-500/30" }
    case "難":
      return { emoji: "🟠", text: difficulty, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
    case "適中":
      return { emoji: "🟡", text: difficulty, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
    default:
      return { emoji: "🟢", text: difficulty, color: "bg-green-500/20 text-green-400 border-green-500/30" }
  }
}

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

interface KMLPoint {
  lat: number
  lon: number
  ele: number
  dist: number
}

async function fetchKMLRoute(): Promise<KMLPoint[]> {
  try {
    const res = await fetch(KML_URL)
    if (!res.ok) throw new Error('Failed to fetch KML')
    const text = await res.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    
    const lineStrings = xml.querySelectorAll('LineString')
    let coordText = ''
    for (const ls of lineStrings) {
      const coords = ls.querySelector('coordinates')
      if (coords && coords.textContent) {
        coordText = coords.textContent
        break
      }
    }
    
    if (!coordText) throw new Error('No coordinates found')
    
    const points: KMLPoint[] = []
    let totalDist = 0
    
    const coords = coordText.trim().split(/\s+/)
    for (let i = 0; i < coords.length; i++) {
      const parts = coords[i].split(',')
      if (parts.length < 2) continue
      
      const lon = parseFloat(parts[0])
      const lat = parseFloat(parts[1])
      const ele = parts.length > 2 ? parseFloat(parts[2]) : 0
      
      if (i > 0) {
        const prev = points[i - 1]
        totalDist += getDistance(prev.lat, prev.lon, lat, lon)
      }
      
      points.push({ lat, lon, ele, dist: totalDist })
    }
    
    return points
  } catch (e) {
    console.error('KML parse failed:', e)
    return []
  }
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
    <div className="py-10">
      <p className="text-slate-400 text-sm uppercase tracking-[0.2em] mb-6 text-center font-medium">
        {isFinished ? "🏃 比賽進行中！" : "距離起跑"}
      </p>
      <div className="flex justify-center gap-3 md:gap-5">
        {[{ value: days, label: "天" }, { value: hours, label: "時" }, { value: minutes, label: "分" }, { value: seconds, label: "秒" }].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="stat-card rounded-2xl px-5 py-4 min-w-[75px] md:min-w-[90px] text-center">
              <span className="font-mono text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 tabular-nums leading-none">
                {value}
              </span>
            </div>
            <span className="text-slate-500 text-xs mt-2 font-medium">{label}</span>
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

  if (!info) return null
  if (info.status === 'done') return (
    <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl border border-green-500/30 p-5 mb-8 pulse-glow">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">🎉</div>
        <div>
          <p className="text-green-400 font-bold text-xl font-display">全部完賽！</p>
          <p className="text-slate-400 text-sm">恭喜 CRUFU RUN 7th 完賽！</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-r from-orange-900/40 to-amber-900/30 rounded-2xl border border-orange-500/30 p-5 mb-8 pulse-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xl font-display">
            {info.leg.num}
          </div>
          <div>
            <p className="text-white font-semibold text-lg font-display">
              第 {info.leg.num} 棒：{info.leg.runner}
            </p>
            <p className="text-slate-400 text-sm font-mono">
              {info.leg.start} — {info.leg.end}
              <span className="ml-3 text-orange-400">{info.leg.km}km</span>
            </p>
          </div>
        </div>
        <div className="text-3xl animate-bounce">🏃</div>
      </div>
    </div>
  )
}

// ============ 路線高度剖面圖 ============
function ElevationChart() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<{
    points: KMLPoint[]
    stats: { gain: number; loss: number; max: number; min: number }
  } | null>(null)

  useEffect(() => {
    const loadElevation = async () => {
      try {
        const points = await fetchKMLRoute()
        if (points.length === 0) throw new Error('No route points')

        let gain = 0, loss = 0, maxEle = points[0].ele, minEle = points[0].ele
        for (let i = 1; i < points.length; i++) {
          const diff = points[i].ele - points[i - 1].ele
          if (diff > 0) gain += diff
          else loss += Math.abs(diff)
          maxEle = Math.max(maxEle, points[i].ele)
          minEle = Math.min(minEle, points[i].ele)
        }

        setChartData({
          points,
          stats: { gain: Math.round(gain), loss: Math.round(loss), max: Math.round(maxEle), min: Math.round(minEle) }
        })
        setLoading(false)
      } catch (e) {
        console.error(e)
        setError('⚠️ 高度資料載入失敗')
        setLoading(false)
      }
    }
    loadElevation()
  }, [])

  // SVG 渲染（固定尺寸，響應式）
  const chartHeight = 200
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 55 }
  const chartWidth = 800 // 固定，配合 viewBox 響應式

  const renderChart = () => {
    if (!chartData) return null
    const { points } = chartData
    const maxDist = points[points.length - 1].dist
    const eleValues = points.map(p => p.ele)
    const maxEle = Math.max(...eleValues)
    const minEle = Math.min(...eleValues)
    const eleRange = maxEle - minEle || 1

    const scaleX = (d: number) => chartPadding.left + (d / maxDist) * (chartWidth - chartPadding.left - chartPadding.right)
    const scaleY = (e: number) => chartPadding.top + (1 - (e - minEle) / eleRange) * (chartHeight - chartPadding.top - chartPadding.bottom)

    const pathPoints = points.map(p => `${scaleX(p.dist)},${scaleY(p.ele)}`)
    const linePath = `M ${pathPoints.join(' L ')}`
    const areaPath = `${linePath} L ${scaleX(maxDist)},${chartHeight - chartPadding.bottom} L ${chartPadding.left},${chartHeight - chartPadding.bottom} Z`

    const xLabels = [0, Math.round(maxDist / 2), Math.round(maxDist)]
    const yLabels = [minEle, Math.round(minEle + eleRange / 2), maxEle]

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ele-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* 填色區域 */}
        <path d={areaPath} fill="url(#ele-gradient)" />
        {/* 線條 */}
        <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
        {/* X 軸標籤 */}
        {xLabels.map(dist => (
          <text key={`x-${dist}`} x={scaleX(dist)} y={chartHeight - 8} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="JetBrains Mono, monospace">
            {dist}km
          </text>
        ))}
        {/* Y 軸標籤 */}
        {yLabels.map((ele, i) => (
          <text key={`y-${i}`} x={chartPadding.left - 8} y={scaleY(ele) + 4} textAnchor="end" fill="#64748b" fontSize={11} fontFamily="JetBrains Mono, monospace">
            {Math.round(ele)}m
          </text>
        ))}
      </svg>
    )
  }

  return (
    <section className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 mt-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-5 flex items-center gap-3 font-display">
        <span className="text-orange-500">📊</span> 路線高度剖面圖
      </h3>
      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="h-[200px] flex items-center justify-center text-amber-400">{error}</div>
      ) : chartData ? (
        <>
          {renderChart()}
          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-orange-400 font-bold text-xl font-mono">↑{chartData.stats.gain}m</p>
              <p className="text-slate-500 text-xs mt-1">總爬升</p>
            </div>
            <div className="text-center">
              <p className="text-sky-400 font-bold text-xl font-mono">↓{chartData.stats.loss}m</p>
              <p className="text-slate-500 text-xs mt-1">總下降</p>
            </div>
            <div className="text-center">
              <p className="text-green-400 font-bold text-xl font-mono">{chartData.stats.max}m</p>
              <p className="text-slate-500 text-xs mt-1">最高點</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 font-bold text-xl font-mono">{chartData.stats.min}m</p>
              <p className="text-slate-500 text-xs mt-1">最低點</p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}

// ============ GPX 地圖 ============
function GPXMap() {
  const mapRef = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const startIcon = new L.DivIcon({
    html: '<div style="background:#22c55e;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.5);font-size:18px;">🏁</div>',
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

  const endIcon = new L.DivIcon({
    html: '<div style="background:#f97316;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.5);font-size:18px;">🏁</div>',
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadKML = async () => {
      try {
        const points = await fetchKMLRoute()
        if (points.length === 0) throw new Error('No route points')

        if (mapRef.current && !polylineRef.current) {
          const latLngs: L.LatLngExpression[] = points.map(p => [p.lat, p.lon] as L.LatLngExpression)

          const polyline = L.polyline(latLngs, {
            color: '#f97316',
            weight: 4,
            opacity: 0.9,
          })

          polyline.addTo(mapRef.current)
          polylineRef.current = polyline
          mapRef.current.fitBounds(polyline.getBounds(), { padding: [30, 30] })
          setLoading(false)
        }
      } catch (err) {
        setError('⚠️ 路線載入失敗')
        setLoading(false)
      }
    }

    const timer = setTimeout(loadKML, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50">
      <MapContainer center={[24.8, 121.8]} zoom={10} className="h-[400px] w-full" ref={mapRef} zoomControl={true}>
        <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={[24.5937, 121.8268]} icon={startIcon}>
          <Popup><div className="text-center"><p className="font-bold text-green-600">🏁 起點</p><p className="text-sm">宜蘭武荖坑</p></div></Popup>
        </Marker>
        <Marker position={[25.1706, 121.3869]} icon={endIcon}>
          <Popup><div className="text-center"><p className="font-bold text-orange-600">🏁 終點</p><p className="text-sm">淡水漁人碼頭</p></div></Popup>
        </Marker>
      </MapContainer>
      {loading && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-slate-400 text-sm">載入路線中...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur rounded-xl p-4 text-center border border-slate-700/50">
          <span className="text-amber-400 text-sm">{error}</span>
        </div>
      )}
      <div className="absolute top-4 left-4 z-[1000]">
        <span className="gpx-tag">220 KM</span>
      </div>
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
  const nextLeg = legs.find(l => l.num === leg.num + 1)

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-sm ${
      isCurrent ? 'border-orange-500/60 bg-orange-950/30 shadow-lg shadow-orange-500/10' 
        : isPast ? 'border-slate-800/50 bg-slate-900/30 opacity-60' 
          : leg.night ? 'night-leg' : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600/50'
    }`}>
      <button onClick={onToggle} className="w-full px-5 py-4 flex items-center gap-4 text-left">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 ${
          isCurrent ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' 
            : isPast ? 'bg-slate-800 text-slate-500' 
              : 'bg-slate-800 text-slate-200'
        }`}>
          {leg.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-lg font-display">{leg.runner}</span>
            {leg.night && <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm" title="夜間路段">🌙</span>}
            <span className={`px-2 py-0.5 rounded-full text-xs border ${difficulty.color}`}>
              {difficulty.emoji} {difficulty.text}
            </span>
            {isCurrent && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500 text-white animate-pulse">進行中</span>
            )}
          </div>
          <div className="text-slate-400 text-sm font-mono mt-1">
            <span className="text-slate-300">{leg.start}</span>
            <span className="mx-2">→</span>
            <span className="text-slate-300">{leg.end}</span>
            <span className="ml-3 text-orange-400">{leg.km}km</span>
            <span className="ml-2 text-slate-500">({leg.min}min)</span>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-700/30">
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">起點</p>
                <p className="text-slate-200 text-sm">{leg.startAddr}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">終點</p>
                <p className="text-slate-200 text-sm">{leg.endAddr}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: vehicles.find(v => v.name.includes(leg.car))?.color }} />
              <span className="text-slate-300 text-sm">{vehicles.find(v => v.name.includes(leg.car))?.name}</span>
              <span className="text-slate-500 text-sm">({vehicles.find(v => v.name.includes(leg.car))?.driver})</span>
              {leg.transferMin && (
                <span className="ml-3 text-slate-400 text-sm">⏱️ 交接準備 {leg.transferMin} 分鐘</span>
              )}
            </div>
            {(leg.gateOpen || leg.gateClose) && (
              <div className="flex gap-3">
                {leg.gateOpen && <span className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full text-sm">關門開始 {leg.gateOpen}</span>}
                {leg.gateClose && <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">關門 {leg.gateClose}</span>}
              </div>
            )}
            {leg.num === 30 ? (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2">
                <span className="text-green-400">🏁 終點預計抵達：{leg.end}</span>
              </div>
            ) : nextLeg && (
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg px-4 py-2">
                <span className="text-orange-400">下一棒：{nextLeg.runner} @ {nextLeg.start}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 棒次時間軸 ============
function LegsTimeline() {
  const [expandedLeg, setExpandedLeg] = useState<number | null>(null)
  const totalKm = legs.reduce((sum, leg) => sum + leg.km, 0)
  const totalMin = legs.reduce((sum, leg) => sum + leg.min, 0)
  const nightLegs = legs.filter(leg => leg.night)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold font-display">棒次時間軸</h3>
          <p className="text-slate-400 text-sm mt-1">
            {legs.length} 棒 • {totalKm.toFixed(1)}km • 約 {Math.round(totalMin / 60)}h {totalMin % 60}m
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="stat-card rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-orange-400 font-mono">{nightLegs.length}</p>
            <p className="text-slate-500 text-xs">夜跑棒</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {legs.map((leg) => (
          <LegCard key={leg.num} leg={leg} isExpanded={expandedLeg === leg.num}
            onToggle={() => setExpandedLeg(expandedLeg === leg.num ? null : leg.num)} />
        ))}
      </div>
    </div>
  )
}

// ============ 統計卡片 ============
function StatCard({ value, label, accent = false }: { value: string, label: string, accent?: boolean }) {
  return (
    <div className="stat-card rounded-xl px-4 py-3 text-center">
      <p className={`text-2xl font-bold font-mono ${accent ? 'text-orange-400' : 'text-white'}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-0.5">{label}</p>
    </div>
  )
}

// ============ 支援車輛卡片 ============
function VehicleCard({ vehicle }: { vehicle: typeof vehicles[0] }) {
  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vehicle.color }} />
        <span className="font-semibold text-lg font-display">{vehicle.name}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">司機</span>
          <span className="text-slate-200">{vehicle.driver}</span>
        </div>
        {vehicle.passengers && (
          <div className="flex justify-between">
            <span className="text-slate-500">乘客</span>
            <span className="text-slate-200">{vehicle.passengers}</span>
          </div>
        )}
        {vehicle.legs && (
          <div className="flex justify-between">
            <span className="text-slate-500">棒次</span>
            <span className="text-orange-400 font-mono text-xs">{vehicle.legs}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 主應用 ============
export default function App() {
  const totalKm = legs.reduce((sum, leg) => sum + leg.km, 0)
  const nightLegs = legs.filter(leg => leg.night).length

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)' }}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-500/30 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          {/* 日期標籤 */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-500/30">
            <span>🏃</span>
            <span>2026/4/11 (六) 04:30</span>
          </div>
          
          {/* 主標題 */}
          <h1 className="text-5xl md:text-7xl font-black font-display mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
              夸父追日
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
            CRUFU RUN 7th
          </p>
          {/* 隊名 - 頁面主體 */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 px-6 py-3 rounded-2xl mb-4">
            <span className="text-2xl">🏃</span>
            <span className="text-xl md:text-2xl font-bold text-white font-display">靠緣分組隊，靠意志完賽</span>
          </div>
          <p className="text-slate-400 text-lg mb-8">
            北台灣 220km 跨夜接力
          </p>
          
          {/* 統計數字 */}
          <div className="flex justify-center gap-6 md:gap-10 mb-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-orange-400 font-mono">{legs.length}</p>
              <p className="text-slate-500 text-sm mt-1">棒</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-amber-400 font-mono">{totalKm.toFixed(0)}</p>
              <p className="text-slate-500 text-sm mt-1">公里</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-yellow-400 font-mono">{nightLegs}</p>
              <p className="text-slate-500 text-sm mt-1">夜跑棒</p>
            </div>
          </div>
          
          {/* 倒數計時 */}
          <CountdownTimer />
        </div>
        
        {/* 底部斜切線 */}
        <div className="h-16 bg-gradient-to-b from-transparent to-slate-950/50 relative">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 transform -skew-y-1" />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        
        {/* 即時進度 */}
        <CurrentLegIndicator />
        
        {/* 快速資訊卡片 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard value="04:30" label="起跑時間" accent />
          <StatCard value="武荖坑" label="起點" />
          <StatCard value="~08:56" label="預計終點" />
          <StatCard value="~4/12" label="完賽日" />
        </section>

        {/* 路線地圖 */}
        <section>
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 font-display">
            <span className="text-orange-500">🗺️</span> 路線地圖
          </h2>
          <GPXMap />
        </section>
        <ElevationChart />

        {/* 棒次時間軸 */}
        <section>
          <LegsTimeline />
        </section>

        {/* 支援車輛 */}
        <section>
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 font-display">
            <span className="text-orange-500">🚗</span> 支援車輛
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (<VehicleCard key={vehicle.name} vehicle={vehicle} />))}
          </div>
        </section>

        {/* 實用資訊 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 天氣 */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display">
              <span>📅</span> 活動天氣
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌤️</span>
                <div>
                  <p className="font-semibold text-slate-200">Day 1 - 4/11 (六)</p>
                  <p className="text-sm text-slate-400">宜蘭 20-26°C • 降雨 20%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌙</span>
                <div>
                  <p className="font-semibold text-slate-200">Day 2 - 4/12 (日)</p>
                  <p className="text-sm text-slate-400">新北 21-27°C • 降雨 30%</p>
                </div>
              </div>
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-2">
                <p className="text-amber-400 text-sm">⚠️ 夜間山區偏涼，攜帶外套</p>
              </div>
            </div>
          </div>

          {/* 建議攜帶 */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display">
              <span>🎒</span> 建議攜帶
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🔦", name: "頭燈", note: "夜間必備" },
                { icon: "🧥", name: "保暖外套", note: "深夜必備" },
                { icon: "💧", name: "水壺/運動飲料", note: "補水必備" },
                { icon: "🦺", name: "反光背心", note: "安全加分" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 住宿資訊 */}
        <section className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-display">
            <span>🏨</span> 中途住宿
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <p className="font-semibold text-slate-200">水芳民宿</p>
              <p className="text-slate-400 text-sm">九份山城</p>
              <p className="text-slate-500 text-sm">Day 1 傍晚（約 18:30-19:00）</p>
            </div>
            <a href="https://maps.app.goo.gl/QUqAxnjEj55van9d6" target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 text-orange-400 text-sm hover:underline">
              📍 查看地圖
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-10 text-slate-500 text-sm border-t border-slate-800/50">
          <p className="text-lg font-display text-slate-400 mb-2">CRUFU RUN 7th 北台灣</p>
          <p className="text-slate-600">靠緣分組隊，靠意志完賽</p>
        </footer>
      </main>
    </div>
  )
}
