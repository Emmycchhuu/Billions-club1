"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseClient } from "./supabase/client"

export interface User {
  id: string
  email: string
  username: string
  avatarType: "penguin" | "rabbit"
  level: number
  experience: number
  totalExp: number
  points: number
  profilePicture?: string
  referralCode: string
  referralCount: number
  isVerified?: boolean
  verificationStatus?: "pending" | "under_review" | "verified"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (
    email: string,
    password: string,
    username: string,
    avatarType: "penguin" | "rabbit",
    referralCode?: string,
  ) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  addExperience: (amount: number) => void
  addPoints: (amount: number) => void
  updateProfile: (updates: Partial<User>) => void
  updateVerificationStatus: (status: "pending" | "under_review" | "verified") => void
  uploadProfilePicture: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from database
          const { data: profile, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (!error && profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              username: profile.username,
              avatarType: profile.avatar_type,
              level: profile.level,
              experience: profile.experience,
              totalExp: profile.total_exp,
              points: profile.points,
              profilePicture: profile.profile_picture_url,
              referralCode: profile.referral_code,
              referralCount: profile.referral_count,
              isVerified: profile.is_verified,
              verificationStatus: profile.verification_status,
            })
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signUp = async (
    email: string,
    password: string,
    username: string,
    avatarType: "penguin" | "rabbit",
    referralCode?: string,
  ) => {
    try {
      const supabase = getSupabaseClient()

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("User creation failed")

      // Generate referral code
      const newReferralCode = `REF_${Date.now().toString(36).toUpperCase()}`
      let startingPoints = 1000

      // Create user profile in database
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            username,
            avatar_type: avatarType,
            referral_code: newReferralCode,
            points: startingPoints,
            level: 1,
            experience: 0,
            total_exp: 0,
            is_verified: false,
            verification_status: "pending",
          },
        ])
        .select()
        .single()

      if (profileError) throw profileError

      // Process referral bonus if code provided
      if (referralCode) {
        startingPoints = 1200
        await supabase.rpc("process_referral_bonus", {
          referral_code: referralCode,
          new_user_id: authData.user.id,
        })

        // Update new user's points
        await supabase.from("users").update({ points: 1200 }).eq("id", authData.user.id)
      }

      setUser({
        id: authData.user.id,
        email,
        username,
        avatarType,
        level: 1,
        experience: 0,
        totalExp: 0,
        points: startingPoints,
        referralCode: newReferralCode,
        referralCount: 0,
        isVerified: false,
        verificationStatus: "pending",
      })
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Sign in failed")

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      if (profileError) throw profileError

      setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        avatarType: profile.avatar_type,
        level: profile.level,
        experience: profile.experience,
        totalExp: profile.total_exp,
        points: profile.points,
        profilePicture: profile.profile_picture_url,
        referralCode: profile.referral_code,
        referralCount: profile.referral_count,
        isVerified: profile.is_verified,
        verificationStatus: profile.verification_status,
      })
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  const addExperience = (amount: number) => {
    if (!user) return

    const expMultiplier = Math.pow(1.1, user.level - 1)
    const adjustedAmount = Math.floor(amount / expMultiplier)

    const updatedUser = {
      ...user,
      experience: Math.max(0, user.experience + adjustedAmount),
      totalExp: Math.max(0, user.totalExp + adjustedAmount),
    }

    // Level up logic - max level 20
    const expThreshold = 1000
    if (updatedUser.experience >= expThreshold && updatedUser.level < 20) {
      updatedUser.level += Math.floor(updatedUser.experience / expThreshold)
      updatedUser.experience = updatedUser.experience % expThreshold
      if (updatedUser.level > 20) {
        updatedUser.level = 20
        updatedUser.experience = 0
      }
    }

    setUser(updatedUser)

    // Update in database
    const supabase = getSupabaseClient()
    supabase
      .from("users")
      .update({
        experience: updatedUser.experience,
        total_exp: updatedUser.totalExp,
        level: updatedUser.level,
      })
      .eq("id", user.id)
      .then()
  }

  const addPoints = (amount: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      points: Math.max(0, user.points + amount),
    }

    setUser(updatedUser)

    // Update in database
    const supabase = getSupabaseClient()
    supabase.from("users").update({ points: updatedUser.points }).eq("id", user.id).then()
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    // Update in database
    const supabase = getSupabaseClient()
    const dbUpdates: Record<string, any> = {}
    if (updates.username) dbUpdates.username = updates.username
    if (updates.profilePicture) dbUpdates.profile_picture_url = updates.profilePicture
    if (updates.avatarType) dbUpdates.avatar_type = updates.avatarType

    supabase.from("users").update(dbUpdates).eq("id", user.id).then()
  }

  const updateVerificationStatus = (status: "pending" | "under_review" | "verified") => {
    if (!user) return

    const updatedUser = {
      ...user,
      verificationStatus: status,
      isVerified: status === "verified",
    }

    setUser(updatedUser)

    // Update in database
    const supabase = getSupabaseClient()
    supabase
      .from("users")
      .update({
        verification_status: status,
        is_verified: status === "verified",
      })
      .eq("id", user.id)
      .then()
  }

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error("No user logged in")

    try {
      const supabase = getSupabaseClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

      // Update user profile with new picture URL
      await updateProfile({ profilePicture: data.publicUrl })

      return data.publicUrl
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        addExperience,
        addPoints,
        updateProfile,
        updateVerificationStatus,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
