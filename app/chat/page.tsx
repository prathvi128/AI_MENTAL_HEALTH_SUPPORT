"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { MainNav } from "@/components/main-nav"
import { Mic, Send, Camera, CameraOff, MicOff, Video, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

type EmotionData = {
  happy: number
  sad: number
  angry: number
  surprised: number
  neutral: number
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesisUtterance: any
    speechSynthesis: any
  }
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! How can I help you today? You can type or use your voice to chat with me.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showEmotionPanel, setShowEmotionPanel] = useState(false)
  const [emotionData, setEmotionData] = useState<EmotionData>({
    happy: 10,
    sad: 5,
    angry: 2,
    surprised: 8,
    neutral: 75,
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      setIsSpeechSupported(isSupported)

      if (!isSupported) {
        setErrorMessage("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      }
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && isSpeechSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      // Create a new instance for each initialization to avoid stale state
      const initRecognition = () => {
        // Clean up any existing instance
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null
          recognitionRef.current.onend = null
          recognitionRef.current.onerror = null
          recognitionRef.current.abort()
          recognitionRef.current = null
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 1

        recognition.onresult = (event) => {
          // Clear any timeout when we get results
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          // Get the transcript from the most recent result
          const transcript = event.results[event.results.length - 1][0].transcript
          setInputValue(transcript)

          // If this is a final result, send the message
          if (event.results[event.results.length - 1].isFinal) {
            handleSendMessage(transcript)
            setIsRecording(false)
          }
        }

        recognition.onend = () => {
          setIsRecording(false)
          // Clear any timeout when recognition ends
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error)

          // Clear any timeout when we get an error
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          // Handle specific error types
          if (event.error === "no-speech") {
            setErrorMessage("I didn't hear anything. Please try speaking again or use text input.")

            // Auto-retry up to 2 times if no speech is detected
            if (retryCount < 2) {
              setRetryCount((prev) => prev + 1)
              setErrorMessage(`I didn't hear anything. Retrying... (${retryCount + 1}/3)`)

              // Wait a moment before retrying
              setTimeout(() => {
                try {
                  recognition.start()
                } catch (err) {
                  console.error("Error restarting speech recognition:", err)
                  setIsRecording(false)
                  setErrorMessage("Could not restart speech recognition. Please try again.")
                }
              }, 300)
            } else {
              // Reset retry count after max retries
              setRetryCount(0)
              setIsRecording(false)
            }
          } else if (event.error === "aborted") {
            // Do nothing for aborted - this is a normal cancellation
            setErrorMessage("")
          } else if (event.error === "network") {
            setErrorMessage("Network error. Please check your internet connection.")
            setIsRecording(false)
          } else if (event.error === "not-allowed") {
            setErrorMessage("Microphone access denied. Please check your browser permissions.")
            setIsRecording(false)
          } else {
            // Handle other errors
            setErrorMessage(`Microphone error: ${event.error}. Please try again.`)
            setIsRecording(false)
          }

          // Clear error message after a delay
          setTimeout(() => setErrorMessage(""), 5000)
        }

        recognitionRef.current = recognition
      }

      // Initialize recognition
      initRecognition()
    }

    // Speak the welcome message
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTimeout(() => {
        speakResponse("Hi there! How can I help you today? You can type or use your voice to chat with me.")
      }, 1000)
    }

    return () => {
      // Clean up recognition
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.abort()
      }

      // Clear any timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Stop speech synthesis
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeechSupported])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        const stream = videoRef.current?.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [])

  // Simulate emotion detection with random values
  useEffect(() => {
    if (isCameraOn) {
      const interval = setInterval(() => {
        // Simulate emotion detection with slight random changes
        setEmotionData((prev) => ({
          happy: Math.min(100, Math.max(0, prev.happy + (Math.random() * 10 - 5))),
          sad: Math.min(100, Math.max(0, prev.sad + (Math.random() * 6 - 3))),
          angry: Math.min(100, Math.max(0, prev.angry + (Math.random() * 4 - 2))),
          surprised: Math.min(100, Math.max(0, prev.surprised + (Math.random() * 8 - 4))),
          neutral: Math.min(100, Math.max(0, prev.neutral + (Math.random() * 10 - 5))),
        }))
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isCameraOn])

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setRetryCount(0)

      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else {
      // Start recording
      if (!isSpeechSupported) {
        setErrorMessage("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
        setTimeout(() => setErrorMessage(""), 5000)
        return
      }

      try {
        // Reset retry count
        setRetryCount(0)

        // Set a message to indicate we're listening
        setInputValue("Listening...")
        setErrorMessage("")

        // Make sure recognition is initialized
        if (!recognitionRef.current) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = "en-US"
          recognitionRef.current.maxAlternatives = 1

          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript
            setInputValue(transcript)

            if (event.results[event.results.length - 1].isFinal) {
              handleSendMessage(transcript)
              setIsRecording(false)
            }
          }

          recognitionRef.current.onend = () => {
            setIsRecording(false)
          }

          recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error)

            if (event.error === "no-speech") {
              setErrorMessage("I didn't hear anything. Please try speaking again or use text input.")
            } else if (event.error !== "aborted") {
              setErrorMessage(`Microphone error: ${event.error}. Please try again.`)
            }

            setIsRecording(false)
            setTimeout(() => setErrorMessage(""), 5000)
          }
        }

        // Start recognition after a short delay to ensure UI updates
        setTimeout(() => {
          try {
            recognitionRef.current.start()
            setIsRecording(true)

            // Set a timeout to automatically stop recording after 10 seconds
            timeoutRef.current = setTimeout(() => {
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.stop()
                setIsRecording(false)
                setErrorMessage("Listening timed out. Please try again.")
                setTimeout(() => setErrorMessage(""), 5000)
              }
            }, 10000)
          } catch (err) {
            console.error("Error starting speech recognition:", err)
            setErrorMessage("Could not start speech recognition. Please try again.")
            setInputValue("")
            setTimeout(() => setErrorMessage(""), 5000)
          }
        }, 100)
      } catch (err) {
        console.error("Error setting up speech recognition:", err)
        setErrorMessage("Could not access microphone. Please check your permissions.")
        setInputValue("")
        setTimeout(() => setErrorMessage(""), 5000)
      }
    }
  }

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim() || text === "Listening...") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Generate AI response
    generateResponse(text)
  }

  const generateResponse = (userInput: string) => {
    // Simulate AI response generation
    setTimeout(() => {
      // Simple context-aware responses based on keywords
      let response = ""
      const input = userInput.toLowerCase()

      if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
        response = "Hello! How are you feeling today?"
      } else if (input.includes("how are you")) {
        response = "I'm here and ready to help you! How about you?"
      } else if (input.includes("sad") || input.includes("depressed") || input.includes("unhappy")) {
        response =
          "I'm sorry to hear you're feeling down. Would you like to talk about what's bothering you, or perhaps try a mood-lifting activity?"
      } else if (input.includes("happy") || input.includes("good") || input.includes("great")) {
        response = "That's wonderful to hear! What's contributing to your positive mood today?"
      } else if (input.includes("anxious") || input.includes("worried") || input.includes("stress")) {
        response =
          "I understand anxiety can be challenging. Would you like to try a quick breathing exercise to help calm your mind?"
      } else if (input.includes("tired") || input.includes("exhausted") || input.includes("sleep")) {
        response =
          "Rest is important for mental health. Have you been having trouble sleeping? I can suggest some relaxation techniques."
      } else if (input.includes("thank")) {
        response = "You're very welcome! I'm always here to support you."
      } else if (input.includes("bye") || input.includes("goodbye")) {
        response = "Take care! Remember I'm here whenever you need to talk."
      } else {
        response = "I appreciate you sharing that with me. How does that make you feel?"
      }

      // If camera is on, use emotion data to customize response
      if (isCameraOn) {
        const dominantEmotion = Object.entries(emotionData).reduce(
          (max, [emotion, value]) => (value > max.value ? { emotion, value } : max),
          { emotion: "neutral", value: 0 },
        )

        if (dominantEmotion.emotion === "happy" && dominantEmotion.value > 30) {
          response += " I can see you're in good spirits today, which is wonderful!"
        } else if (dominantEmotion.emotion === "sad" && dominantEmotion.value > 30) {
          response += " I notice you might be feeling a bit down. Remember it's okay to have these feelings."
        } else if (dominantEmotion.emotion === "angry" && dominantEmotion.value > 30) {
          response += " I sense some frustration. Taking a few deep breaths might help center your thoughts."
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Speak the response
      speakResponse(response)
    }, 1000)
  }

  const speakResponse = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Get available voices and select a female voice if available
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("Female"))
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.rate = 1.0
      utterance.pitch = 1.1
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleCamera = async () => {
    if (isCameraOn) {
      setIsCameraOn(false)
      setShowEmotionPanel(false)
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setIsCameraOn(true)
        setShowEmotionPanel(true)
      } catch (err) {
        console.error("Error accessing camera:", err)
        setErrorMessage("Could not access camera. Please check your permissions.")
        setTimeout(() => setErrorMessage(""), 5000)
      }
    }
  }

  const handleContinue = () => {
    router.push("/suggestions")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <MainNav />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <Card className="md:col-span-2 flex flex-col max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl text-center text-blue-700">Chat with Your AI Friend</CardTitle>
              <CardDescription className="text-center">
                I'm here to listen and support you. You can type or use your voice to chat with me.
              </CardDescription>

              {errorMessage && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {!isSpeechSupported && (
                <Alert className="mt-2 bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertDescription>
                    Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice
                    features.
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "ai" && <UserAvatar className="h-8 w-8 mr-2 mt-1" />}

                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    {message.sender === "user" && (
                      <div className="h-8 w-8 ml-2 mt-1" /> // Spacer for alignment
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  className={isCameraOn ? "bg-blue-100 text-blue-700" : ""}
                  onClick={toggleCamera}
                >
                  {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className={`${isRecording ? "bg-red-100 text-red-700" : ""} ${isRecording ? "animate-pulse" : ""}`}
                  onClick={toggleRecording}
                  disabled={!isSpeechSupported}
                >
                  {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Input
                  placeholder={isRecording ? "Listening... (speak now)" : "Type your message..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                  disabled={isRecording}
                />

                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || inputValue === "Listening..."}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Continue to Suggestions
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Webcam and Emotion Panel */}
          <div className={`flex flex-col gap-4 ${!isCameraOn && "hidden md:flex"}`}>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">Video Feed</CardTitle>
              </CardHeader>
              <CardContent>
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full rounded-md border border-gray-200"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-[200px] bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </CardContent>
            </Card>

            {showEmotionPanel && (
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-700">Emotion Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Happy</span>
                        <span>{Math.round(emotionData.happy)}%</span>
                      </div>
                      <Progress value={emotionData.happy} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Sad</span>
                        <span>{Math.round(emotionData.sad)}%</span>
                      </div>
                      <Progress value={emotionData.sad} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Angry</span>
                        <span>{Math.round(emotionData.angry)}%</span>
                      </div>
                      <Progress value={emotionData.angry} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Surprised</span>
                        <span>{Math.round(emotionData.surprised)}%</span>
                      </div>
                      <Progress value={emotionData.surprised} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>{Math.round(emotionData.neutral)}%</span>
                      </div>
                      <Progress value={emotionData.neutral} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Emotion detection helps provide better support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
