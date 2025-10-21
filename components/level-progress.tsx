import { Progress } from "@/components/ui/progress"

interface LevelProgressProps {
  currentLevel: number
  currentExperience: number
  maxExperience?: number
}

export default function LevelProgress({ currentLevel, currentExperience, maxExperience = 1000 }: LevelProgressProps) {
  const progressPercentage = (currentExperience / maxExperience) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Level {currentLevel}</p>
          <p className="text-xs text-muted-foreground">
            {currentExperience} / {maxExperience} XP
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-cyan-400">{Math.round(progressPercentage)}%</p>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}
