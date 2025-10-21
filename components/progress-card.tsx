"use client"

import { Card, CardContent } from "@/components/ui/card"
import { calculateLevelInfo } from "@/lib/leveling-system"
import { useRouter } from "next/navigation"

interface ProgressCardProps {
  user: {
    username: string
    email: string
    level: number
    experience: number
    points: number
    avatarType: string
    profilePicture?: string
    isVerified?: boolean
  }
}

export default function ProgressCard({ user }: ProgressCardProps) {
  const router = useRouter()
  const levelInfo = calculateLevelInfo(user.experience)
  const expPercentage = levelInfo.expPercentage

  return (
    <Card
      className="bg-card/80 backdrop-blur-xl border-border/50 mb-8 shadow-xl cursor-pointer hover:border-border/80 transition-colors"
      onClick={() => router.push("/profile/edit")}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          {/* Profile Picture - Left Side */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0 border-3 border-cyan-400/50 shadow-lg">
            {user.profilePicture ? (
              <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info and Stats - Right Side */}
          <div className="flex-1 w-full space-y-4">
            {/* Username and Email */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Username</p>
              <div className="flex items-center gap-2">
                <p className="text-xl md:text-2xl font-bold text-cyan-400">{user.username}</p>
                {user.isVerified && (
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    title="Human Verified"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-3 mb-1">Email</p>
              <p className="text-sm text-foreground">{user.email}</p>
            </div>

            {/* Level, Points, and Experience - Grid Layout */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-2">
              {/* Level */}
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Level</p>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center border-3 border-cyan-400/50 shadow-lg">
                  <span className="text-xl md:text-2xl font-bold text-white">{user.level}</span>
                </div>
              </div>

              {/* Points */}
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Points</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-400">{(user.points || 0).toLocaleString()}</p>
              </div>

              {/* Experience */}
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Experience</p>
                <p className="text-xs md:text-sm font-semibold text-cyan-400 text-center">
                  {levelInfo.currentExp} / {levelInfo.expToNextLevel + levelInfo.currentExp}
                </p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/50 mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${expPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{Math.round(expPercentage)}% to next</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
