"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"

export default function DashboardHeader() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    router.push("/auth/signin")
  }

  const handleProfileEdit = () => {
    router.push("/profile/edit")
  }

  return (
    <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full p-1.5 w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img src="/images/design-mode/IMG_2970.png" alt="Billions Club" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="hidden sm:block text-base font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            BILLIONS
          </h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {user && (
            <>
              <Button
                onClick={handleProfileEdit}
                variant="ghost"
                size="sm"
                className="hover:bg-muted text-foreground p-2"
                title="Edit Profile"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:bg-muted text-foreground p-2">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
