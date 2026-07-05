"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, HERO_REVEAL_MS } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { DevExSection } from "@/components/devex-section"

const GITHUB_URL = "https://github.com/baicaizhale/FancyHelper"
const MODRINTH_URL = "https://modrinth.com/plugin/fancyhelper"
const DOWNLOAD_URL = "https://fancy.baicaizhale.top/"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FancyHelperPage() {
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start hero image zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Hero background — zooms in once intro is done */}
        <img
          src="/images/hero-minecraft.png"
          alt="Minecraft 风格的方块世界"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            transform: videoReady ? "scale(1.05)" : "scale(0.85)",
            transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Progressive blur + light gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        {/* Backdrop blur layers — progressively lighter toward top */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Title */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light text-[#111] leading-[1.1] tracking-tight mb-10 text-balance"
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
            }}
          >
            用说人话的方式<br />管理你的<br />Minecraft 服务器。
          </h1>

          {/* 2 metrics — staggered after title */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "1.18+", label: "Spigot / Paper" },
              { value: "GPLv3", label: "自由开源" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms`,
                }}
              >
                <div className="text-3xl sm:text-4xl text-[#111] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 tracking-widest mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW (bento) ──────────────────────────────────────── */}
      <section id="platform" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>为什么是 FANCYHELPER</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15]">
              {"不用背指令，\n不用翻 Wiki。"}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-3" onMouseMove={handleMouse}>
            {/* Big top card */}
            <BentoCard className="col-span-12 p-8 min-h-[200px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              <img
                src="/images/arc.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 70%" }}
              />
              {/* Progressive blur layer */}
              <div className="absolute inset-0" style={{
                maskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }} />
              {/* Fade-to-background gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 35%, rgba(245,244,240,0.3) 50%, rgba(245,244,240,0.75) 65%, rgba(245,244,240,0.95) 80%, rgb(245,244,240) 100%)",
                }}
              />
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-white/60 flex items-center justify-center mb-6" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-xl font-light mb-3">聊天式管理</h3>
                <p className="text-sm text-black/45 leading-relaxed max-w-sm">
                  {"游戏里输入 /cli 进入对话模式，像跟真人管理员聊天一样管服务器。说\u201C把 baicaizhale 设成管理员\u201D，AI 自己生成指令、问你确认、然后执行。"}
                </p>
              </div>
            </BentoCard>

            {/* Bottom row */}
            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={120}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">实时状态条</h3>
              <p className="text-sm text-black/45 leading-relaxed">动作栏实时显示 AI 当前在干嘛——思考中、执行中、还是在等你确认。</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={160}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">内置 Wiki 搜索</h3>
              <p className="text-sm text-black/45 leading-relaxed">自带 LuckPerms、EssentialsX、WorldEdit 等主流插件文档预设，搜不到还能自动全网搜。</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={200}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 4v5h5"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">执行反馈闭环</h3>
              <p className="text-sm text-black/45 leading-relaxed">指令跑完的结果会回传给 AI——错了它能自己改，不用你反复解释。</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES (stacking cards) ────────────────────────────────── */}
      <section id="agents" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>核心能力</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.15]">
                {"装好即用的\n服务器 AI 管理员。"}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              从生成指令到安全兜底，FancyHelper 把整套流程都替你想好了。每一步都可控、可确认、可打断。
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="workflow" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>快速开始</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.15]">
              {"四步，从下载\n到开口说话。"}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "下载", desc: "下载 FancyHelper.jar，丢进服务器的 plugins 文件夹。", delay: 0, img: "/images/step-download.png" },
              { n: "02", title: "装依赖", desc: "安装 ProtocolLib，或直接用 /fancy lib install protocollib 一键搞定。", delay: 80, img: "/images/step-install.png" },
              { n: "03", title: "配置 AI", desc: "默认走 CloudFlare Workers AI，也可换成 OpenAI、DeepSeek、Ollama 等。", delay: 140, img: "/images/step-config.png" },
              { n: "04", title: "开聊", desc: "游戏里输 /cli，直接打字说需求，AI 生成指令等你确认执行。", delay: 200, img: "/images/step-chat.png" },
            ].map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={step.delay}>
                {/* Image at top — mask fades it out strongly before the bottom edge */}
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
                {/* Number top-left */}
                <div className="relative z-10 p-7">
                  <span className="font-pixel text-[11px] text-black/20 tracking-widest block">{step.n}</span>
                </div>
                {/* Text pushed further down */}
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PROVIDERS ──────────────────────────────────────────────────── */}
      <section id="integrations" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>多 AI 可选</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.15]">
                {"接哪家 AI，\n你说了算。"}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              默认接入 CloudFlare Workers AI（gpt-oss-120b），也支持 OpenAI、DeepSeek、Azure OpenAI，甚至 Ollama 本地模型。
            </p>
          </div>

          {/* Full-width image block with glass cards */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Image */}
            <div className="relative w-full h-[280px] md:h-[480px] shrink-0">
              <img
                src="/images/ai-network.png"
                alt="FancyHelper 连接多个 AI 提供商的架构示意"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Cards — flex row on mobile, absolute on desktop */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <Tag>CONFIG.YML</Tag>
                <h3 className="mt-3 text-lg font-light mb-2">改几行配置就能换</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">OpenAI 兼容端点随便接，本地模型也没问题。</p>
                <div className="bg-black/[0.05] rounded-lg border border-black/[0.07] p-3 font-mono text-[11px] text-black/50 leading-relaxed">
                  <span className="text-black/25"># config.yml</span><br />
                  <span className="text-blue-600/70">ai</span>:<br />
                  {"  "}<span className="text-amber-700/70">provider</span>: <span className="text-green-700/70">openai</span><br />
                  {"  "}<span className="text-amber-700/70">model</span>: <span className="text-green-700/70">deepseek-chat</span><br />
                  {"  "}<span className="text-amber-700/70">base_url</span>: <span className="text-green-700/70">...</span>
                </div>
              </div>

              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-xs text-black/40 tracking-widest">配置自动更新</span>
                </div>
                <p className="text-sm text-black/45">升级插件不用手动改配置文件，FancyHelper 会自己处理迁移。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SAFETY ────────────────────────────────────────────────────────── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>安全护栏</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.15]">
              {"AI 干活，\n但不会乱来。"}
            </RevealText>
          </div>

          {/* Asymmetric grid: left text, right live log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side — descriptions */}
            <div className="space-y-6">
              <p className="text-sm text-black/45 leading-relaxed">
                每条 AI 生成的指令都先给你看、再执行。就算开了 YOLO 模式，高危操作依然会停下来问你。
              </p>

              <div className="space-y-4">
                {[
                  { label: "执行前确认", desc: "AI 生成的指令默认需要手动 y/n 确认才会执行" },
                  { label: "高危操作拦截", desc: "op、ban、stop 这类指令即使在 YOLO 模式下也会先问你" },
                  { label: "防死循环", desc: "AI 若开始重复操作或疯狂调用，会被自动拦截" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-1 bg-black/10 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-sm font-light mb-1">{item.label}</h3>
                      <p className="text-xs text-black/35">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Control badges — vertical stack */}
              <div className="pt-4 flex flex-col gap-2">
                {["stop 随时打断 AI", "exit 一键退出 CLI", "/cli retry 重试上次响应", "细粒度权限节点"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs text-black/25">
                    <span className="w-1 h-1 rounded-full bg-black/25" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live log visualization */}
            <BentoCard className="p-6 lg:row-span-1" delay={0}>
              <div className="text-xs text-black/30 tracking-widest mb-4">实时执行日志</div>
              <div className="space-y-2">
                {[
                  { time: "12:34:21", action: "指令执行成功 → /lp user baicaizhale parent set admin", status: "success" },
                  { time: "12:34:18", action: "玩家已确认 (y)", status: "success" },
                  { time: "12:34:15", action: "等待确认 → 授予管理员权限", status: "success" },
                  { time: "12:34:12", action: "AI 生成指令 (gpt-oss-120b)", status: "success" },
                  { time: "12:34:09", action: "收到需求：把 baicaizhale 设成管理员", status: "success" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/[0.02] hover:bg-black/[0.04] transition-colors border border-black/[0.04] group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                    }}
                  >
                    <span className="text-[10px] text-black/25 font-mono min-w-[60px]">{log.time}</span>
                    <span className="text-[11px] text-black/50 font-light flex-1">{log.action}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-colors" />
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── QUICK START (interactive code panel) ──────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE CAPABILITIES ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["权限管理", "生成建筑", "调整天气时间", "玩家传送", "物品发放", "计分板设置", "WorldEdit 操作", "区域保护", "配置修改", "白名单管理"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                  <span className="text-sm text-black/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["LuckPerms", "EssentialsX", "WorldEdit", "Wiki 搜索", "游戏规则调整", "实体清理", "经济系统", "封禁管理", "定时任务", "公告推送"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 shrink-0" />
                  <span className="text-sm text-black/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE FEED ─────────────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>此时此刻</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15]">
                {"你睡觉的时候，\n它也在管服。"}
              </RevealText>
              <p className="mt-6 text-base text-black/40 leading-relaxed max-w-sm">
                从权限调整到建筑生成，从玩家投诉到配置排错——AI 管理员随叫随到，不用你翻文档。
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 text-sm mb-1 tracking-wide">个 GitHub Star</span>
              </div>
            </div>
            <div className="rounded-2xl border border-black/[0.06] overflow-hidden bg-white/40 p-4">
              <a href="https://www.star-history.com/?repos=baicaizhale%2FFancyHelper&type=date&logscale=&legend=top-left">
                <picture>
                  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=baicaizhale/FancyHelper&type=date&theme=dark&logscale&legend=top-left" />
                  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=baicaizhale/FancyHelper&type=date&logscale&legend=top-left" />
                  <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=baicaizhale/FancyHelper&type=date&logscale&legend=top-left" className="w-full h-auto" />
                </picture>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <PixelIcon type="pricing" size={40} />
            <div className="mt-4"><Tag>获取方式</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.15]">
              {"完全免费，随你怎么拿。"}
            </RevealText>
            <p className="mt-3 text-sm text-black/30">
              * FancyHelper 会进行自动更新，所以您无需在意下载的版本新旧
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" onMouseMove={handleMouse}>
            {[
              {
                name: "构建站",
                price: "免费",
                sub: "推荐的下载渠道",
                features: ["CI 自动构建", "抢先体验新功能", "包含开发版", "适合折腾党"],
                href: DOWNLOAD_URL,
                cta: "打开构建站",
                highlight: true,
                delay: 0,
              },
              {
                name: "MODRINTH",
                price: "免费",
                sub: "",
                features: ["下载速度较快", "下载到的版本可能落后"],
                href: MODRINTH_URL,
                cta: "去 MODRINTH 下载",
                delay: 80,
              },
              {
                name: "自助构建",
                price: "免费",
                sub: "源码在手，天下我有",
                features: ["GPLv3 开源", "Java 17 + Maven", "mvn clean package", "欢迎提 PR"],
                href: GITHUB_URL,
                cta: "查看源码",
                delay: 140,
              },
            ].map((plan) => (
              <BentoCard
                key={plan.name}
                className={`p-8 flex flex-col ${plan.highlight ? "border-black/20 bg-[#F0EEE8]" : ""}`}
                delay={plan.delay}
              >
                <div className="mb-8">
                  <div className="font-pixel text-[11px] tracking-widest text-black/40 mb-4">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-light">{plan.price}</span>
                  </div>
                  <p className="text-xs text-black/35 tracking-wide">{plan.sub}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-black/55">
                      <div className="w-1 h-1 rounded-full bg-black/25 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl text-sm tracking-widest text-center transition-all duration-200 ${
                    plan.highlight
                      ? "bg-[#111] text-white hover:bg-[#333]"
                      : "border border-black/10 text-black/60 hover:border-black/25 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {plan.cta}
                </a>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        {/* Glass panels image — anchored to bottom center */}
        <img
          src="/images/footer.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom — blends into site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Colour fade from bottom to site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] mb-6 text-balance">
            让 AI 替你<br />守着服务器。
          </h2>
          <p className="text-sm text-black/45 leading-relaxed mb-10">
            装上 FancyHelper，从此调权限、改配置、生成建筑，都只需要一句话。
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
            >
              立即下载
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-black/15 bg-white/60 text-black/70 text-sm rounded-xl hover:border-black/30 hover:text-black transition-colors tracking-widest"
            >
              GitHub 上给个 Star
            </a>
          </div>
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-pixel text-xs tracking-[0.25em] text-black/50">FANCYHELPER</span>

          {/* Nav sections */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "功能", href: "#platform" },
              { label: "核心能力", href: "#agents" },
              { label: "快速开始", href: "#workflow" },
              { label: "多 AI 支持", href: "#integrations" },
              { label: "安全", href: "#security" },
              { label: "下载", href: "#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          {/* External links */}
          <div className="flex items-center gap-6">
            {[
              { label: "GitHub", href: GITHUB_URL },
              { label: "Modrinth", href: MODRINTH_URL },
              { label: "构建站", href: DOWNLOAD_URL },
              { label: "Issues", href: `${GITHUB_URL}/issues` },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04]">
          <span className="text-xs text-black/20">© 2026 baicaizhale. 基于 GNU GPLv3 协议开源。</span>
        </div>
      </footer>
    </div>
  )
}
