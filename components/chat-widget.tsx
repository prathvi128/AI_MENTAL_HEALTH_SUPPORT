"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { Mic, Send, X, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
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

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! How can I help you today? You can type or use your voice to chat with me.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
      setIsSpeechSupported(isSupported)
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
            setIsListening(false)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
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
                  setIsListening(false)
                  setErrorMessage("Could not restart speech recognition. Please try again.")
                }
              }, 300)
            } else {
              // Reset retry count after max retries
              setRetryCount(0)
              setIsListening(false)
            }
          } else if (event.error === "aborted") {
            // Do nothing for aborted - this is a normal cancellation
            setErrorMessage("")
          } else if (event.error === "network") {
            setErrorMessage("Network error. Please check your internet connection.")
            setIsListening(false)
          } else if (event.error === "not-allowed") {
            setErrorMessage("Microphone access denied. Please check your browser permissions.")
            setIsListening(false)
          } else {
            // Handle other errors
            setErrorMessage(`Microphone error: ${event.error}. Please try again.`)
            setIsListening(false)
          }

          // Clear error message after a delay
          setTimeout(() => setErrorMessage(""), 5000)
        }

        recognitionRef.current = recognition
      }

      // Initialize recognition
      initRecognition()
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
    }
  }, [isSpeechSupported, retryCount])

  // Listen for toggle events
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }

    window.addEventListener("toggleChatWidget", handleToggle)
    return () => window.removeEventListener("toggleChatWidget", handleToggle)
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false)
      setRetryCount(0)

      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else {
      // Start listening
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
              setIsListening(false)
            }
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error)

            if (event.error === "no-speech") {
              setErrorMessage("I didn't hear anything. Please try speaking again or use text input.")
            } else if (event.error !== "aborted") {
              setErrorMessage(`Microphone error: ${event.error}. Please try again.`)
            }

            setIsListening(false)
            setTimeout(() => setErrorMessage(""), 5000)
          }
        }

        // Start recognition after a short delay to ensure UI updates
        setTimeout(() => {
          try {
            recognitionRef.current.start()
            setIsListening(true)

            // Set a timeout to automatically stop recording after 10 seconds
            timeoutRef.current = setTimeout(() => {
              if (recognitionRef.current && isListening) {
                recognitionRef.current.stop()
                setIsListening(false)
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

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <UserAvatar className="w-10 h-10" />
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className={`w-80 ${isMinimized ? "h-auto" : "h-96"} shadow-xl border-blue-100 overflow-hidden`}>
          <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserAvatar className="h-8 w-8" />
              <div>
                <h3 className="text-sm font-medium">AI Wellness Friend</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto h-[calc(100%-96px)]">
                {errorMessage && (
                  <Alert variant="destructive" className="mb-3">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && <UserAvatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0" />}

                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t">
                <div className="flex items-center gap-2 w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`flex-shrink-0 ${isListening ? "bg-red-100 text-red-700 animate-pulse" : ""}`}
                    onClick={toggleListening}
                    disabled={!isSpeechSupported}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  {isSpeaking && (
                    <Button variant="outline" size="icon" className="flex-shrink-0" onClick={stopSpeaking}>
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  )}

                  {!isSpeaking && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => {
                        // Replay the last AI message
                        const lastAiMessage = [...messages].reverse().find((m) => m.sender === "ai")
                        if (lastAiMessage) {
                          speakResponse(lastAiMessage.content)
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}

                  <Input
                    placeholder={isListening ? "Listening... (speak now)" : "Type a message..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="text-sm"
                    disabled={isListening}
                  />

                  <Button
                    variant="default"
                    size="icon"
                    className="flex-shrink-0 bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || inputValue === "Listening..."}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
