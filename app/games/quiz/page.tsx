"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  reward: number
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is Billions Network all about?",
    options: ["A TV show", "A decentralized Human & AI Network", "A crypto exchange", "A social media app"],
    correct: 1,
    reward: 10,
  },
  {
    id: 2,
    question: "What makes Billions Network unique?",
    options: [
      "It uses face scans",
      "It focuses on privacy-preserving identity and reputation",
      "It sells user data",
      "It's only for AI agents",
    ],
    correct: 1,
    reward: 10,
  },
  {
    id: 3,
    question: "Who launched Billions Network?",
    options: ["OpenAI", "Privado ID (formerly Polygon ID)", "Meta", "Google"],
    correct: 1,
    reward: 10,
  },
  {
    id: 4,
    question: "What does Billions Network mainly focus on?",
    options: ["Entertainment", "Privacy and identity verification", "Advertising", "Social chatting"],
    correct: 1,
    reward: 15,
  },
  {
    id: 5,
    question: "What is the main goal of Billions Network?",
    options: [
      "Build a metaverse",
      "Create meme tokens",
      "Build trust between humans and AI",
      "Replace all social media",
    ],
    correct: 2,
    reward: 15,
  },
  {
    id: 6,
    question: "How does Billions Network protect your privacy?",
    options: [
      "Using Zero-Knowledge Proofs (ZKPs)",
      "Saving your data on cloud",
      "Face recognition",
      "Sharing info with partners",
    ],
    correct: 0,
    reward: 15,
  },
  {
    id: 7,
    question: "Does Billions store your biometric data?",
    options: ["Yes", "No", "Only for VIP users", "Sometimes"],
    correct: 1,
    reward: 10,
  },
  {
    id: 8,
    question: "What does ZKP stand for?",
    options: ["Zero Knowledge Points", "Zero-Knowledge Proofs", "Zone Key Process", "Zero Key Privacy"],
    correct: 1,
    reward: 10,
  },
  {
    id: 9,
    question: "What problem does Billions solve?",
    options: ["Slow internet", "Fake accounts, bots, and deepfakes", "Expensive NFTs", "Gaming rewards"],
    correct: 1,
    reward: 15,
  },
  {
    id: 10,
    question: "What is Billions' vision for the future?",
    options: ["A trustworthy digital world", "A gaming empire", "An NFT-only platform", "A meme network"],
    correct: 0,
    reward: 20,
  },
]

export default function QuizGame() {
  const { addPoints, addExperience } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalExp, setTotalExp] = useState(0)

  const question = QUESTIONS[currentQuestion]

  const handleAnswer = (optionIndex: number) => {
    if (answered) return
    setSelectedAnswer(optionIndex)
    setAnswered(true)

    if (optionIndex === question.correct) {
      setScore(score + 1)
      setTotalPoints(totalPoints + question.reward)
      const expReward = Math.floor(question.reward / 2)
      setTotalExp(totalExp + expReward)
      addPoints(question.reward)
      addExperience(expReward)
    } else {
      const expReward = 5
      setTotalExp(totalExp + expReward)
      addExperience(expReward)
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setGameOver(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setGameOver(false)
    setTotalPoints(0)
    setTotalExp(0)
  }

  if (gameOver) {
    return (
      <div className="min-h-screen w-full gradient-accent">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Quiz Complete!</h1>
            <Link href="/games">
              <Button variant="outline" className="text-white border-white hover:bg-white/10 bg-transparent">
                Back to Games
              </Button>
            </Link>
          </div>

          <Card className="bg-card/80 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Final Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Correct Answers</p>
                  <p className="text-4xl font-bold text-green-400">
                    {score}/{QUESTIONS.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Points Earned</p>
                  <p className="text-4xl font-bold text-cyan-400">{totalPoints}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">EXP Earned</p>
                  <p className="text-4xl font-bold text-purple-400">{totalExp}</p>
                </div>
              </div>
              <Button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full gradient-accent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Billions Quiz</h1>
            <p className="text-lg text-white/80">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </p>
          </div>
          <Link href="/games">
            <Button variant="outline" className="text-white border-white hover:bg-white/10 bg-transparent">
              Back to Games
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm text-cyan-400">{score} correct</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`p-4 rounded-lg text-left font-semibold transition-all duration-200 ${
                    selectedAnswer === index
                      ? index === question.correct
                        ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                        : "bg-red-500/20 border-2 border-red-500 text-red-400"
                      : answered && index === question.correct
                        ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                        : "bg-muted/50 border-2 border-transparent hover:border-cyan-400 text-white hover:bg-muted"
                  } ${answered ? "cursor-default" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {answered && (
              <div className="mt-6">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  {selectedAnswer === question.correct
                    ? `Correct! +${question.reward} Points +${Math.floor(question.reward / 2)} EXP`
                    : "Incorrect! +5 EXP"}
                </p>
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  {currentQuestion === QUESTIONS.length - 1 ? "See Results" : "Next Question"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
