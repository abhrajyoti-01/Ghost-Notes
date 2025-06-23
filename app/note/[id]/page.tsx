"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  EyeOff,
  Home,
  AlertTriangle,
  Timer,
  Zap,
  Clock,
  Shield,
  CheckCircle,
  Lock,
  Unlock,
  FileText,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface PageProps {
  params: Promise<{ id: string }>
}

interface NoteData {
  content: string
  expiresAt: string
  timeRemaining: string
  hasPassword: boolean
  preview?: string
}

export default function NotePage({ params }: PageProps) {
  const [note, setNote] = useState<NoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [id, setId] = useState<string>("")
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [password, setPassword] = useState("")
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`)

        if (response.status === 404) {
          setError("This ghost note has vanished or never existed.")
        } else if (response.status === 410) {
          setError("This note has expired and been automatically destroyed.")
        } else if (response.status === 401) {
          setPasswordRequired(true)
          setLoading(false)
          return
        } else if (!response.ok) {
          setError("Failed to retrieve the ghost note.")
        } else {
          const data = await response.json()
          setNote(data)

          // Start countdown timer
          const updateTimer = () => {
            const now = new Date().getTime()
            const expiry = new Date(data.expiresAt).getTime()
            const remaining = expiry - now

            if (remaining <= 0) {
              setTimeRemaining("Expired")
            } else {
              const hours = Math.floor(remaining / (1000 * 60 * 60))
              const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
              const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

              if (hours > 0) {
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
              } else if (minutes > 0) {
                setTimeRemaining(`${minutes}m ${seconds}s`)
              } else {
                setTimeRemaining(`${seconds}s`)
              }
            }
          }

          updateTimer()
          const interval = setInterval(updateTimer, 1000)
          return () => clearInterval(interval)
        }
      } catch (err) {
        setError("An error occurred while retrieving the ghost note.")
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id])

  const submitPassword = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required")
      return
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (response.status === 401) {
        setPasswordError("Incorrect password")
        return
      }

      if (!response.ok) {
        setPasswordError("Failed to verify password")
        return
      }

      const data = await response.json()
      setNote(data)
      setPasswordRequired(false)
      setPasswordError("")

      // Start countdown timer
      const updateTimer = () => {
        const now = new Date().getTime()
        const expiry = new Date(data.expiresAt).getTime()
        const remaining = expiry - now

        if (remaining <= 0) {
          setTimeRemaining("Expired")
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60))
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

          if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
          } else if (minutes > 0) {
            setTimeRemaining(`${minutes}m ${seconds}s`)
          } else {
            setTimeRemaining(`${seconds}s`)
          }
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } catch (err) {
      setPasswordError("An error occurred")
    }
  }

  const revealNote = () => {
    setRevealed(true)
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  const copyContent = async () => {
    if (note?.content) {
      try {
        await navigator.clipboard.writeText(note.content)
        toast({
          title: "📋 Copied!",
          description: "Note content copied to clipboard.",
        })
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Please copy the content manually.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-md bg-gray-900/50 border-gray-700/50 backdrop-blur-xl relative z-10">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-6" />
            <p className="text-gray-300 text-lg">Decrypting ghost note...</p>
            <p className="text-gray-500 text-sm mt-2">Verifying secure access</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-md bg-gray-900/50 border-gray-700/50 backdrop-blur-xl relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-purple-400">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              Password Protected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">This ghost note is protected with a password.</p>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError("")
                }}
                onKeyPress={(e) => e.key === "Enter" && submitPassword()}
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            </div>

            <Button
              onClick={submitPassword}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Unlock className="h-4 w-4 mr-2" />
              Unlock Ghost Note
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full border-gray-600/50 bg-gray-800/50 text-gray-300">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-lg bg-gray-900/50 border-gray-700/50 backdrop-blur-xl relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-400 text-xl">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              Ghost Note Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300 text-lg">{error}</p>

            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 rounded-xl border border-gray-600/30">
              <p className="text-sm font-medium text-gray-300 mb-2">This could happen if:</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  The note was already viewed and self-destructed
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  The expiry timer reached zero
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  The link is invalid or corrupted
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  Server was restarted (memory-only storage)
                </li>
              </ul>
            </div>

            <Link href="/">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                <Home className="h-4 w-4 mr-2" />
                Create New Ghost Note
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-2xl bg-gray-900/50 border-gray-700/50 backdrop-blur-xl relative z-10">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl text-white">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
              {revealed ? <Eye className="h-6 w-6 text-green-400" /> : <EyeOff className="h-6 w-6 text-purple-400" />}
            </div>
            {revealed ? "Ghost Note Revealed" : "Secure Ghost Note"}
          </CardTitle>

          {!revealed && note && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/30">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">
                  {timeRemaining === "Expired" ? "⚠️ Expired" : `⏱️ ${timeRemaining}`}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">One-time access</span>
              </div>
              {note.hasPassword && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-500/30">
                  <Lock className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-orange-300 font-medium">Password protected</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {!revealed ? (
            <>
              {/* Note Preview */}
              {note?.preview && (
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Note Preview
                    </h3>
                    <Button
                      onClick={togglePreview}
                      variant="outline"
                      size="sm"
                      className="border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    >
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {showPreview && (
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-300 font-mono text-sm">
                        {note.preview}
                        <span className="text-gray-500">...</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        This is just a preview. Full content will be revealed below.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-300 text-lg mb-2">⚠️ Final Warning</p>
                    <p className="text-amber-200/90 leading-relaxed">
                      This ghost note will be{" "}
                      <span className="font-semibold text-amber-100">permanently destroyed</span> after you view it.
                      Make sure you're ready to read it now, as there's no way to recover it once revealed.
                    </p>
                    <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <p className="text-sm text-amber-200/80">
                        💡 <strong>Tip:</strong> Have your secure storage ready if you need to save this information
                        elsewhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={revealNote}
                className="w-full h-16 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Eye className="h-6 w-6 mr-3" />
                Reveal Ghost Note (This Will Destroy It)
              </Button>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-600/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-green-400 text-lg">Your Secret Message:</h3>
                  </div>
                  <Button
                    onClick={copyContent}
                    variant="outline"
                    size="sm"
                    className="border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600/30">
                  <p className="whitespace-pre-wrap text-gray-100 leading-relaxed text-lg font-mono">{note?.content}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-300 text-lg mb-2">✅ Mission Accomplished</p>
                    <p className="text-green-200/90 leading-relaxed">
                      The ghost note has been successfully revealed and{" "}
                      <span className="font-semibold text-green-100">permanently deleted</span> from our servers. The
                      link is now invalid and cannot be used again.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-200/80">
                      <Timer className="h-4 w-4" />
                      <span>Self-destructed at {new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-600/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Create Another Ghost Note
                </Button>
              </Link>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/30 rounded-full border border-gray-700/30 text-xs text-gray-500">
                  <span>Secured by Ghost Notes</span>
                  <div className="w-px h-3 bg-gray-600"></div>
                  <span>
                    Created by <span className="text-purple-400">Abhra</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
