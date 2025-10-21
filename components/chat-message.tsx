import { formatDistanceToNow } from "date-fns"

interface ChatMessageProps {
  id: string
  message: string
  username: string
  avatarUrl?: string
  avatarType: string
  isVerified: boolean
  createdAt: string
}

export default function ChatMessage({
  message,
  username,
  avatarUrl,
  avatarType,
  isVerified,
  createdAt,
}: ChatMessageProps) {
  return (
    <div className="flex gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-cyan-400/30">
        {avatarUrl ? (
          <img src={avatarUrl || "/placeholder.svg"} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-foreground">{username}</p>
          {isVerified && (
            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-foreground break-words">{message}</p>
      </div>
    </div>
  )
}
