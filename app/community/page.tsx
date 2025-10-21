"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import Link from "next/link"
import { Lock } from "lucide-react"

export default function CommunityPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen w-full gradient-secondary flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Community Chat</h1>
            <p className="text-sm md:text-base text-white/80">Connect with other players</p>
          </div>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-white border-white hover:bg-white/10 bg-transparent text-sm md:text-base"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-border/50 mb-4">
          <CardContent className="pt-12 md:pt-16 pb-12 md:pb-16 px-6 md:px-8 flex flex-col items-center justify-center text-center">
            <Lock className="w-16 h-16 md:w-20 md:h-20 text-white/60 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-white/70 text-sm md:text-base max-w-md">
              The Community Chat feature is currently under development. Check back soon to connect with other players!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
