import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          AI Wellness Friend
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">Your Personalized Mental Health Companion</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track your daily moods and see patterns over time</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-purple-600">AI Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Talk to your personalized AI companion anytime</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-teal-600">Personalized Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get activity, music, and video recommendations</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full"
            >
              Login
            </Button>
          </Link>
        </div>

        <p className="text-gray-500 mt-8">Your mental wellness journey starts here</p>
      </div>
    </div>
  )
}
