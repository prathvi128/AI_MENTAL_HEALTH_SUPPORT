"use client"

import React, { useEffect, useRef, useState } from "react"
import * as faceapi from "face-api.js"

const moodSuggestions: Record<string, { youtube: string[]; spotify: string[] }> = {
  happy: {
    youtube: [
      "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
      "https://www.youtube.com/watch?v=60ItHLz5WEA",
      "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    ],
    spotify: [
      "https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr",
      "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb",
      "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    ],
  },
  sad: {
    youtube: [
      "https://www.youtube.com/watch?v=92i5m3tV5XY",
      "https://www.youtube.com/watch?v=J_ub7Etch2U",
      "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
    ],
    spotify: [
      "https://open.spotify.com/track/4VqPOruhp5EdPBeR92t6lQ",
      "https://open.spotify.com/track/0ZQX1yC0lJ8K0nUMDLJfE4",
      "https://open.spotify.com/track/7J4rjzS1Or3Akw1JrOqxn9",
    ],
  },
  neutral: {
    youtube: [
      "https://www.youtube.com/watch?v=5qap5aO4i9A",
      "https://www.youtube.com/watch?v=lTRiuFIWV54",
      "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    ],
    spotify: [
      "https://open.spotify.com/track/6I9VzXrHxO9rA9A5euc8Ak",
      "https://open.spotify.com/track/7sO5G9EABYOXQKNPNiE9NR",
      "https://open.spotify.com/track/2takcwOaAZWiXQijPHIx7B",
    ],
  },
  angry: {
    youtube: [
      "https://www.youtube.com/watch?v=Q0oIoR9mLwc",
      "https://www.youtube.com/watch?v=09R8_2nJtjg",
      "https://www.youtube.com/watch?v=RgKAFK5djSk",
    ],
    spotify: [
      "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
      "https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWncaom",
      "https://open.spotify.com/track/4kLLWzj79OQR0zsPne2rqP",
    ],
  },
}

const FaceMoodDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("Loading models...")

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      setLoading(false)
      setStatus("Models loaded. Starting webcam...")
    }
    loadModels()
  }, [])

  useEffect(() => {
    if (!loading) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setStatus("Webcam active. Click 'Detect Mood'")
          }
        })
        .catch((err) => setStatus("Webcam access denied."))
    }
  }, [loading])

  const detectMood = async () => {
    setStatus("Detecting mood...")
    if (!videoRef.current) return

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()

    if (detection?.expressions) {
      const mood = Object.entries(detection.expressions).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0]

      const moodKey = mood.toLowerCase()
      setStatus(`Mood detected: ${moodKey}`)

      const suggestion = moodSuggestions[moodKey]
      if (suggestion) {
        suggestion.youtube.forEach((url) => window.open(url, "_blank"))
        suggestion.spotify.forEach((url) => window.open(url, "_blank"))
      } else {
        setStatus("No suggestions for detected mood.")
      }
    } else {
      setStatus("No face detected. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Facial Mood Detector</h1>
      <p className="text-sm text-gray-600">{status}</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        width={480}
        height={360}
        className="rounded shadow"
      />
      <button
        onClick={detectMood}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Detect Mood
      </button>
    </div>
  )
}

export default FaceMoodDetector
