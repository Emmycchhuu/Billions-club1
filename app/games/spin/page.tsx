"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

interface Toy {
  id: number
  image: string
  name: string
}

const TOYS: Toy[] = [
  { id: 1, image: "/images/spin-toy-1.png", name: "Ladybug Friend" },
  { id: 2, image: "/images/spin-toy-2.png", name: "Pizza Lover" },
  { id: 3, image: "/images/spin-toy-3.png", name: "Angel" },
]

interface SpinResult {
  toys: Toy[]
  matchCount: number
  pointsEarned: number
}

export default function SpinGame() {
  const router = useRouter()
  const { user, isLoading, addPoints, addExperience } = useAuth()
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [lastResult, setLastResult] = useState<SpinResult | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinsLeft, setSpinsLeft] = useState(10)
  const [message, setMessage] = useState("")

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

  const handleSpin = () => {
    if (isSpinning || spinsLeft === 0) return

    setIsSpinning(true)
    setMessage("")

    const newIndices = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]

    setSelectedIndices([])

    setTimeout(() => {
      setSelectedIndices(newIndices)

      const results = newIndices.map((index) => TOYS[index])

      const firstToyId = results[0].id
      const matchCount = results.filter((toy) => toy.id === firstToyId).length

      let pointsEarned = 0
      let expEarned = 0
      let resultMessage = ""

      if (matchCount === 3) {
        pointsEarned = 100
        expEarned = 50
        resultMessage = "Perfect Match! 3 identical toys! +100 points +50 exp!"
        addPoints(pointsEarned)
        addExperience(expEarned)
      } else if (matchCount === 2) {
        pointsEarned = 50
        expEarned = 25
        resultMessage = "Good Match! 2 identical toys! +50 points +25 exp!"
        addPoints(pointsEarned)
        addExperience(expEarned)
      } else {
        pointsEarned = -10
        expEarned = 5
        resultMessage = "No match! -10 points +5 exp"
        addPoints(pointsEarned)
        addExperience(expEarned)
      }

      setLastResult({
        toys: results,
        matchCount,
        pointsEarned,
      })

      setTotalPoints((prev) => Math.max(0, prev + pointsEarned))
      setSpinsLeft((prev) => prev - 1)
      setMessage(resultMessage)
      setIsSpinning(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full gradient-secondary">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Billions Spin</h1>
            <p className="text-sm md:text-base text-white/80">Match 2 or 3 identical toys to win points!</p>
          </div>
          <Link href="/games" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-white border-white hover:bg-white/10 bg-transparent text-sm md:text-base"
            >
              Back to Games
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-card/80 backdrop-blur-xl border-border/50">
            <CardContent className="pt-4 md:pt-6">
              <p className="text-xs md:text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl md:text-4xl font-bold text-green-400">{totalPoints}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-xl border-border/50">
            <CardContent className="pt-4 md:pt-6">
              <p className="text-xs md:text-sm text-muted-foreground">Spins Left</p>
              <p className="text-2xl md:text-4xl font-bold text-yellow-400">{spinsLeft}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden border border-border/30">
            {[0, 1, 2].map((slotIndex) => (
              <div
                key={slotIndex}
                className="flex-1 flex items-center justify-center p-4 md:p-6 relative min-h-40 md:min-h-48"
              >
                {/* Vertical divider line between slots */}
                {slotIndex > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-24 md:h-32 bg-border/50"></div>
                )}

                {/* Toy Slot - Properly sized and contained */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
                  {isSpinning && selectedIndices.length === 0 ? (
                    <div className="w-full h-full opacity-30 flex items-center justify-center">
                      <div className="animate-spin">
                        <img
                          src={TOYS[Math.floor(Math.random() * 3)].image || "/placeholder.svg"}
                          alt="Spinning"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : selectedIndices.length > 0 ? (
                    <img
                      src={TOYS[selectedIndices[slotIndex]].image || "/placeholder.svg"}
                      alt={TOYS[selectedIndices[slotIndex]].name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                      ?
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message and Button */}
        <div className="flex flex-col items-center gap-4">
          {message && (
            <Card
              className={`w-full max-w-md ${
                message.includes("Perfect") || message.includes("Good")
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-red-500/20 border-red-500/50"
              }`}
            >
              <CardContent className="pt-4 text-center">
                <p
                  className={`font-bold text-lg ${
                    message.includes("Perfect") || message.includes("Good") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleSpin}
            disabled={isSpinning || spinsLeft === 0}
            className="w-full max-w-md h-12 md:h-16 text-lg md:text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:opacity-50 text-sm md:text-base"
          >
            {isSpinning ? "Spinning..." : spinsLeft === 0 ? "No Spins Left" : "SPIN"}
          </Button>
        </div>
      </main>
    </div>
  )
}
