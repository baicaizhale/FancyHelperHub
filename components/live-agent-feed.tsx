"use client"

import { useEffect, useState, useRef } from "react"

const AGENT_NAMES = [
  "fancy-7f2a", "fancy-3b1c", "fancy-9d4e", "fancy-2c8f",
  "fancy-5a3d", "fancy-1e9b", "fancy-4f2c", "fancy-8d1a",
  "fancy-6b3e", "fancy-0c7f",
]

const TASKS = [
  "把 baicaizhale 设成管理员",
  "生成 10x10 的石头平台",
  "调整重生点到主城",
  "把天气改成晴天并锁定白天",
  "给 zip8919 发放 64 个钻石",
  "配置 LuckPerms 建筑师权限组",
  "清理掉落物和多余实体",
  "搜索 WorldEdit 的 //stack 用法",
  "为新手区设置区域保护",
  "把 keepInventory 设为 true",
  "封禁恶意玩家并广播公告",
  "修复 server.properties 配置",
  "创建 VIP 传送点",
  "重载插件配置文件",
]

const REGIONS = ["生存服", "创造服", "小游戏服", "主城", "资源服"]
const STATUSES = [
  { label: "执行中", color: "#4ade80" },
  { label: "执行中", color: "#4ade80" },
  { label: "执行中", color: "#4ade80" },
  { label: "待确认", color: "#facc15" },
  { label: "已完成", color: "#60a5fa" },
]

type AgentRow = {
  id: string
  name: string
  task: string
  region: string
  status: typeof STATUSES[number]
  progress: number
  elapsed: string
  key: number
}

function randomRow(key: number): AgentRow {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
    task: TASKS[Math.floor(Math.random() * TASKS.length)],
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    progress: Math.floor(Math.random() * 85 + 10),
    elapsed: `${Math.floor(Math.random() * 14 + 1)}m ${Math.floor(Math.random() * 59)}s`,
    key,
  }
}

// Animated progress bar that slowly ticks forward
function ProgressBar({ initial }: { initial: number }) {
  const [pct, setPct] = useState(initial)
  const rafRef = useRef<number>(0)
  const pctRef = useRef(initial)

  useEffect(() => {
    const tick = () => {
      pctRef.current = Math.min(99, pctRef.current + 0.015)
      setPct(Math.round(pctRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div style={{ width: "100%", height: 2, background: "rgba(0,0,0,0.08)", borderRadius: 9 }}>
      <div style={{
        height: "100%", borderRadius: 9,
        width: `${pct}%`,
        background: "rgba(0,0,0,0.35)",
        transition: "width 0.5s linear",
      }} />
    </div>
  )
}

// Stable seed rows — same on server and client, no random values
const SEED_ROWS: AgentRow[] = [
  { id: "A1B2C3", name: "fancy-7f2a", task: "把 baicaizhale 设成管理员",       region: "生存服",   status: STATUSES[0], progress: 42, elapsed: "3m 12s", key: 0 },
  { id: "D4E5F6", name: "fancy-3b1c", task: "生成 10x10 的石头平台",           region: "创造服",   status: STATUSES[0], progress: 67, elapsed: "7m 48s", key: 1 },
  { id: "G7H8I9", name: "fancy-2c8f", task: "封禁恶意玩家并广播公告",           region: "小游戏服", status: STATUSES[3], progress: 18, elapsed: "1m 05s", key: 2 },
  { id: "J0K1L2", name: "fancy-5a3d", task: "配置 LuckPerms 建筑师权限组",     region: "主城",     status: STATUSES[0], progress: 55, elapsed: "5m 30s", key: 3 },
  { id: "M3N4O5", name: "fancy-8d1a", task: "清理掉落物和多余实体",             region: "资源服",   status: STATUSES[0], progress: 80, elapsed: "11m 22s", key: 4 },
  { id: "P6Q7R8", name: "fancy-9d4e", task: "把天气改成晴天并锁定白天",         region: "生存服",   status: STATUSES[4], progress: 99, elapsed: "14m 01s", key: 5 },
]

export function LiveAgentFeed() {
  const [rows, setRows] = useState<AgentRow[]>(SEED_ROWS)
  const [mounted, setMounted] = useState(false)
  const keyRef = useRef(100)

  useEffect(() => {
    // Hydrate with random data only after client mount
    setMounted(true)
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))

    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(255,255,255,0.7)",
    }}>
      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 80px 70px",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.03)",
      }}>
        {["会话", "任务", "服务器", "状态"].map(h => (
          <span key={h} style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(0,0,0,0.30)", fontFamily: "monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ overflow: "hidden" }}>
        {rows.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 80px 70px",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              gap: 8,
              alignItems: "center",
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
            }}
          >
            {/* Agent */}
            <div>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(0,0,0,0.65)", marginBottom: 1 }}>{row.name}</div>
              <div style={{ fontSize: 7.5, fontFamily: "monospace", color: "rgba(0,0,0,0.25)" }}>#{row.id}</div>
            </div>

            {/* Task + progress */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 9, color: "rgba(0,0,0,0.50)", lineHeight: 1.35, marginBottom: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{row.task}</div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Region */}
            <div style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(0,0,0,0.30)" }}>{row.region}</div>

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: row.status.color,
                boxShadow: row.status.label === "执行中" ? `0 0 6px ${row.status.color}` : "none",
                animation: row.status.label === "执行中" ? "statusPulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(0,0,0,0.35)" }}>{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export function LiveAgentCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch("https://api.github.com/repos/baicaizhale/FancyHelper")
      .then(r => r.json())
      .then(d => { if (d.stargazers_count != null) setCount(d.stargazers_count) })
      .catch(() => {})
  }, [])

  const display = count ?? 0

  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "clamp(3rem, 6vw, 5rem)",
      fontWeight: 300,
      color: "rgba(0,0,0,0.85)",
      lineHeight: 1,
      letterSpacing: "-0.02em",
      transition: "color 0.3s ease",
    }}>
      {mounted ? display.toLocaleString("en-US") : "0"}
    </span>
  )
}
