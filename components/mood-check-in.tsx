"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/user-avatar"

interface MoodCheckInProps {
  onComplete: () => void
}

type Mood = {
  emoji: string
  label: string
  color: string
}

const MOODS: Mood[] = [
  { emoji: "😊", label: "Happy", color: "bg-green-100 text-green-700 border-green-200" },
  { emoji: "😌", label: "Calm", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { emoji: "🙂", label: "Content", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { emoji: "😐", label: "Neutral", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { emoji: "😕", label: "Confused", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { emoji: "😔", label: "Sad", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { emoji: "😡", label: "Angry", color: "bg-red-100 text-red-700 border-red-200" },
  { emoji: "😰", label: "Anxious", color: "bg-purple-100 text-purple-700 border-purple-200" },
]

export function MoodCheckIn({ onComplete }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [notes, setNotes] = useState("")
  const [step, setStep] = useState<"select" | "notes" | "feedback">("select")
  const [aiResponse, setAiResponse] = useState("")

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood)
    setStep("notes")
  }

  const handleNotesSubmit = () => {
    // In a real app, this would send the data to your backend
    // and get a response from the AI

    // Simulate AI response based on mood
    let response = ""
    if (selectedMood?.label === "Happy" || selectedMood?.label === "Content" || selectedMood?.label === "Calm") {
      response =
        "That's wonderful to hear! It's great that you're feeling positive today. Remember this feeling and what contributed to it."
    } else if (selectedMood?.label === "Neutral") {
      response =
        "Thanks for checking in. Even neutral days are important to track. Is there anything specific you'd like to focus on today?"
    } else {
      response =
        "I'm sorry you're not feeling your best today. Remember that all emotions are valid and temporary. Would you like some suggestions to help improve your mood?"
    }

    setAiResponse(response)
    setStep("feedback")
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
      <CardHeader>
        <CardTitle className="text-xl text-center text-blue-700">
          {step === "select" && "How are you feeling right now?"}
          {step === "notes" && `Feeling ${selectedMood?.label}`}
          {step === "feedback" && "Your AI Friend's Response"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === "select" && "Select the emoji that best represents your current mood"}
          {step === "notes" && "Would you like to add any notes about why you feel this way?"}
          {step === "feedback" && "Based on your mood check-in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "select" && (
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                className={`p-3 rounded-lg border-2 hover:border-blue-300 flex flex-col items-center transition-all ${
                  selectedMood?.label === mood.label ? "ring-2 ring-blue-500 border-blue-300" : "border-transparent"
                }`}
                onClick={() => handleMoodSelect(mood)}
              >
                <span className="text-3xl mb-1">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === "notes" && (
          <div className="space-y-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full ${selectedMood?.color}`}>
              <span className="text-xl mr-2">{selectedMood?.emoji}</span>
              <span className="font-medium">{selectedMood?.label}</span>
            </div>

            <Textarea
              placeholder="What's making you feel this way? (optional)"
              className="min-h-[120px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        {step === "feedback" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <UserAvatar className="h-10 w-10" />
              <div className="bg-blue-50 rounded-lg p-3 flex-1">
                <p className="text-gray-700">{aiResponse}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Your mood has been logged:</p>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${selectedMood?.color}`}>
                  <span className="mr-1">{selectedMood?.emoji}</span>
                  <span>{selectedMood?.label}</span>
                </div>
                {notes && <div className="text-sm text-gray-600 italic">"{notes}"</div>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === "select" && (
          <Button variant="ghost" onClick={onComplete}>
            Skip for now
          </Button>
        )}

        {step === "notes" && (
          <>
            <Button variant="ghost" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button onClick={handleNotesSubmit}>Submit</Button>
          </>
        )}

        {step === "feedback" && (
          <>
            <Button variant="ghost" onClick={() => setStep("notes")}>
              Edit
            </Button>
            <Button onClick={onComplete}>Done</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
