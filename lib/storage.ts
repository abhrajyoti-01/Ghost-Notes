// Shared in-memory storage for notes with expiry
export interface StoredNote {
  content: string
  createdAt: Date
  expiresAt: Date
  passwordHash?: string
  preview?: string
}

// Single shared Map instance
export const notes = new Map<string, StoredNote>()

// Statistics tracking
export const stats = {
  totalNotes: 0,
  totalViews: 0,
  expiredNotes: 0,
}

// Optimized cleanup with batch processing
export const cleanupExpiredNotes = () => {
  const now = new Date()
  const expiredIds: string[] = []

  // Batch collect expired IDs
  for (const [id, note] of notes.entries()) {
    if (note.expiresAt <= now) {
      expiredIds.push(id)
    }
  }

  // Batch delete expired notes
  expiredIds.forEach((id) => notes.delete(id))
  stats.expiredNotes += expiredIds.length

  return expiredIds.length
}

// Run cleanup every 5 minutes with error handling
const cleanupInterval = setInterval(
  () => {
    try {
      cleanupExpiredNotes()
    } catch (error) {
      console.error("Cleanup error:", error)
    }
  },
  5 * 60 * 1000,
)

// Cleanup on process exit
process.on("SIGTERM", () => {
  clearInterval(cleanupInterval)
})
