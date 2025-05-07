"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Home, BarChart2, MessageSquare, BookOpen, Music, Settings, Menu, X } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/trends", label: "Trends", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/journal", label: "Journal", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/suggestions", label: "Suggestions", icon: <Music className="h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-full"></div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hidden md:block">
                AI Wellness Friend
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <UserAvatar className="h-8 w-8 ring-2 ring-blue-200 shadow-sm" />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-100">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
