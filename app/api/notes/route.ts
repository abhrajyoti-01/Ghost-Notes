import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { notes, stats, cleanupExpiredNotes } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, expiryHours = 1, password } = body

    // Input validation with early returns
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required and must be a non-empty string" }, { status: 400 })
    }

    if (content.length > 10000) {
      return NextResponse.json({ error: "Content must be less than 10,000 characters" }, { status: 400 })
    }

    // Validate expiry hours (max 72 hours = 3 days)
    const validExpiryHours = Math.min(Math.max(Number.parseInt(expiryHours) || 1, 1), 72)

    // Generate a unique ID for the note
    const id = nanoid(16) // Longer ID for better security

    const now = new Date()
    const expiresAt = new Date(now.getTime() + validExpiryHours * 60 * 60 * 1000)

    // Hash password if provided (optimize with lower rounds for performance)
    let passwordHash: string | undefined
    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password.trim(), 8) // Reduced from 10 to 8 for better performance
    }

    // Create preview (first 50 characters)
    const preview = content.length > 50 ? content.substring(0, 50) : undefined

    // Store the note in memory
    notes.set(id, {
      content: content.trim(),
      createdAt: now,
      expiresAt: expiresAt,
      passwordHash,
      preview,
    })

    // Update stats
    stats.totalNotes++

    // Clean up expired notes (non-blocking)
    setImmediate(() => cleanupExpiredNotes())

    return NextResponse.json(
      {
        id,
        expiresAt: expiresAt.toISOString(),
        expiryHours: validExpiryHours,
        hasPassword: !!passwordHash,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Clean up expired notes before returning stats
    cleanupExpiredNotes()

    return NextResponse.json(
      {
        totalNotes: notes.size,
        message: "Ghost Notes API is running",
        uptime: process.uptime(),
        stats,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        },
      },
    )
  } catch (error) {
    console.error("Error getting stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
