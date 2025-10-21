import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "points";
    const limit = Number.parseInt(searchParams.get("limit") || "100");

    const supabase = await getSupabaseServerClient();

    // Choose the correct leaderboard view
    const tableName = type === "referrals" ? "leaderboard_referrals" : "leaderboard_points";

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(limit)
      .order(type === "referrals" ? "referral_count" : "points", { ascending: false });

    if (error) {
      console.error("[v0] Leaderboard query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add ranking
    const rankedPlayers = data.map((player, index) => ({
      id: player.id,
      username: player.username,
      level: player.level,
      points: player.points,
      profile_picture_url: player.profile_picture_url,
      is_verified: player.is_verified,
      referral_count: player.referral_count,
      rank: index + 1,
    }));

    return NextResponse.json(rankedPlayers);
  } catch (error) {
    console.error("[v0] Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
