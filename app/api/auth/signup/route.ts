import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, avatarType, referralCode } = await request.json()

    const supabase = await getSupabaseServerClient()

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 400 })
    }

    // Generate referral code
    const newReferralCode = `REF_${Date.now().toString(36).toUpperCase()}`
    let startingPoints = 1000

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          username,
          avatar_type: avatarType,
          referral_code: newReferralCode,
          points: startingPoints,
          level: 1,
          experience: 0,
          total_exp: 0,
          is_verified: false,
          verification_status: "pending",
        },
      ])
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // Process referral if code provided
    if (referralCode) {
      startingPoints = 1200
      await supabase.rpc("process_referral_bonus", {
        referral_code: referralCode,
        new_user_id: authData.user.id,
      })

      await supabase.from("users").update({ points: 1200 }).eq("id", authData.user.id)
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email,
        username,
        avatarType,
        referralCode: newReferralCode,
        points: startingPoints,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
