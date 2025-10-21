import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "points"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const supabase = await getSupabaseServerClient()

    let query = supabase
      .from("users")
      .select("id, username, level, points, profile_picture_url, is_verified, referral_count")
      .limit(limit)

    if (type === "points") {
      query = query.order("points", { ascending: false })
    } else if (type === "referrals") {
      query = query.order("referral_count", { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rankedPlayers = data.map((player, index) => ({
      ...player,
      rank: index + 1,
    }))

    return NextResponse.json(rankedPlayers)
  } catch (error) {
    console.error("[v0] Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
