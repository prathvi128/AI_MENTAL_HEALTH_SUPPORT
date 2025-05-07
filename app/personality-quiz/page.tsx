"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { MainNav } from "@/components/main-nav"
import { UserAvatar } from "@/components/user-avatar"
import { useRouter } from "next/navigation"

type Question = {
  id: string
  text: string
  trait: "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism" | "anxiety"
  options: {
    value: number
    text: string
  }[]
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "I enjoy trying new experiences and learning new things.",
    trait: "openness",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q2",
    text: "I tend to be organized and follow a schedule.",
    trait: "conscientiousness",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q3",
    text: "I enjoy being around people and socializing.",
    trait: "extraversion",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q4",
    text: "I am generally trusting and forgiving of others.",
    trait: "agreeableness",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q5",
    text: "I often worry about things that might go wrong.",
    trait: "neuroticism",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q6",
    text: "I find it hard to relax and often feel tense.",
    trait: "anxiety",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q7",
    text: "I have a vivid imagination and enjoy thinking about abstract concepts.",
    trait: "openness",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q8",
    text: "I complete tasks thoroughly and pay attention to details.",
    trait: "conscientiousness",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
  {
    id: "q9",
    text: "I find it difficult to approach others and often feel shy.",
    trait: "extraversion",
    options: [
      { value: 5, text: "Strongly Disagree" },
      { value: 4, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 2, text: "Agree" },
      { value: 1, text: "Strongly Agree" },
    ],
  },
  {
    id: "q10",
    text: "I sometimes worry about what others think of me.",
    trait: "anxiety",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" },
    ],
  },
]

export default function PersonalityQuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Record<string, number>>({})

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const progress = (currentQuestionIndex / QUESTIONS.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = () => {
    const traits = {
      openness: { sum: 0, count: 0 },
      conscientiousness: { sum: 0, count: 0 },
      extraversion: { sum: 0, count: 0 },
      agreeableness: { sum: 0, count: 0 },
      neuroticism: { sum: 0, count: 0 },
      anxiety: { sum: 0, count: 0 },
    }

    // Sum up scores for each trait
    QUESTIONS.forEach((question) => {
      if (answers[question.id]) {
        traits[question.trait].sum += answers[question.id]
        traits[question.trait].count += 1
      }
    })

    // Calculate average for each trait
    const calculatedResults = Object.entries(traits).reduce(
      (acc, [trait, { sum, count }]) => {
        acc[trait] = count > 0 ? (sum / count) * 20 : 0 // Scale to 0-100
        return acc
      },
      {} as Record<string, number>,
    )

    setResults(calculatedResults)
    setShowResults(true)
  }

  const getTraitDescription = (trait: string, score: number) => {
    const descriptions: Record<string, string[]> = {
      openness: [
        "You tend to be more conventional and prefer routine over novelty.",
        "You have a balance between traditional and new approaches to life.",
        "You are curious, creative, and open to trying new experiences.",
      ],
      conscientiousness: [
        "You tend to be more flexible and spontaneous rather than organized.",
        "You have a balance between being organized and being flexible.",
        "You are organized, reliable, and prefer planned activities over spontaneity.",
      ],
      extraversion: [
        "You tend to be more reserved and enjoy solitary activities.",
        "You have a balance between social and solitary activities.",
        "You are outgoing, energetic, and draw energy from social interactions.",
      ],
      agreeableness: [
        "You tend to be more analytical and may prioritize logic over others' feelings.",
        "You have a balance between being cooperative and being independent.",
        "You are compassionate, cooperative, and value harmony with others.",
      ],
      neuroticism: [
        "You tend to be emotionally stable and less reactive to stress.",
        "You have a moderate emotional response to stressful situations.",
        "You may experience more emotional ups and downs and sensitivity to stress.",
      ],
      anxiety: [
        "You tend to be calm and relaxed in most situations.",
        "You experience occasional worry in specific situations.",
        "You may often feel worried or tense about various aspects of life.",
      ],
    }

    let level = 0
    if (score > 60) level = 2
    else if (score > 40) level = 1

    return descriptions[trait][level]
  }

  const getTraitColor = (trait: string) => {
    const colors: Record<string, string> = {
      openness: "bg-blue-500",
      conscientiousness: "bg-green-500",
      extraversion: "bg-yellow-500",
      agreeableness: "bg-purple-500",
      neuroticism: "bg-red-500",
      anxiety: "bg-orange-500",
    }

    return colors[trait] || "bg-gray-500"
  }

  const getTraitLabel = (trait: string) => {
    const labels: Record<string, string> = {
      openness: "Openness to Experience",
      conscientiousness: "Conscientiousness",
      extraversion: "Extraversion",
      agreeableness: "Agreeableness",
      neuroticism: "Emotional Sensitivity",
      anxiety: "Anxiety Level",
    }

    return labels[trait] || trait
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
          {!showResults ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center text-blue-700">Personality & Anxiety Assessment</CardTitle>
                <CardDescription className="text-center">
                  Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                </CardDescription>
                <Progress value={progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">{currentQuestion.text}</h3>

                  <RadioGroup onValueChange={(value) => handleAnswer(Number.parseInt(value))}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem id={`option-${option.value}`} value={option.value.toString()} />
                          <Label htmlFor={`option-${option.value}`}>{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentQuestionIndex < QUESTIONS.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    } else {
                      calculateResults()
                    }
                  }}
                >
                  {currentQuestionIndex < QUESTIONS.length - 1 ? "Skip" : "See Results"}
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center text-blue-700">Your Personality Profile</CardTitle>
                <CardDescription className="text-center">Based on your responses to the assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(results).map(([trait, score]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{getTraitLabel(trait)}</span>
                        <span className="text-sm text-gray-500">{Math.round(score)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${getTraitColor(trait)}`} style={{ width: `${score}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600">{getTraitDescription(trait, score)}</p>
                    </div>
                  ))}

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <UserAvatar className="h-10 w-10" />
                      <div>
                        <h3 className="font-medium text-blue-700">AI Friend's Insights</h3>
                        <p className="text-gray-700 mt-1">
                          Based on your profile, you appear to be{" "}
                          {results.openness > 60
                            ? "creative and open to new experiences"
                            : results.openness < 40
                              ? "practical and conventional"
                              : "balanced between tradition and novelty"}
                          . You tend to be{" "}
                          {results.extraversion > 60
                            ? "outgoing and social"
                            : results.extraversion < 40
                              ? "introspective and reserved"
                              : "adaptable in social situations"}
                          .
                          {results.anxiety > 60
                            ? " Your anxiety levels suggest you might benefit from relaxation techniques and mindfulness practices."
                            : results.anxiety > 40
                              ? " You experience moderate anxiety which is normal, but practicing mindfulness could still be beneficial."
                              : " You seem to manage stress well, which is a great strength."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentQuestionIndex(0)
                    setAnswers({})
                  }}
                  variant="outline"
                  className="mr-2"
                >
                  Retake Quiz
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => router.push("/mode-selection")}
                >
                  Continue
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
