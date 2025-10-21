"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import ProgressCard from "@/components/progress-card"
import FeatureCard from "@/components/feature-card"
import { useState } from "react"

interface TopPlayer {
  rank: number
  username: string
  level: number
  points: number
  avatar_type: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [topPlayers] = useState<TopPlayer[]>([
    { rank: 1, username: "ProGamer", level: 15, points: 50000, avatar_type: "penguin" },
    { rank: 2, username: "NinjaKid", level: 14, points: 45000, avatar_type: "rabbit" },
    { rank: 3, username: "SkyWalker", level: 13, points: 40000, avatar_type: "penguin" },
    { rank: 4, username: "Phoenix", level: 12, points: 35000, avatar_type: "rabbit" },
    { rank: 5, username: "Dragon", level: 11, points: 30000, avatar_type: "penguin" },
  ])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center gradient-primary">
        <div className="text-center">
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const features = [
    {
      title: "Games",
      description: "Play and compete in exciting games",
      image: "/images/billions-games.png",
      gradient: "gradient-card-1",
      href: "/games",
      color: "from-indigo-600 to-purple-600",
    },
    {
      title: "Community",
      description: "Chat and interact with members",
      image: "/images/billions-community.png",
      gradient: "gradient-card-2",
      href: "/community",
      color: "from-cyan-500 to-green-500",
    },
    {
      title: "Verification",
      description: "Prove you are human",
      image: "/images/billions-verification.png",
      gradient: "gradient-card-3",
      href: "/verification",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Leaderboards",
      description: "See top players and rankings",
      image: "/images/billions-leaderboards.png",
      gradient: "gradient-card-4",
      href: "/leaderboards",
      color: "from-purple-600 to-pink-500",
    },
    {
      title: "Acknowledgement",
      description: "Meet our amazing contributors",
      image: "/images/billions-acknowledgement.png",
      gradient: "gradient-card-5",
      href: "/acknowledgement",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProgressCard user={user} />

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Players</CardTitle>
              <CardDescription>Current leaderboard standings</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              <a href="/leaderboards">View Full Leaderboards</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlayers.length > 0 ? (
                topPlayers.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-cyan-400 w-8">
                        {player.rank === 1
                          ? "🥇"
                          : player.rank === 2
                            ? "🥈"
                            : player.rank === 3
                              ? "🥉"
                              : `#${player.rank}`}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden border border-cyan-400/30">
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{player.username}</p>
                        <p className="text-xs text-muted-foreground">Level {player.level}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-400">{(player.points / 1000).toFixed(0)}k</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No players yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
