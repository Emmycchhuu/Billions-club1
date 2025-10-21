"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard-header"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isLoading, updateProfile, signOut } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState(user?.username || "")
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

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

  const handleSave = async () => {
    if (!username.trim()) {
      setMessage("Username cannot be empty")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      updateProfile({
        username: username.trim(),
        profilePicture: profilePicture,
      })

      setMessage("Profile updated successfully!")
      setTimeout(() => {
        setMessage("")
      }, 2000)
    } catch (error: any) {
      setMessage(error.message || "Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push("/auth/signin")
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const referralCode = user?.referralCode || "BILLIONS"
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signup?ref=${referralCode}`

  return (
    <div className="min-h-screen w-full gradient-primary">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Edit Profile</h1>

        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Update Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-semibold mb-3">Profile Picture</label>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden border-3 border-cyan-400/50 shadow-lg">
                  {profilePicture ? (
                    <img
                      src={profilePicture || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                >
                  Upload Picture
                </Button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-card/80 border-border/50 backdrop-blur-xl"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">{username.length}/30 characters</p>
            </div>

            {/* Referral Section */}
            <div className="border-t border-border/50 pt-6">
              <label className="block text-sm font-semibold mb-3">Your Referral Code</label>
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Referral Code</p>
                  <p className="text-lg font-bold text-cyan-400">{referralCode}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Referral Link</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-card/80 border border-border/50 rounded px-3 py-2 text-xs text-foreground"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink)
                        setMessage("Referral link copied!")
                        setTimeout(() => setMessage(""), 2000)
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Referrals Made</p>
                  <p className="text-lg font-bold text-yellow-400">{user?.referralCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("successfully") || message.includes("copied")
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex-1 text-white border-white hover:bg-white/10 bg-transparent"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
