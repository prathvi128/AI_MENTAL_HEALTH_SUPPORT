"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SmilePlus, Quote, MessageCircle, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserAvatarProps {
  className?: string
  showPopover?: boolean
  showAnimation?: boolean
}

export function UserAvatar({ className, showPopover = false, showAnimation = false }: UserAvatarProps) {
  const router = useRouter()
  const [isBlinking, setIsBlinking] = useState(false)
  const [isWaving, setIsWaving] = useState(false)
  const [quote, setQuote] = useState("")

  // Avatar customization options (would be stored in user profile in a real app)
  const avatarStyle = {
    hairColor: "#8A5D3B",
    skinColor: "#F8D5C2",
    eyeColor: "#3B83BD",
    outfitColor: "#5E72EB",
    accessory: "glasses", // none, glasses, hat
    expression: "smile", // smile, neutral, wink
  }

  // Simulate blinking animation
  useEffect(() => {
    if (showAnimation) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      }, 5000)

      return () => clearInterval(blinkInterval)
    }
  }, [showAnimation])

  // Simulate occasional waving
  useEffect(() => {
    if (showAnimation) {
      const waveInterval = setInterval(() => {
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 1000)
      }, 15000)

      return () => clearInterval(waveInterval)
    }
  }, [showAnimation])

  // Motivational quotes
  const quotes = [
    "Every day is a fresh start.",
    "You are stronger than you think.",
    "Small steps lead to big changes.",
    "Your mental health matters.",
    "Be kind to yourself today.",
  ]

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }

  // Render the Bitmoji-style avatar
  const renderBitmoji = () => (
    <div className="relative w-full h-full">
      {/* Base face */}
      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: avatarStyle.skinColor }} />

      {/* Hair */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3 rounded-t-full"
        style={{ backgroundColor: avatarStyle.hairColor }}
      />

      {/* Eyes */}
      <div className="absolute top-[35%] left-0 right-0 flex justify-center space-x-4">
        <div className={`w-2 h-${isBlinking ? "0.5" : "2"} rounded-full bg-gray-800 transition-all duration-100`}>
          <div
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
            style={{ backgroundColor: avatarStyle.eyeColor }}
          />
        </div>
        <div className={`w-2 h-${isBlinking ? "0.5" : "2"} rounded-full bg-gray-800 transition-all duration-100`}>
          <div
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
            style={{ backgroundColor: avatarStyle.eyeColor }}
          />
        </div>
      </div>

      {/* Mouth */}
      <div className="absolute bottom-[30%] left-0 right-0 flex justify-center">
        {avatarStyle.expression === "smile" && (
          <div className="w-4 h-2 bg-white rounded-b-full border-t-0 border-2 border-gray-800" />
        )}
        {avatarStyle.expression === "neutral" && <div className="w-4 h-0.5 bg-gray-800 rounded-full" />}
        {avatarStyle.expression === "wink" && (
          <div className="w-4 h-1 bg-white rounded-b-full border-t-0 border-2 border-gray-800 transform rotate-12" />
        )}
      </div>

      {/* Accessories */}
      {avatarStyle.accessory === "glasses" && (
        <div className="absolute top-[35%] left-0 right-0 flex justify-center">
          <div className="w-10 h-2 border-2 border-gray-600 rounded-full" />
        </div>
      )}

      {/* Waving hand animation */}
      {isWaving && (
        <div className="absolute -bottom-2 -right-2 w-4 h-4 animate-wave">
          <div className="w-full h-full rounded-full" style={{ backgroundColor: avatarStyle.skinColor }} />
        </div>
      )}
    </div>
  )

  // Simple avatar without popover
  if (!showPopover) {
    return (
      <Avatar className={className}>
        <AvatarImage src="/placeholder.svg?height=100&width=100" alt="User avatar" />
        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
          {renderBitmoji()}
        </AvatarFallback>
      </Avatar>
    )
  }

  // Avatar with popover for quick actions
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`relative ${className} rounded-full overflow-hidden hover:ring-4 hover:ring-blue-200 transition-all duration-200 ${isWaving ? "animate-bounce" : ""}`}
        >
          <Avatar className="w-full h-full">
            <AvatarImage src="/placeholder.svg?height=100&width=100" alt="User avatar" />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
              {renderBitmoji()}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=100&width=100" alt="User avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {renderBitmoji()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">AI Wellness Friend</h3>
                <p className="text-sm text-gray-500">How can I help you today?</p>
              </div>
            </div>

            {quote && <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-700">{quote}</div>}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={() => router.push("/mood-check-in")}
              >
                <SmilePlus className="h-4 w-4" />
                <span>Mood Check</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={getRandomQuote}
              >
                <Quote className="h-4 w-4" />
                <span>Quote</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={() => {
                  // Open the chat widget
                  const event = new CustomEvent("toggleChatWidget")
                  window.dispatchEvent(event)
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
