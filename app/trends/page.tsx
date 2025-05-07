"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Calendar, BarChart2, TrendingUp, Award } from "lucide-react"

// Sample mood data for visualization
const MOOD_DATA = [
  { date: "2023-05-01", mood: "happy", value: 8 },
  { date: "2023-05-02", mood: "calm", value: 7 },
  { date: "2023-05-03", mood: "anxious", value: 4 },
  { date: "2023-05-04", mood: "sad", value: 3 },
  { date: "2023-05-05", mood: "neutral", value: 5 },
  { date: "2023-05-06", mood: "happy", value: 8 },
  { date: "2023-05-07", mood: "content", value: 6 },
  { date: "2023-05-08", mood: "happy", value: 9 },
  { date: "2023-05-09", mood: "happy", value: 8 },
  { date: "2023-05-10", mood: "anxious", value: 4 },
  { date: "2023-05-11", mood: "calm", value: 7 },
  { date: "2023-05-12", mood: "content", value: 6 },
  { date: "2023-05-13", mood: "sad", value: 3 },
  { date: "2023-05-14", mood: "neutral", value: 5 },
]

// Get current date and previous dates for the calendar
const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

// Generate calendar days
const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1
  const date = new Date(currentYear, currentMonth, day)
  const dateString = date.toISOString().split("T")[0]
  const moodEntry = MOOD_DATA.find((d) => d.date === dateString)

  return {
    day,
    date,
    mood: moodEntry?.mood || null,
    value: moodEntry?.value || null,
  }
})

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState("calendar")

  // Calculate streak
  const currentStreak = 3 // This would be calculated based on consecutive days with entries
  const longestStreak = 5 // This would be the longest streak recorded

  // Calculate mood distribution
  const moodCounts = MOOD_DATA.reduce(
    (acc, { mood }) => {
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const getMoodColor = (mood: string | null) => {
    if (!mood) return "bg-gray-100"

    switch (mood) {
      case "happy":
        return "bg-green-400"
      case "calm":
        return "bg-blue-400"
      case "content":
        return "bg-teal-400"
      case "neutral":
        return "bg-gray-400"
      case "anxious":
        return "bg-yellow-400"
      case "sad":
        return "bg-indigo-400"
      case "angry":
        return "bg-red-400"
      default:
        return "bg-gray-200"
    }
  }

  const getMoodTextColor = (mood: string | null) => {
    if (!mood) return "text-gray-500"

    switch (mood) {
      case "happy":
        return "text-green-700"
      case "calm":
        return "text-blue-700"
      case "content":
        return "text-teal-700"
      case "neutral":
        return "text-gray-700"
      case "anxious":
        return "text-yellow-700"
      case "sad":
        return "text-indigo-700"
      case "angry":
        return "text-red-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Mood Trends</CardTitle>
                <CardDescription>Track your mood patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="calendar" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Calendar</span>
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>Chart</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-sm font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}

                      {/* Empty cells for days before the 1st of the month */}
                      {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-12 rounded-md"></div>
                      ))}

                      {calendarDays.map(({ day, mood, value }) => (
                        <div
                          key={day}
                          className={`h-12 rounded-md flex flex-col items-center justify-center border ${
                            mood ? `${getMoodColor(mood)} border-transparent` : "border-gray-200"
                          }`}
                        >
                          <span className={`text-sm font-medium ${mood ? "text-white" : "text-gray-700"}`}>{day}</span>
                          {value && (
                            <span className={`text-xs ${mood ? "text-white/80" : "text-gray-500"}`}>{value}/10</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span className="text-xs text-gray-600">Happy</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-xs text-gray-600">Calm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                        <span className="text-xs text-gray-600">Content</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-xs text-gray-600">Neutral</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="text-xs text-gray-600">Anxious</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                        <span className="text-xs text-gray-600">Sad</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <span className="text-xs text-gray-600">Angry</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="h-64 flex items-end gap-1">
                      {MOOD_DATA.map((entry, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`${getMoodColor(entry.mood)} w-full rounded-t-sm`}
                            style={{ height: `${entry.value * 10}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left">
                            {new Date(entry.date).getDate()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Mood Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(moodCounts).map(([mood, count]) => (
                          <div key={mood} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getMoodColor(mood)}`}></div>
                            <span className={`text-sm font-medium ${getMoodTextColor(mood)}`}>
                              {mood.charAt(0).toUpperCase() + mood.slice(1)}
                            </span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getMoodColor(mood)}`}
                                style={{ width: `${(count / MOOD_DATA.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{count} days</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Your Streak</CardTitle>
                <CardDescription>Keep up the good work!</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div>
                    <div className="text-3xl font-bold">{currentStreak}</div>
                    <div className="text-xs">days</div>
                  </div>
                </div>

                <p className="text-gray-600">You've checked in for {currentStreak} days in a row!</p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">Longest streak: {longestStreak} days</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Check In Today
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Weekly Summary</CardTitle>
                <CardDescription>Your mood patterns this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Most frequent mood</div>
                      <div className="text-gray-600">Happy (3 days)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 p-1 rounded-full">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Best day</div>
                      <div className="text-gray-600">Monday (9/10)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 text-purple-700 p-1 rounded-full">
                      <BarChart2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Average mood</div>
                      <div className="text-gray-600">6.4/10 (Content)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
