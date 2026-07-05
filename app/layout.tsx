import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FancyHelper — Minecraft AI 管理插件',
  description: '用说人话的方式管理你的 Minecraft 服务器。输入 /cli 进入对话模式，像跟真人管理员聊天一样管服务器。支持 Spigot/Paper 1.18+，接入 CloudFlare、OpenAI、DeepSeek、Ollama 等多种 AI。',
  keywords: ['Minecraft', 'Spigot', 'Paper', 'AI', '插件', '服务器管理', 'FancyHelper', '命令生成'],
  authors: [{ name: 'baicaizhale' }],
  openGraph: {
    title: 'FancyHelper — Minecraft AI 管理插件',
    description: '用说人话的方式管理你的 Minecraft 服务器。不用背指令，不用翻 Wiki。',
    type: 'website',
    url: 'https://fancy.baicaizhale.top',
    siteName: 'FancyHelper',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FancyHelper — Minecraft AI 管理插件',
    description: '用说人话的方式管理你的 Minecraft 服务器。不用背指令，不用翻 Wiki。',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
