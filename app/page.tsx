"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import LoadingPage from "@/components/loading-page"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth/signin")
      }
    }, 6000)

    return () => clearTimeout(timer)
  }, [router, user])

  if (isLoading) {
    return <LoadingPage />
  }

  return null
}
