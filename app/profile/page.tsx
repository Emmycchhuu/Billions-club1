"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, signOut, uploadProfilePicture, updateProfile } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen w-full gradient-primary flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const username = user.username || "Player"
  const level = user.level || 1
  const totalExp = user.totalExp || 0
  const points = user.points || 0

  const gamesPlayed = 0
  const wins = 0
  const winRate = 0

  const statsArray = [
    { label: "Games Played", value: gamesPlayed },
    { label: "Wins", value: wins },
    { label: "Win Rate", value: `${winRate}%` },
    { label: "Total Playtime", value: "0m" },
  ]

  const handleSignOut = () => {
    signOut()
    router.push("/auth/signin")
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      await uploadProfilePicture(file)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen w-full gradient-primary">
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm md:text-base"
          >
            {uploading ? "Uploading..." : "Change Picture"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 mb-8 shadow-xl">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-cyan-400/30">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-6xl font-bold text-white">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{username}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-3xl font-bold text-cyan-400">{level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Experience</p>
                    <p className="text-3xl font-bold text-green-400">{totalExp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-3xl font-bold text-yellow-400">{points.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-bold text-green-400 capitalize">{user.verificationStatus}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">Referral Code: {user.referralCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsArray.map((stat) => (
            <Card key={stat.label} className="bg-card/80 backdrop-blur-xl border-border/50 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent">
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive bg-transparent"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
