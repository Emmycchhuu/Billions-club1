"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 30
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gradient-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-1 shadow-2xl border border-cyan-400/30">
            <img
              src="/images/billions-club-loading.png"
              alt="Billions Club"
              className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">BILLIONS CLUB</h1>
          <p className="text-cyan-200 text-base md:text-lg font-medium">Gaming Community Platform</p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/80 text-sm font-medium">
          {progress < 30 ? "Initializing..." : progress < 60 ? "Loading community..." : "Almost ready..."}
        </p>
      </div>
    </div>
  )
}
