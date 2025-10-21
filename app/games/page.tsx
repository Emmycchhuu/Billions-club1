"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"

export default function GamesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

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

  const games = [
    {
      title: "Find the Impostor",
      description: "Identify the impostor among the humans. Test your observation skills!",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3011-28QKe1Ek8rZsoudPWaqwdedrGXlJQv.png",
      href: "/games/impostor",
      color: "from-blue-600 to-cyan-500",
      reward: "50-100 XP",
    },
    {
      title: "Billions Spin",
      description: "Spin the wheel and win amazing rewards. Try your luck!",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3013-9iNkDibX0Z8r7UhxliFXAlWpCOnnoF.png",
      href: "/games/spin",
      color: "from-orange-500 to-yellow-400",
      reward: "25-75 XP",
    },
    {
      title: "Billions Quiz",
      description: "Answer trivia questions and climb the leaderboard. Knowledge is power!",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3014-8fHPThSV5UmE2FdqtjXFZzfQgAWxsa.png",
      href: "/games/quiz",
      color: "from-purple-600 to-pink-500",
      reward: "30-80 XP",
    },
  ]

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Games</h1>
          <p className="text-lg text-white/80">Play games, earn experience, and climb the leaderboard</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.title} href={game.href}>
              <Card className="bg-card/80 backdrop-blur-xl border-border/50 hover:border-border transition-all duration-300 cursor-pointer h-full hover:shadow-2xl hover:scale-105 transform">
                <CardHeader className="pb-3">
                  <div className={`w-full h-40 rounded-lg bg-gradient-to-br ${game.color} mb-4 overflow-hidden`}>
                    <img
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-400">Reward: {game.reward}</span>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
