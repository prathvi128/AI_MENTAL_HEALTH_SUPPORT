"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Music, Video, Activity, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

type Suggestion = {
  id: string
  title: string
  description: string
  imageUrl: string
  link?: string
}

const MUSIC_SUGGESTIONS: Suggestion[] = [
  {
    id: "m1",
    title: "Calm Piano Playlist",
    description: "Relaxing piano music to help you unwind and focus",
    imageUrl: "https://picsum.photos/seed/piano/200/200",
    link: "https://open.spotify.com/track/7cv28LXcjACFshn6gRjU4T",
  },
  {
    id: "m2",
    title: "Nature Sounds",
    description: "Peaceful sounds of nature to reduce anxiety",
    imageUrl: "https://picsum.photos/seed/nature/200/200",
    link: "https://open.spotify.com/track/1c8gk2PeTE04A1pIDH9YMk",
  },
  {
    id: "m3",
    title: "Upbeat Morning Mix",
    description: "Energizing music to start your day on a positive note",
    imageUrl: "https://picsum.photos/seed/upbeat/200/200",
    link: "https://open.spotify.com/track/3QTP7fW3Jx51fGlrYJuE9v",
  },
]

const VIDEO_SUGGESTIONS: Suggestion[] = [
  {
    id: "v1",
    title: "5-Minute Meditation",
    description: "A quick guided meditation to center yourself",
    imageUrl: "https://picsum.photos/seed/meditation/200/200",
    link: "https://www.youtube.com/watch?v=inpok4MKVLM",
  },
  {
    id: "v2",
    title: "Gentle Yoga Flow",
    description: "Easy yoga sequence to release tension",
    imageUrl: "https://picsum.photos/seed/yoga/200/200",
    link: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
  },
  {
    id: "v3",
    title: "Positive Affirmations",
    description: "Boost your mood with these affirmations",
    imageUrl: "https://picsum.photos/seed/affirmations/200/200",
    link: "https://www.youtube.com/watch?v=5cL5yL3-nz4",
  },
]

const ACTIVITY_SUGGESTIONS: Suggestion[] = [
  {
    id: "a1",
    title: "Mindful Walking",
    description: "Take a 10-minute walk while focusing on your surroundings",
    imageUrl: "https://picsum.photos/seed/walking/200/200",
  },
  {
    id: "a2",
    title: "Gratitude Journaling",
    description: "Write down 3 things you're grateful for today",
    imageUrl: "https://picsum.photos/seed/journaling/200/200",
  },
  {
    id: "a3",
    title: "Deep Breathing Exercise",
    description: "Practice 4-7-8 breathing to calm your nervous system",
    imageUrl:  "https://picsum.photos/seed/breathing/200/200",
  },
]

export default function SuggestionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("music")
  const [likedSuggestions, setLikedSuggestions] = useState<string[]>([])

  const toggleLike = (id: string) => {
    if (likedSuggestions.includes(id)) {
      setLikedSuggestions(likedSuggestions.filter((item) => item !== id))
    } else {
      setLikedSuggestions([...likedSuggestions, id])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl text-center text-blue-700">Personalized Suggestions</CardTitle>
            <CardDescription className="text-center">
              Activities, music, and videos tailored to your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="music" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>Music</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Activities</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="music" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {MUSIC_SUGGESTIONS.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={suggestion.imageUrl || "/placeholder.svg"}
                        alt={suggestion.title}
                        className="w-full h-40 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{suggestion.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLike(suggestion.id)}
                          className={likedSuggestions.includes(suggestion.id) ? "text-red-500" : ""}
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${likedSuggestions.includes(suggestion.id) ? "fill-red-500" : ""}`}
                          />
                          {likedSuggestions.includes(suggestion.id) ? "Liked" : "Like"}
                        </Button>

                        {suggestion.link && (
                          <Button size="sm" asChild>
                            <a href={suggestion.link} target="_blank" rel="noopener noreferrer">
                              Listen
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {VIDEO_SUGGESTIONS.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={suggestion.imageUrl || "/placeholder.svg"}
                        alt={suggestion.title}
                        className="w-full h-40 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{suggestion.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLike(suggestion.id)}
                          className={likedSuggestions.includes(suggestion.id) ? "text-red-500" : ""}
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${likedSuggestions.includes(suggestion.id) ? "fill-red-500" : ""}`}
                          />
                          {likedSuggestions.includes(suggestion.id) ? "Liked" : "Like"}
                        </Button>

                        {suggestion.link && (
                          <Button size="sm" asChild>
                            <a href={suggestion.link} target="_blank" rel="noopener noreferrer">
                              Watch
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ACTIVITY_SUGGESTIONS.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={suggestion.imageUrl || "/placeholder.svg"}
                        alt={suggestion.title}
                        className="w-full h-40 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{suggestion.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLike(suggestion.id)}
                          className={likedSuggestions.includes(suggestion.id) ? "text-red-500" : ""}
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${likedSuggestions.includes(suggestion.id) ? "fill-red-500" : ""}`}
                          />
                          {likedSuggestions.includes(suggestion.id) ? "Liked" : "Like"}
                        </Button>

                        <Button size="sm">Try Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => router.push("/home")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Complete Today's Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
