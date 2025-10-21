// Leveling system utilities for Billions Club

export const BASE_EXPERIENCE_PER_LEVEL = 1000
export const MAX_LEVEL = 20

export interface LevelInfo {
  currentLevel: number
  currentExp: number
  expToNextLevel: number
  expPercentage: number
  totalExp: number
}

export function getExpRequirementForLevel(level: number): number {
  if (level >= MAX_LEVEL) return 0
  // Exp requirement increases by 10% per level
  return Math.floor(BASE_EXPERIENCE_PER_LEVEL * Math.pow(1.1, level - 1))
}

export function calculateLevelInfo(totalExp: number): LevelInfo {
  let currentLevel = 1
  let expUsed = 0

  // Calculate current level by accumulating exp requirements
  while (currentLevel < MAX_LEVEL) {
    const expForNextLevel = getExpRequirementForLevel(currentLevel)
    if (expUsed + expForNextLevel > totalExp) {
      break
    }
    expUsed += expForNextLevel
    currentLevel++
  }

  const currentExp = totalExp - expUsed
  const expToNextLevel = currentLevel >= MAX_LEVEL ? 0 : getExpRequirementForLevel(currentLevel) - currentExp
  const maxExpForLevel = currentLevel >= MAX_LEVEL ? 1 : getExpRequirementForLevel(currentLevel)
  const expPercentage = currentLevel >= MAX_LEVEL ? 100 : (currentExp / maxExpForLevel) * 100

  return {
    currentLevel,
    currentExp,
    expToNextLevel,
    expPercentage,
    totalExp,
  }
}

export function getRankTitle(level: number): string {
  if (level < 5) return "Newbie"
  if (level < 10) return "Novice"
  if (level < 15) return "Intermediate"
  if (level < 20) return "Advanced"
  return "Legend"
}

export function getExpForLevel(level: number): number {
  let totalExp = 0
  for (let i = 1; i < level; i++) {
    totalExp += getExpRequirementForLevel(i)
  }
  return totalExp
}

export function getNextLevelExp(level: number): number {
  return getExpForLevel(level + 1)
}

export const EXPERIENCE_REWARDS = {
  game_win: 100,
  game_loss: 25,
  community_post: 10,
  community_like: 5,
  verification_complete: 500,
  daily_login: 50,
}
