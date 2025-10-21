"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { useState, useEffect } from "react"

interface LeaderboardPlayer {
  id: string
  username: string
  level: number
  points: number
  referral_count: number
  is_verified: boolean
  profile_picture_url?: string
  rank: number
}

export default function LeaderboardsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [leaderboardType, setLeaderboardType] = useState<"points" | "referrals">("points")
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/leaderboard/get-top-players?type=${leaderboardType}&limit=100`)
        if (response.ok) {
          const data = await response.json()
          // Map API data to our interface and assign ranks
          const rankedData = data.map((player: any, index: number) => ({
            id: player.username,
            username: player.username,
            level: player.experience || 0,
            points: player.points || 0,
            referral_count: player.referral_count || 0,
            is_verified: player.is_verified || false,
            profile_picture_url: player.profile_picture_url || null,
            rank: index + 1,
          }))
          setLeaderboard(rankedData)
        } else {
          setLeaderboard([])
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [leaderboardType])

  if (isLoading || loading) {
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

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Global Leaderboards</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {leaderboardType === "points"
              ? "Compete with players worldwide - Ranked by Points"
              : "Top Referrers - Ranked by Referrals"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setLeaderboardType("points")}
            className={`${
              leaderboardType === "points"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Points Leaderboard
          </Button>
          <Button
            onClick={() => setLeaderboardType("referrals")}
            className={`${
              leaderboardType === "referrals"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Referral Leaderboard
          </Button>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden">
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl">
              {leaderboardType === "points" ? "Top Players" : "Top Referrers"}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {leaderboardType === "points" ? "Global rankings by points earned" : "Global rankings by referrals made"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
            <div className="space-y-2">
              {leaderboard.length > 0 ? (
                leaderboard.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group gap-2 md:gap-4"
                  >
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="w-8 md:w-10 text-center flex-shrink-0">
                        {player.rank <= 3 ? (
                          <span
                            className={`text-lg md:text-xl font-bold ${
                              player.rank === 1
                                ? "text-yellow-400"
                                : player.rank === 2
                                ? "text-gray-300"
                                : "text-orange-400"
                            }`}
                          >
                            {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          <span className="text-xs md:text-sm font-bold text-cyan-400">#{player.rank}</span>
                        )}
                      </div>

                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-cyan-400/30">
                        {player.profile_picture_url ? (
                          <img
                            src={player.profile_picture_url}
                            alt={player.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs md:text-base text-foreground truncate">
                            {player.username}
                          </p>
                          {player.is_verified && (
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              title="Human Verified"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Level {player.level}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-base md:text-2xl font-bold text-green-400">
                        {leaderboardType === "points" ? player.points : player.referral_count}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leaderboardType === "points" ? "points" : "referrals"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No leaderboard data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
