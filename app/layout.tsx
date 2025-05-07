import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FloatingAvatar } from "@/components/floating-avatar"
import { ChatWidget } from "@/components/chat-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Wellness Friend",
  description: "Your Personalized Mental Health Companion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <FloatingAvatar />
        <ChatWidget />
      </body>
    </html>
  )
}
