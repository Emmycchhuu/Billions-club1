import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserStatsProps {
  points: number
  level: number
  experience: number
  referralCount: number
  isVerified: boolean
}

export default function UserStats({ points, level, experience, referralCount, isVerified }: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-400">{(points / 1000).toFixed(1)}k</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-cyan-400">{level}</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-400">{referralCount}</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${isVerified ? "text-green-400" : "text-yellow-400"}`}>
            {isVerified ? "Verified" : "Pending"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
