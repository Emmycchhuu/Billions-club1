"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user || pathname === "/auth/signin" || pathname === "/auth/signup") {
    return null
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Games", href: "/games" },
    { label: "Leaderboards", href: "/leaderboards" },
    { label: "Community", href: "/community" },
    { label: "Verification", href: "/verification" },
    { label: "Profile", href: "/profile" },
  ]

  const handleSignOut = () => {
    signOut()
    router.push("/auth/signin")
    setIsOpen(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Billions Club
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="ml-4 text-destructive hover:text-destructive bg-transparent"
            >
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full text-destructive hover:text-destructive bg-transparent"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
