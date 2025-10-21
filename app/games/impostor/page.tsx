"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Player {
  id: number
  name: string
  image: string
  isImpostor: boolean
}

const PLAYERS: Player[] = [
  {
    id: 1,
    name: "Lee Lung",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2965-y6FohEU5cWSEKzaM8ohCfOFAfBaMnn.png",
    isImpostor: false,
  },
  {
    id: 2,
    name: "Aisha Patel",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2966-bsdaxwy0RSF4AoZSc0hfgKnL1CvP7M.png",
    isImpostor: false,
  },
  {
    id: 3,
    name: "Bola Musa",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2964-yvlufIrX3yCRt6GpygbSD7urtQQfh4.png",
    isImpostor: false,
  },
]

export default function ImpostorGame() {
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [players, setPlayers] = useState<Player[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)

  useEffect(() => {
    startNewRound()
  }, [])

  const startNewRound = () => {
    const shuffled = [...PLAYERS].sort(() => Math.random() - 0.5)
    const impostorIndex = Math.floor(Math.random() * shuffled.length)
    const newPlayers = shuffled.map((player, index) => ({
      ...player,
      isImpostor: index === impostorIndex,
    }))
    setPlayers(newPlayers)
    setGameState("playing")
  }

  const handleGuess = (playerId: number) => {
    const selectedPlayer = players.find((p) => p.id === playerId)
    if (selectedPlayer?.isImpostor) {
      setScore(score + 100)
      setGameState("won")
    } else {
      setGameState("lost")
    }
  }

  const handleNextRound = () => {
    setRound(round + 1)
    startNewRound()
  }

  return (
    <div className="min-h-screen w-full gradient-primary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Find the Impostor</h1>
            <p className="text-lg text-white/80">Round {round}</p>
          </div>
          <Link href="/games">
            <Button variant="outline" className="text-white border-white hover:bg-white/10 bg-transparent">
              Back to Games
            </Button>
          </Link>
        </div>

        {/* Score Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="text-4xl font-bold text-green-400">{score}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Round</p>
                <p className="text-4xl font-bold text-cyan-400">{round}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Content */}
        {gameState === "playing" && (
          <div>
            <p className="text-center text-white text-lg mb-8">Who is the impostor? Click on one of the cards below.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleGuess(player.id)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <Card className="bg-card/80 backdrop-blur-xl border-border/50 hover:border-cyan-400 h-full group-hover:shadow-2xl">
                    <CardContent className="pt-6">
                      <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-600 to-pink-500">
                        <img
                          src={player.image || "/placeholder.svg"}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-center text-white">{player.name}</h3>
                      <p className="text-center text-muted-foreground mt-2">Human Verified</p>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Screen */}
        {gameState !== "playing" && (
          <Card className="bg-card/80 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-3xl">{gameState === "won" ? "Correct!" : "Wrong!"}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-lg text-muted-foreground mb-2">The impostor was:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={players.find((p) => p.isImpostor)?.image || "/placeholder.svg"}
                      alt="Impostor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{players.find((p) => p.isImpostor)?.name}</p>
                    <p className="text-red-400 font-semibold">Impostor</p>
                  </div>
                </div>
              </div>
              {gameState === "won" && (
                <div>
                  <p className="text-green-400 text-lg font-semibold">+100 XP</p>
                </div>
              )}
              <Button
                onClick={handleNextRound}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                Next Round
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
