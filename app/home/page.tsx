"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { MainNav } from "@/components/main-nav"

export default function HomePage() {
  const router = useRouter()

  // Automatically redirect to mood check-in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/mood-check-in")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <UserAvatar className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Friend!</h1>
          <p className="text-gray-600">Let's start your wellness journey today</p>
        </div>

        <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl text-center text-blue-700">Starting Your Daily Check-in</CardTitle>
            <CardDescription className="text-center">
              We'll guide you through your personalized wellness experience
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center my-6">
              <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600">Redirecting to your mood check-in...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
