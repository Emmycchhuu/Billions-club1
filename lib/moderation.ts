// Moderation utilities for chat filtering
export const BAD_WORDS = [
  "badword1",
  "badword2",
  "offensive1",
  "inappropriate",
  "spam",
  "hate",
  "abuse",
  "violence",
  "explicit",
]

export const LINK_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi

export function checkMessageContent(message: string): {
  isClean: boolean
  violations: string[]
} {
  const violations: string[] = []
  const lowerMessage = message.toLowerCase()

  // Check for bad words
  for (const word of BAD_WORDS) {
    if (lowerMessage.includes(word)) {
      violations.push("bad_word")
      break
    }
  }

  // Check for links
  if (LINK_REGEX.test(message)) {
    violations.push("link_detected")
  }

  return {
    isClean: violations.length === 0,
    violations,
  }
}

export function sanitizeMessage(message: string): string {
  // Remove links
  let sanitized = message.replace(LINK_REGEX, "[link removed]")

  // Replace bad words with asterisks
  for (const word of BAD_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    sanitized = sanitized.replace(regex, "*".repeat(word.length))
  }

  return sanitized
}
