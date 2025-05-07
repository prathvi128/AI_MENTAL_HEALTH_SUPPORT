"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface JournalEntry {
  id: string
  content: string
  sentiment: "positive" | "negative" | "neutral"
  analysis: string
  date: Date
}

const moodRedirects = {
  positive: {
    spotify: [
      "https://open.spotify.com/track/1BxfuPKGuaTgP7aM0Bbdwr", // Olivia Rodrigo – good 4 u
      "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb", // DJ Snake – Let Me Love You
      "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b", // The Weeknd – Blinding Lights
      "https://open.spotify.com/track/3KkXRkHbMCARz0aVfEt68P", // Post Malone – Circles
      "https://open.spotify.com/track/6e40mgJiCid5HRAGrbpGA6", // Dua Lipa – Levitating
    ],
    youtube: [
      "https://www.youtube.com/watch?v=ZbZSe6N_BXs", // Pharrell – Happy
      "https://www.youtube.com/watch?v=kJQP7kiw5Fk", // Luis Fonsi – Despacito
      "https://www.youtube.com/watch?v=9bZkp7q19f0", // PSY – Gangnam Style
      "https://www.youtube.com/watch?v=6Dh-RL__uN4", // Marshmello – Alone
      "https://www.youtube.com/watch?v=3tmd-ClpJxA", // Shawn Mendes – Treat You Better
    ],
    activities: [
      "https://www.headspace.com/meditation/meditation-for-happiness",
      "https://www.mindful.org/joyful-movement/",
      "https://www.verywellmind.com/how-to-practice-gratitude-3144884", // Gratitude journal
      "https://www.happify.com/", // Positive psychology activities
      "https://www.wikihow.com/Be-Positive", // Tips to stay positive
    ],
  },

  negative: {
    spotify: [
      "https://open.spotify.com/track/4VqPOruhp5EdPBeR92t6lQ", // Linkin Park – Numb
      "https://open.spotify.com/track/0ZQX1yC0lJ8K0nUMDLJfE4", // Lewis Capaldi – Someone You Loved
      "https://open.spotify.com/track/0ofbQMrRDsUaVKq2mGLEAb", // Billie Eilish – everything i wanted
      "https://open.spotify.com/track/4xqrdfXkTW4T0RauPLv3WA", // Adele – Easy On Me
      "https://open.spotify.com/track/1N4tHVDuSJXP3N4I2C8tr3", // NF – Let You Down
    ],
    youtube: [
      "https://www.youtube.com/watch?v=92i5m3tV5XY", // Relaxing Music
      "https://www.youtube.com/watch?v=inpok4MKVLM", // 10-minute guided meditation
      "https://www.youtube.com/watch?v=ZToicYcHIOU", // Mindfulness meditation
      "https://www.youtube.com/watch?v=W19PdslW7iw", // Self-compassion meditation
      "https://www.youtube.com/watch?v=MIr3RsUWrdo", // Calming breathing exercise
    ],
    activities: [
      "https://www.calm.com/", // Calm App
      "https://www.happify.com/", // Mood lifting tools
      "https://www.talkspace.com/", // Online therapy
      "https://www.betterhelp.com/", // Professional counseling
      "https://www.mentalhealth.org.uk/explore-mental-health/publications/how-to-manage-and-reduce-stress", // Stress tips
    ],
  },

  neutral: {
    spotify: [
      "https://open.spotify.com/track/6I9VzXrHxO9rA9A5euc8Ak", // Taylor Swift – Enchanted
      "https://open.spotify.com/track/7sO5G9EABYOXQKNPNiE9NR", // Glass Animals – Heat Waves
      "https://open.spotify.com/track/2takcwOaAZWiXQijPHIx7B", // Ed Sheeran – Photograph
      "https://open.spotify.com/track/1AhDOtG9vPSOmsWgNW0BEY", // Coldplay – Yellow
      "https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg", // Imagine Dragons – Demons
    ],
    youtube: [
      "https://www.youtube.com/watch?v=5qap5aO4i9A", // Lofi hip hop radio
      "https://www.youtube.com/watch?v=lTRiuFIWV54", // Nature sounds
      "https://www.youtube.com/watch?v=kDbGzOZmPNA", // Ambient music
      "https://www.youtube.com/watch?v=a48c5-TMi3I", // Calm productivity
      "https://www.youtube.com/watch?v=GZebE8_3F9U", // Chill background jazz
    ],
    activities: [
      "https://www.nytimes.com/guides/well/how-to-meditate",
      "https://www.sleepfoundation.org/", // Sleep resources
      "https://www.psychologytoday.com/us/basics/self-care", // Self-care tips
      "https://www.mindful.org/", // Mindfulness hub
      "https://diygenius.com/20-mind-expanding-mindfulness-activities/", // DIY activities
    ],
  },
}


