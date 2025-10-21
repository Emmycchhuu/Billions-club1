"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<"penguin" | "rabbit">("penguin")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp } = useAuth()

  const urlReferralCode = searchParams.get("ref")
  const finalReferralCode = urlReferralCode || referralCode

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, username, selectedAvatar, finalReferralCode || undefined)
      router.push("/dashboard")
    } catch (err) {
      let errorMessage = "An error occurred"
      if (err instanceof Error) {
        errorMessage = err.message
        if (errorMessage.includes("Supabase is not configured")) {
          errorMessage = "Supabase is not configured. Please contact the administrator."
        }
      }
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center gradient-primary relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-2">
                <img src="/images/design-mode/IMG_2970.png" alt="Billions Club" className="w-12 h-12 rounded-md" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Join the Club</CardTitle>
            <CardDescription>Create your Billions Club account</CardDescription>
            {urlReferralCode && (
              <p className="text-xs text-cyan-400 mt-2">
                Using referral code: <span className="font-bold">{urlReferralCode}</span>
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Referral Code (Optional)</label>
                <Input
                  type="text"
                  placeholder="Enter referral code to get bonus points"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-cyan-400">Get 200 bonus points when you use a referral code!</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Choose Your Avatar</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar("penguin")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedAvatar === "penguin"
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <img
                      src="/images/design-mode/IMG_2962.png"
                      alt="Penguin"
                      className="w-12 h-12 mx-auto rounded-md"
                    />
                    <p className="text-xs mt-2 text-foreground">Penguin</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAvatar("rabbit")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      selectedAvatar === "rabbit"
                        ? "border-pink-400 bg-pink-400/10"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <img src="/images/design-mode/IMG_2963.png" alt="Rabbit" className="w-12 h-12 mx-auto rounded-md" />
                    <p className="text-xs mt-2 text-foreground">Rabbit</p>
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
