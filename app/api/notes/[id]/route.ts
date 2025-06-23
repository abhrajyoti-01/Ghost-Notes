import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Import the same notes Map from the main route
interface StoredNote {
  content: string
  createdAt: Date
  expiresAt: Date
  passwordHash?: string
  preview?: string
}

const notes = new Map<string, StoredNote>()

// Statistics tracking
const stats = {
  totalNotes: 0,
  totalViews: 0,
  expiredNotes: 0,
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
    }

    // Check if the note exists
    const note = notes.get(id)

    if (!note) {
      return NextResponse.json({ error: "Note not found or has already been viewed" }, { status: 404 })
    }

    // Check if the note has expired
    const now = new Date()
    if (note.expiresAt <= now) {
      // Remove expired note
      notes.delete(id)
      return NextResponse.json({ error: "Note has expired and been automatically destroyed" }, { status: 410 })
    }

    // Check if password is required
    if (note.passwordHash) {
      return NextResponse.json({ error: "Password required" }, { status: 401 })
    }

    // Calculate time remaining
    const timeRemaining = note.expiresAt.getTime() - now.getTime()
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    // Get the note content
    const { content, expiresAt, preview } = note

    // Immediately delete the note (self-destruct)
    notes.delete(id)

    // Update stats
    stats.totalViews++

    return NextResponse.json(
      {
        content,
        expiresAt: expiresAt.toISOString(),
        timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`,
        destroyedAt: new Date().toISOString(),
        hasPassword: false,
        preview,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { password } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
    }

    // Check if the note exists
    const note = notes.get(id)

    if (!note) {
      return NextResponse.json({ error: "Note not found or has already been viewed" }, { status: 404 })
    }

    // Check if the note has expired
    const now = new Date()
    if (note.expiresAt <= now) {
      // Remove expired note
      notes.delete(id)
      return NextResponse.json({ error: "Note has expired and been automatically destroyed" }, { status: 410 })
    }

    // Verify password
    if (!note.passwordHash || !password) {
      return NextResponse.json({ error: "Password required" }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, note.passwordHash)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Calculate time remaining
    const timeRemaining = note.expiresAt.getTime() - now.getTime()
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    // Get the note content
    const { content, expiresAt, preview } = note

    // Immediately delete the note (self-destruct)
    notes.delete(id)

    // Update stats
    stats.totalViews++

    return NextResponse.json(
      {
        content,
        expiresAt: expiresAt.toISOString(),
        timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`,
        destroyedAt: new Date().toISOString(),
        hasPassword: true,
        preview,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error retrieving note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
    }

    // Check if the note exists
    const note = notes.get(id)

    if (!note) {
      return NextResponse.json({ error: "Note not found or has already been viewed" }, { status: 404 })
    }

    // Delete the note
    notes.delete(id)

    return NextResponse.json(
      {
        message: "Note successfully destroyed",
        destroyedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
