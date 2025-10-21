import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { referralCode, newUserId } = await request.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: "Missing referral code or user ID" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Call the process_referral_bonus function
    const { data, error } = await supabase.rpc("process_referral_bonus", {
      referrer_code: referralCode,
      new_user_id: newUserId,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: data })
  } catch (error) {
    console.error("[v0] Referral bonus error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
