import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, gameId, points, experience, result } = await request.json()

    if (!userId || !gameId || result === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("points, experience, level, total_exp")
      .eq("id", userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Calculate new values
    const newPoints = Math.max(0, userData.points + (points || 0))
    const expMultiplier = Math.pow(1.1, userData.level - 1)
    const adjustedExp = Math.floor((experience || 0) / expMultiplier)
    let newExperience = userData.experience + adjustedExp
    let newLevel = userData.level
    const newTotalExp = userData.total_exp + adjustedExp

    // Level up logic
    const expThreshold = 1000
    if (newExperience >= expThreshold && newLevel < 20) {
      newLevel += Math.floor(newExperience / expThreshold)
      newExperience = newExperience % expThreshold
      if (newLevel > 20) {
        newLevel = 20
        newExperience = 0
      }
    }

    // Update user
    const { error: updateError } = await supabase
      .from("users")
      .update({
        points: newPoints,
        experience: newExperience,
        level: newLevel,
        total_exp: newTotalExp,
      })
      .eq("id", userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Record game result
    const { error: resultError } = await supabase.from("game_results").insert([
      {
        user_id: userId,
        game_id: gameId,
        points_earned: points || 0,
        exp_earned: experience || 0,
        result,
      },
    ])

    if (resultError) {
      console.error("Error recording game result:", resultError)
    }

    return NextResponse.json({
      newPoints,
      newLevel,
      newExperience,
      newTotalExp,
    })
  } catch (error) {
    console.error("[v0] Submit score error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
