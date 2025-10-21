import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface GameCardProps {
  id: string
  title: string
  description: string
  image: string
  href: string
  color: string
  pointsReward: number
  experienceReward: number
}

export default function GameCard({
  id,
  title,
  description,
  image,
  href,
  color,
  pointsReward,
  experienceReward,
}: GameCardProps) {
  return (
    <Link href={href}>
      <Card className="bg-card/80 backdrop-blur-xl border-border/50 hover:border-border transition-all duration-300 cursor-pointer h-full hover:shadow-2xl hover:scale-105 transform">
        <CardHeader className="pb-3">
          <div className={`w-full h-40 rounded-lg bg-gradient-to-br ${color} mb-4 overflow-hidden`}>
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <p className="text-green-400 font-semibold">{pointsReward} Points</p>
              <p className="text-blue-400 font-semibold">{experienceReward} XP</p>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
            Play
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
