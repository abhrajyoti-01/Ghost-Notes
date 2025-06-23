"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Send,
  CheckCircle,
  AlertCircle,
  Timer,
  Zap,
  Shield,
  Eye,
  QrCode,
  BarChart3,
  Lock,
  Unlock,
  Download,
  Share2,
  Sparkles,
  TrendingUp,
  Clock,
  FileText,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import dynamic from "next/dynamic"

// Lazy load QR code component to reduce initial bundle size
const QRCodeComponent = dynamic(() => import("@/components/qr-code"), {
  loading: () => (
    <div className="w-40 h-40 bg-gray-800/50 rounded-lg animate-pulse flex items-center justify-center">
      <QrCode className="h-8 w-8 text-gray-600" />
    </div>
  ),
  ssr: false,
})

// Memoized components for better performance
const StatsCard = memo(function StatsCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  value: number
  label: string
  color: string
}) {
  const iconColor = color.includes("purple")
    ? "#a855f7"
    : color.includes("blue")
      ? "#3b82f6"
      : color.includes("green")
        ? "#10b981"
        : "#f59e0b"

  const textColor = color.includes("purple")
    ? "#c084fc"
    : color.includes("blue")
      ? "#60a5fa"
      : color.includes("green")
        ? "#34d399"
        : "#fbbf24"

  return (
    <div className={`bg-gradient-to-br ${color} border border-opacity-20 rounded-lg p-2 sm:p-3 text-center`}>
      <Icon className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1" style={{ color: iconColor }} />
      <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
      <div className="text-xs" style={{ color: textColor }}>
        {label}
      </div>
    </div>
  )
})

