import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, answers } = await request.json()

    if (!userId || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Check answers (simplified - in production, validate against correct answers)
    const correctAnswers = answers.filter((a: any) => a.isCorrect).length
    const totalQuestions = answers.length
    const passPercentage = (correctAnswers / totalQuestions) * 100

    let verificationStatus = "pending"
    let isVerified = false

    if (passPercentage >= 80) {
      verificationStatus = "verified"
      isVerified = true

      // Award verification bonus
      const { data: user } = await supabase.from("users").select("points, experience").eq("id", userId).single()

      if (user) {
        await supabase
          .from("users")
          .update({
            points: user.points + 500,
            experience: user.experience + 500,
            verification_status: verificationStatus,
            is_verified: isVerified,
          })
          .eq("id", userId)
      }
    } else {
      verificationStatus = "pending"
      await supabase
        .from("users")
        .update({
          verification_status: verificationStatus,
          is_verified: false,
        })
        .eq("id", userId)
    }

    return NextResponse.json({
      verified: isVerified,
      status: verificationStatus,
      score: passPercentage,
    })
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
