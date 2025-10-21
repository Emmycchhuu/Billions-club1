"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type VerificationStep = "math" | "hold" | "complete"

const VERIFICATION_QUESTIONS = [
  { question: "15 + 27 = ?", answer: 42 },
  { question: "48 - 19 = ?", answer: 29 },
  { question: "12 × 8 = ?", answer: 96 },
  { question: "144 ÷ 12 = ?", answer: 12 },
  { question: "33 + 17 = ?", answer: 50 },
  { question: "100 - 45 = ?", answer: 55 },
  { question: "9 × 7 = ?", answer: 63 },
  { question: "72 ÷ 8 = ?", answer: 9 },
  { question: "56 + 24 = ?", answer: 80 },
  { question: "90 - 35 = ?", answer: 55 },
  { question: "11 × 6 = ?", answer: 66 },
  { question: "120 ÷ 10 = ?", answer: 12 },
  { question: "42 + 18 = ?", answer: 60 },
  { question: "75 - 28 = ?", answer: 47 },
  { question: "13 × 5 = ?", answer: 65 },
]

export default function VerificationPage() {
  const router = useRouter()
  const { user, isLoading, updateVerificationStatus, addExperience } = useAuth()
  const [step, setStep] = useState<VerificationStep>("math")
  const [mathAnswer, setMathAnswer] = useState("")
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [message, setMessage] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const currentQuestion = VERIFICATION_QUESTIONS[currentQuestionIndex]

  if (isLoading) {
    return (
      <div className="min-h-screen w-full gradient-primary flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const handleMathSubmit = () => {
    const answer = Number.parseInt(mathAnswer)
    if (answer === currentQuestion.answer) {
      setCorrectAnswers(correctAnswers + 1)
      setMessage("Correct! Moving to next question...")
      setTimeout(() => {
        if (currentQuestionIndex < VERIFICATION_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setMathAnswer("")
          setMessage("")
        } else {
          setStep("hold")
          setMessage("")
          setCurrentQuestionIndex(0)
        }
      }, 1000)
    } else {
      setMessage("Incorrect answer. Try again!")
      setMathAnswer("")
    }
  }

  const handleHoldStart = () => {
    setIsHolding(true)
    setHoldProgress(0)
    const interval = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsHolding(false)
          setMessage("Verification complete!")
          updateVerificationStatus("verified")
          addExperience(500)

          setTimeout(() => {
            setStep("complete")
          }, 1500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  return (
    <div className="min-h-screen w-full gradient-primary">
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Human Verification</h1>
            <p className="text-sm md:text-base text-white/80">Complete all steps to verify you are human</p>
          </div>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-white border-white hover:bg-white/10 bg-transparent text-sm md:text-base"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6 md:mb-8">
          {["Math", "Hold", "Complete"].map((label, index) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base mb-2 ${
                  index < ["math", "hold", "complete"].indexOf(step)
                    ? "bg-green-500 text-white"
                    : index === ["math", "hold", "complete"].indexOf(step)
                      ? "bg-cyan-400 text-black"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index < ["math", "hold", "complete"].indexOf(step) ? "✓" : index + 1}
              </div>
              <p className="text-xs md:text-sm text-center">{label}</p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">
              {step === "math" &&
                `Step 1: Math Challenge (${currentQuestionIndex + 1}/${VERIFICATION_QUESTIONS.length})`}
              {step === "hold" && "Step 2: Hold Button"}
              {step === "complete" && "Verification Complete!"}
            </CardTitle>
            <CardDescription>
              {step === "math" && "Answer math questions to prove you are human"}
              {step === "hold" && "Hold the button for 3 seconds without releasing"}
              {step === "complete" && "You have been verified! You now have a verification badge."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Math Challenge */}
            {step === "math" && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-2xl md:text-4xl font-bold text-cyan-400 mb-4">{currentQuestion.question}</p>
                  <Input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="bg-card/80 border-border/50 backdrop-blur-xl text-center text-lg md:text-2xl"
                    onKeyPress={(e) => e.key === "Enter" && handleMathSubmit()}
                  />
                </div>
                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm md:text-base ${
                      message.includes("Correct") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {message}
                  </div>
                )}
                <Button
                  onClick={handleMathSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Hold Button */}
            {step === "hold" && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-sm md:text-base text-muted-foreground mb-4">Hold the button below for 3 seconds</p>
                  <Button
                    onMouseDown={handleHoldStart}
                    onMouseUp={() => setIsHolding(false)}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={() => setIsHolding(false)}
                    disabled={isHolding}
                    className="w-full h-20 md:h-24 text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {isHolding ? `Holding... ${holdProgress}%` : "HOLD ME"}
                  </Button>
                </div>
                {holdProgress > 0 && (
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                      style={{ width: `${holdProgress}%` }}
                    ></div>
                  </div>
                )}
                {message && (
                  <div className="p-3 rounded-lg text-sm md:text-base bg-green-500/20 text-green-400">{message}</div>
                )}
              </div>
            )}

            {/* Complete */}
            {step === "complete" && (
              <div className="space-y-4 text-center">
                <div className="text-6xl mb-4">✓</div>
                <p className="text-lg md:text-2xl font-bold text-green-400">Verification Complete!</p>
                <p className="text-sm md:text-base text-muted-foreground">
                  You now have a verification badge on your profile and leaderboard!
                </p>
                <Link href="/dashboard" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
