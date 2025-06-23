import { NextResponse } from "next/server"

// Import the same notes Map and stats from the main route
const notes = new Map()

// Statistics tracking
const stats = {
  totalNotes: 0,
  totalViews: 0,
  expiredNotes: 0,
}

export async function GET() {
  return NextResponse.json({
    totalNotes: stats.totalNotes,
    totalViews: stats.totalViews,
    activeNotes: notes.size,
    expiredNotes: stats.expiredNotes,
  })
}