const mockAnalysis = (text: string) => {
  if (text.includes("happy") || text.includes("joy")) {
    return { sentiment: "positive", analysis: "You are feeling happy and joyful today!" };
  } else if (text.includes("sad") || text.includes("down") || text.includes("depressed")) {
    return { sentiment: "negative", analysis: "It seems like you're feeling down. Take care of yourself!" };
  } else if (text.includes("angry") || text.includes("frustrated")) {
    return { sentiment: "negative", analysis: "You're experiencing some anger. Try to relax and calm down." };
  } else if (text.includes("excited") || text.includes("thrilled") || text.includes("eager")) {
    return { sentiment: "positive", analysis: "You're excited and full of energy! Keep up the good vibes." };
  } else if (text.includes("confused") || text.includes("uncertain")) {
    return { sentiment: "neutral", analysis: "It seems you're feeling uncertain. It's okay to have those moments." };
  } else if (text.includes("tired") || text.includes("exhausted") || text.includes("drained")) {
    return { sentiment: "negative", analysis: "You might be feeling tired. Rest and recharge when you can." };
  } else if (text.includes("peaceful") || text.includes("calm") || text.includes("relaxed")) {
    return { sentiment: "positive", analysis: "You're feeling at peace today. Keep nurturing your calm." };
  } else if (text.includes("hopeful") || text.includes("optimistic")) {
    return { sentiment: "positive", analysis: "You're feeling hopeful and positive about the future. Keep that mindset!" };
  } else if (text.includes("lonely") || text.includes("isolated")) {
    return { sentiment: "negative", analysis: "It seems you're feeling a bit lonely. Try to connect with others or reach out for support." };
  } else {
    return { sentiment: "neutral", analysis: "Your mood is neutral. It might be a day of reflection." };
  }
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")

  const handleSaveEntry = async () => {
    if (!currentEntry.trim()) return;

    setIsAnalyzing(true);

    // Mock Analysis (replace with API call later)
    const { sentiment, analysis } = mockAnalysis(currentEntry);

    setTimeout(() => {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        sentiment,
        analysis,
        date: new Date(),
      };

      setEntries([newEntry, ...entries]);
      setCurrentEntry("");
      setSelectedEntry(newEntry);
      setAiAnalysis(analysis);
      setIsAnalyzing(false);

      const redirects = moodRedirects[sentiment];
      window.open(redirects.spotify[0], "_blank");
      window.open(redirects.youtube[0], "_blank");
      window.open(redirects.activities[0], "_blank");
    }, 1500);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Journal</h1>
      <Textarea
        placeholder="Write about your day..."
        value={currentEntry}
        onChange={(e) => setCurrentEntry(e.target.value)}
        rows={6}
      />
      <Button onClick={handleSaveEntry} disabled={isAnalyzing}>
        {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analyze & Save"}
      </Button>

      {selectedEntry && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Entry Summary</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedEntry.analysis}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {entry.date.toLocaleString()}
                  </p>
                  <p>{entry.content}</p>
                </div>
                <span className="capitalize text-sm font-semibold">
                  {entry.sentiment}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}