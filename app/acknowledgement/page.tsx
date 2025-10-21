"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import Image from "next/image"

interface Contributor {
  name: string
  role: string
  image: string
  emoji: string
}

export default function AcknowledgementPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center gradient-primary">
        <div className="text-center">
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const contributors: Contributor[] = [
    {
      name: "Dvm",
      role: "Project Core Contributor",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/36469ee8-e098-417f-9e15-4c7f6c09e4b2-P4T6JVzWHaAfpmIEflXAz7wfRvJcTR.jpeg",
      emoji: "💙",
    },
    {
      name: "Big_D",
      role: "Project Core Contributor",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d8c58153-5645-453f-a756-506ae8aad3a5-5N2LyZXD0tNKzVVB0OeGiTzWklH7YZ.jpeg",
      emoji: "💙",
    },
    {
      name: "Hizzy",
      role: "Project Advisor and contributor",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8537d420-23af-4338-b703-34b7661427e1-LNhRZgUpNY3GipSHEniJX2y4fE6Dz3.jpeg",
      emoji: "💙",
    },
  ]

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Acknowledgement</h1>
          <p className="text-muted-foreground text-lg">Meet the amazing people who made Billions Club possible</p>
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Contributors - Dvm and Big_D */}
          {contributors.slice(0, 2).map((contributor) => (
            <Card
              key={contributor.name}
              className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden"
            >
              <CardHeader className="pb-0">
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={contributor.image || "/placeholder.svg"}
                    alt={contributor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-2xl mb-2">
                  {contributor.name} {contributor.emoji}
                </CardTitle>
                <p className="text-muted-foreground font-semibold">{contributor.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Contributor - Hizzy */}
        <div className="flex justify-center">
          <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden w-full md:w-1/2 lg:w-1/3">
            <CardHeader className="pb-0">
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={contributors[2].image || "/placeholder.svg"}
                  alt={contributors[2].name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle className="text-2xl mb-2">
                {contributors[2].name} {contributors[2].emoji}
              </CardTitle>
              <p className="text-muted-foreground font-semibold">{contributors[2].role}</p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}