const FeatureBadge = memo(function FeatureBadge({
  icon: Icon,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 text-xs sm:text-sm ${className || ""}`}
    >
      <Icon className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
      {children}
    </Badge>
  )
})

interface Stats {
  totalNotes: number
  totalViews: number
  activeNotes: number
  expiredNotes: number
}

// Debounce hook for input optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function HomePage() {
  const [note, setNote] = useState("")
  const [password, setPassword] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [qrCodeData, setQrCodeData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expiryTime, setExpiryTime] = useState("1h")
  const [usePassword, setUsePassword] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalNotes: 0, totalViews: 0, activeNotes: 0, expiredNotes: 0 })
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Debounce note input to prevent excessive re-renders
  const debouncedNote = useDebounce(note, 300)

  // Memoized expiry options to prevent recreation on every render
  const expiryOptions = useMemo(
    () => [
      { value: "1h", label: "1 Hour", description: "Perfect for quick shares", icon: "⚡" },
      { value: "24h", label: "1 Day", description: "Good for daily coordination", icon: "📅" },
      { value: "72h", label: "3 Days", description: "Maximum security period", icon: "🛡️" },
    ],
    [],
  )

  // Memoized character count calculation
  const characterInfo = useMemo(() => {
    const length = note.length
    const status = length > 8000 ? "Almost full" : length > 5000 ? "Getting long" : "Good length"
    const className =
      length > 8000
        ? "bg-red-500/20 text-red-400 animate-pulse"
        : length > 5000
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-green-500/20 text-green-400"

    return { length, status, className }
  }, [note.length])

  // Optimized fetch stats with caching
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Set up periodic refresh with cleanup
    const interval = setInterval(fetchStats, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchStats])

  // Optimized generate link function
  const generateLink = useCallback(async () => {
    if (!debouncedNote.trim()) {
      toast({
        title: "Empty Note",
        description: "Please write something before generating a link.",
        variant: "destructive",
      })
      return
    }

    if (usePassword && !password.trim()) {
      toast({
        title: "Password Required",
        description: "Please set a password for your protected note.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: debouncedNote,
          expiryHours: Number.parseInt(expiryTime.replace("h", "")),
          password: usePassword ? password : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create note")
      }

      const data = await response.json()
      const fullLink = `${window.location.origin}/note/${data.id}`
      setGeneratedLink(fullLink)
      setQrCodeData(fullLink)
      setNote("")
      setPassword("")

      // Refresh stats
      fetchStats()

      toast({
        title: "🎉 Ghost Link Created!",
        description: "Your secure note is ready to haunt the internet.",
      })
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [debouncedNote, password, expiryTime, usePassword, toast, fetchStats])

  // Optimized clipboard function with error handling
  const copyToClipboard = useCallback(async () => {
    if (!generatedLink) return

    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      toast({
        title: "📋 Copied!",
        description: "Link is ready to share securely.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = generatedLink
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        toast({
          title: "📋 Copied!",
          description: "Link is ready to share securely.",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        toast({
          title: "Copy Failed",
          description: "Please copy the link manually.",
          variant: "destructive",
        })
      }
      document.body.removeChild(textArea)
    }
  }, [generatedLink, toast])

  // Optimized QR download function
  const downloadQR = useCallback(() => {
    const canvas = document.querySelector("#qr-code canvas") as HTMLCanvasElement
    if (canvas) {
      try {
        const link = document.createElement("a")
        link.download = "ghost-note-qr.png"
        link.href = canvas.toDataURL("image/png", 0.9) // Optimize quality
        link.click()
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Could not download QR code.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  const createNewNote = useCallback(() => {
    setGeneratedLink("")
    setQrCodeData("")
    setCopied(false)
    setExpiryTime("1h")
    setUsePassword(false)
    setActiveTab("create")
  }, [])

  const handleManualDelete = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const confirmManualDelete = useCallback(async () => {
    if (!generatedLink) return

    setIsDeleting(true)
    try {
      const noteId = generatedLink.split("/").pop()
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "🗑️ Note Destroyed!",
          description: "Your ghost note has been permanently deleted.",
        })
        createNewNote()
        fetchStats()
      } else {
        throw new Error("Failed to delete note")
      }
    } catch (error) {
      toast({
        title: "❌ Deletion Failed",
        description: "Could not delete the note. It may have already been viewed.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [generatedLink, toast, createNewNote, fetchStats])

  // Memoized stats cards to prevent unnecessary re-renders
  const statsCards = useMemo(
    () => [
      {
        icon: FileText,
        value: stats.totalNotes,
        label: "Created",
        color: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
      },
      {
        icon: Eye,
        value: stats.totalViews,
        label: "Viewed",
        color: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
      },
      {
        icon: TrendingUp,
        value: stats.activeNotes,
        label: "Active",
        color: "from-green-500/10 to-green-600/10 border-green-500/20",
      },
      {
        icon: Clock,
        value: stats.expiredNotes,
        label: "Expired",
        color: "from-orange-500/10 to-orange-600/10 border-orange-500/20",
      },
    ],
    [stats],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Optimized animated background with will-change for GPU acceleration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 pt-6 sm:pt-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 group flex-col sm:flex-row">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 sm:h-10 w-8 sm:w-10 text-white animate-pulse" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Ghost Notes
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <span className="text-purple-400 text-sm font-medium">Ephemeral • Secure • Untraceable</span>
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Create self-destructing messages that vanish after reading.
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold">
              {" "}
              Perfect for sharing secrets, passwords, and sensitive data.
            </span>
          </p>

          {/* Memoized feature badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
            <FeatureBadge icon={Eye} className="text-green-400">
              One-time view
            </FeatureBadge>
            <FeatureBadge icon={Timer} className="text-blue-400">
              Auto-expires
            </FeatureBadge>
            <FeatureBadge icon={Shield} className="text-purple-400">
              Memory-only
            </FeatureBadge>
            <FeatureBadge icon={Lock} className="text-orange-400">
              Password protected
            </FeatureBadge>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-6">
            <Link href="/docs">
              <Button
                variant="outline"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800/50 border-gray-600/50 text-blue-400 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <FileText className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Stats Sidebar - Memoized */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl shadow-2xl lg:sticky lg:top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
                  <BarChart3 className="h-4 sm:h-5 w-4 sm:w-5 text-purple-400" />
                  Ghost Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {statsCards.map((stat, index) => (
                    <StatsCard key={index} icon={stat.icon} value={stat.value} label={stat.label} color={stat.color} />
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    System Status
                  </div>
                  <div className="text-xs text-gray-500">
                    All notes stored in memory • Zero persistence • Maximum privacy
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50">
                <TabsTrigger
                  value="create"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                >
                  <Send className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Note</span>
                  <span className="sm:hidden">Create</span>
                </TabsTrigger>
                <TabsTrigger
                  value="share"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
                  disabled={!generatedLink}
                >
                  <Share2 className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Share & QR</span>
                  <span className="sm:hidden">Share</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="mt-6">
                <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl text-white">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                        <Send className="h-5 sm:h-6 w-5 sm:w-6 text-purple-400" />
                      </div>
                      <span className="text-lg sm:text-2xl">Create Secure Ghost Note</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-base sm:text-lg">
                      Write your confidential message. Add password protection and choose expiry time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Your Secret Message</label>
                      <Textarea
                        placeholder="Enter your confidential information here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-32 sm:min-h-40 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-500 resize-none focus:border-purple-500/50 focus:ring-purple-500/20 text-base sm:text-lg leading-relaxed transition-all duration-300"
                        maxLength={10000}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{characterInfo.length}/10,000 characters</span>
                        <div
                          className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full transition-all duration-300 ${characterInfo.className}`}
                        >
                          {characterInfo.status}
                        </div>
                      </div>
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setUsePassword(!usePassword)}
                          className={`border-gray-600/50 transition-all duration-300 text-xs sm:text-sm ${
                            usePassword
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                              : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                          }`}
                        >
                          {usePassword ? (
                            <Lock className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                          ) : (
                            <Unlock className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                          )}
                          {usePassword ? "Password Protected" : "Add Password Protection"}
                        </Button>
                        {usePassword && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Extra Secure
                          </Badge>
                        )}
                      </div>

                      {usePassword && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <Input
                            type="password"
                            placeholder="Enter password for your note..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Recipients will need this password to view your note
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Expiry Time</label>
                      <Select value={expiryTime} onValueChange={setExpiryTime}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-gray-800 border-gray-700 max-h-60 overflow-y-auto"
                          position="popper"
                          sideOffset={4}
                        >
                          {expiryOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <span className="text-base sm:text-lg">{option.icon}</span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm sm:text-base">{option.label}</span>
                                  <span className="text-xs sm:text-sm text-gray-400">{option.description}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={generateLink}
                      disabled={isLoading || !debouncedNote.trim()}
                      className="w-full h-12 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-white mr-2 sm:mr-3" />
                          <span className="text-sm sm:text-lg">Generating Secure Link...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3 animate-pulse" />
                          <span className="text-sm sm:text-lg">Generate Ghost Link</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="share" className="mt-6">
                {generatedLink && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Link Sharing */}
                    <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl shadow-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl text-green-400">
                          <CheckCircle className="h-5 sm:h-6 w-5 sm:w-6" />
                          Ghost Link Ready!
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-3 sm:p-4 rounded-xl border border-gray-600/30">
                          <p className="text-sm font-medium text-gray-300 mb-3">🔗 Your Ghost Link:</p>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <code className="flex-1 bg-gray-900/50 p-2 sm:p-3 rounded-lg border border-gray-600/30 text-xs sm:text-sm text-gray-200 break-all font-mono min-h-[2.5rem] flex items-center">
                              {generatedLink}
                            </code>
                            <Button
                              onClick={copyToClipboard}
                              variant="outline"
                              size="sm"
                              className={`border-gray-600/50 transition-all duration-300 flex-shrink-0 ${
                                copied
                                  ? "bg-green-500/20 border-green-500/50 text-green-400 scale-110"
                                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                              }`}
                            >
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-3">
                            <AlertCircle className="h-4 w-4 text-amber-400 mb-2" />
                            <p className="text-xs text-amber-300 font-medium">One-time view</p>
                            <p className="text-xs text-amber-200/80">Self-destructs after reading</p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3">
                            <Timer className="h-4 w-4 text-purple-400 mb-2" />
                            <p className="text-xs text-purple-300 font-medium">Auto-expires</p>
                            <p className="text-xs text-purple-200/80">
                              {expiryOptions.find((o) => o.value === expiryTime)?.label}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* QR Code - Lazy loaded */}
                    <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl shadow-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl text-blue-400">
                          <QrCode className="h-5 sm:h-6 w-5 sm:w-6" />
                          QR Code
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          Scan to access the ghost note on mobile devices
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg">
                            <QRCodeComponent value={qrCodeData} size={160} />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={downloadQR}
                            variant="outline"
                            className="flex-1 border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 text-sm transition-all duration-300"
                          >
                            <Download className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                            Download QR
                          </Button>
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="flex-1 border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 text-sm transition-all duration-300"
                          >
                            <Share2 className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                            Share Link
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                        <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-300 mb-2 text-sm sm:text-base">Manual Destruction</h4>
                        <p className="text-red-200/80 text-xs sm:text-sm mb-4">
                          Changed your mind? You can manually destroy this ghost note before anyone views it. This
                          action is permanent and cannot be undone.
                        </p>
                        <Button
                          onClick={handleManualDelete}
                          variant="outline"
                          className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/70 transition-all duration-300 text-xs sm:text-sm"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-red-400 mr-1 sm:mr-2" />
                              Destroying...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                              Destroy Note Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button
                    onClick={createNewNote}
                    variant="outline"
                    className="border-gray-600/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 text-sm"
                  >
                    <Send className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    Create Another Ghost Note
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/30 rounded-full border border-gray-700/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-400">System Online</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
            <span className="text-xs sm:text-sm text-gray-400">
              Created by <span className="text-purple-400 font-medium">Abhra</span>
            </span>
            <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
            <span className="text-xs sm:text-sm text-gray-400">Zero Database • Maximum Privacy • Open Source</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900/95 border-red-500/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl text-red-400">
                <AlertTriangle className="h-5 sm:h-6 w-5 sm:w-6" />
                Confirm Destruction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm sm:text-base">
                Are you sure you want to permanently destroy this ghost note? This action cannot be undone and the link
                will become invalid immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={confirmManualDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-sm transition-all duration-300"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Destroying...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Yes, Destroy It
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 border-gray-600/50 bg-gray-800/50 text-gray-300 text-sm transition-all duration-300"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
