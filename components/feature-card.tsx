"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  title: string
  description: string
  image?: string
  gradient: string
  href: string
  color: string
}

export default function FeatureCard({ title, description, image, gradient, href, color }: FeatureCardProps) {
  const router = useRouter()

  return (
    <Card
      className={`${gradient} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer overflow-hidden`}
    >
      <CardHeader className="pb-3">
        {image && (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-muted">
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => router.push(href)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        >
          Explore
        </Button>
      </CardContent>
    </Card>
  )
}
