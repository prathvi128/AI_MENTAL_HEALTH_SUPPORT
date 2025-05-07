"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserAvatar } from "@/components/user-avatar"
import { MessageSquare, BookOpen } from "lucide-react"

export default function ModeSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <UserAvatar className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">How would you like to express yourself today?</h1>
          <p className="text-gray-600">Choose your preferred mode of interaction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card
            className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/chat")}
          >
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center text-blue-700">Chat with AI Friend</CardTitle>
              <CardDescription className="text-center">
                Have a conversation with your AI companion using voice and video
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Speak naturally with your AI friend. Your expressions will be analyzed to provide better emotional
                support.
              </p>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => router.push("/chat")}
              >
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/journal")}
          >
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <BookOpen className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-center text-purple-700">Write in Journal</CardTitle>
              <CardDescription className="text-center">
                Express your thoughts and feelings through writing
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Write freely about your day, thoughts, or feelings. Your AI friend will provide thoughtful insights and
                analysis.
              </p>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                onClick={() => router.push("/journal")}
              >
                Start Writing
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
