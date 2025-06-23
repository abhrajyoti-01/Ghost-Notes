"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Shield,
  Zap,
  Lock,
  Timer,
  Eye,
  QrCode,
  Copy,
  Home,
  Code,
  Server,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Github,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl shadow-2xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Ghost Notes Documentation
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-purple-400 text-sm font-medium">Complete Guide & API Reference</span>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Everything you need to know about creating, sharing, and managing self-destructing notes.
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold">
              {" "}
              Built with security and privacy in mind.
            </span>
          </p>

          <Link href="/">
            <Button variant="outline" className="border-gray-600/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50">
              <Home className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700/50 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Features
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              API Reference
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              About
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <Zap className="h-6 w-6 text-purple-400" />
                  What is Ghost Notes?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Ghost Notes is a secure, ephemeral messaging platform that allows you to share sensitive information
                  that automatically self-destructs after being viewed once. Perfect for sharing passwords, API keys,
                  confidential messages, and any sensitive data that shouldn't persist.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                    <Shield className="h-6 w-6 text-purple-400 mb-3" />
                    <h3 className="font-semibold text-purple-300 mb-2">Zero Persistence</h3>
                    <p className="text-purple-200/80 text-sm">
                      Notes are stored only in server memory and are permanently deleted after viewing or expiry.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <Timer className="h-6 w-6 text-blue-400 mb-3" />
                    <h3 className="font-semibold text-blue-300 mb-2">Auto-Expiry</h3>
                    <p className="text-blue-200/80 text-sm">
                      Set custom expiry times from 1 hour to 3 days. Notes self-destruct even if not viewed.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <Lock className="h-6 w-6 text-green-400 mb-3" />
                    <h3 className="font-semibold text-green-300 mb-2">Password Protection</h3>
                    <p className="text-green-200/80 text-sm">
                      Add an extra layer of security with optional password protection using bcrypt hashing.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
                    <QrCode className="h-6 w-6 text-orange-400 mb-3" />
                    <h3 className="font-semibold text-orange-300 mb-2">QR Code Sharing</h3>
                    <p className="text-orange-200/80 text-sm">
                      Generate QR codes for easy mobile sharing and quick access to your ghost notes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <Monitor className="h-5 w-5 text-blue-400" />
                  How to Use Ghost Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Write Your Message</h4>
                      <p className="text-gray-400 text-sm">
                        Enter your confidential information in the text area. Supports up to 10,000 characters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Configure Security</h4>
                      <p className="text-gray-400 text-sm">
                        Choose expiry time (1 hour, 1 day, or 3 days) and optionally add password protection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Generate & Share</h4>
                      <p className="text-gray-400 text-sm">
                        Click "Generate Ghost Link" to create a secure, one-time-use URL. Share via link or QR code.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Auto-Destruction</h4>
                      <p className="text-gray-400 text-sm">
                        The note is permanently deleted after being viewed once or when the expiry time is reached.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <Eye className="h-5 w-5 text-green-400" />
                    Core Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">One-time view self-destruction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Automatic expiry (1h, 1d, 3d)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Memory-only storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Up to 10,000 characters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Real-time countdown timer</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">Optional password protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">bcrypt password hashing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">Secure random ID generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">No database persistence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">HTTPS-only transmission</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    Sharing Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">QR code generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">One-click copy to clipboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Download QR as PNG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Mobile-optimized interface</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Note preview system</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <Database className="h-5 w-5 text-orange-400" />
                    Analytics Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Real-time statistics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Notes created counter</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Views tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Active notes monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Expiry tracking</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <Code className="h-6 w-6 text-green-400" />
                  API Reference
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  RESTful API endpoints for integrating Ghost Notes into your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Create Note</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">POST</Badge>
                      <Button
                        onClick={() => copyToClipboard("POST /api/notes")}
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 bg-gray-800/50 text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-green-400 font-mono">/api/notes</code>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Request Body:</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "content": "Your secret message",
  "expiryHours": 1,
  "password": "optional-password"
}`}
                      </pre>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Response:</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "id": "unique-note-id",
  "expiresAt": "2024-01-01T12:00:00.000Z",
  "expiryHours": 1,
  "hasPassword": true
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Retrieve Note</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">GET</Badge>
                      <Button
                        onClick={() => copyToClipboard("GET /api/notes/[id]")}
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 bg-gray-800/50 text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-blue-400 font-mono">/api/notes/[id]</code>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Response (Success):</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "content": "Your secret message",
  "expiresAt": "2024-01-01T12:00:00.000Z",
  "timeRemaining": "1h 30m",
  "destroyedAt": "2024-01-01T11:30:00.000Z",
  "hasPassword": false,
  "preview": "Your secret..."
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Verify Password</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">POST</Badge>
                      <Button
                        onClick={() => copyToClipboard("POST /api/notes/[id]")}
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 bg-gray-800/50 text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-purple-400 font-mono">/api/notes/[id]</code>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Request Body:</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "password": "your-password"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Get Statistics</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">GET</Badge>
                      <Button
                        onClick={() => copyToClipboard("GET /api/stats")}
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 bg-gray-800/50 text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-orange-400 font-mono">/api/stats</code>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Response:</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "totalNotes": 1234,
  "totalViews": 987,
  "activeNotes": 45,
  "expiredNotes": 789
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Manual Delete Note</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">DELETE</Badge>
                      <Button
                        onClick={() => copyToClipboard("DELETE /api/notes/[id]")}
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 bg-gray-800/50 text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-red-400 font-mono">/api/notes/[id]</code>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Response (Success):</h4>
                      <pre className="bg-gray-900/50 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {`{
  "message": "Note successfully destroyed",
  "destroyedAt": "2024-01-01T11:30:00.000Z"
}`}
                      </pre>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">
                        <strong>Note:</strong> This endpoint allows manual deletion of a note before it's viewed or
                        expires. Once deleted, the note cannot be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <Shield className="h-6 w-6 text-red-400" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-300 text-lg mb-2">Important Security Notice</h3>
                      <p className="text-red-200/90 leading-relaxed">
                        Ghost Notes is designed for maximum privacy and security. However, please understand the
                        security model and limitations before sharing highly sensitive information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-green-400">✅ What We Do</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Memory-Only Storage</p>
                          <p className="text-gray-400 text-sm">
                            Notes are stored only in server RAM, never written to disk or database
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Automatic Destruction</p>
                          <p className="text-gray-400 text-sm">
                            Notes are permanently deleted after viewing or expiry, whichever comes first
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Password Hashing</p>
                          <p className="text-gray-400 text-sm">
                            Optional passwords are hashed using bcrypt with salt rounds
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Secure ID Generation</p>
                          <p className="text-gray-400 text-sm">
                            16-character cryptographically secure random IDs using nanoid
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">HTTPS Encryption</p>
                          <p className="text-gray-400 text-sm">All data transmission is encrypted in transit</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-400">⚠️ Limitations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Server Memory</p>
                          <p className="text-gray-400 text-sm">
                            Notes are lost if the server restarts or crashes before expiry
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Network Security</p>
                          <p className="text-gray-400 text-sm">
                            Share links through secure channels (encrypted messaging, etc.)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Browser Security</p>
                          <p className="text-gray-400 text-sm">
                            Recipient's browser history and cache may temporarily store data
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">Screenshot Risk</p>
                          <p className="text-gray-400 text-sm">
                            Recipients can screenshot or copy content before it self-destructs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 font-medium">No Audit Trail</p>
                          <p className="text-gray-400 text-sm">No logs are kept of who accessed what content or when</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-300 text-lg mb-3">🛡️ Best Practices</h3>
                  <ul className="space-y-2 text-blue-200/90">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Use password protection for highly sensitive information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Share links through encrypted messaging platforms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Use the shortest expiry time that meets your needs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Verify the recipient before sharing the link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Consider using QR codes for in-person sharing</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <Heart className="h-6 w-6 text-pink-400" />
                  About Ghost Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl shadow-2xl">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Created by Abhra
                      </h2>
                      <p className="text-gray-400 mt-1">Full-Stack Developer & Security Enthusiast</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-6">
                  <h3 className="font-semibold text-pink-300 text-lg mb-3">👨‍💻 About the Creator</h3>
                  <p className="text-pink-200/90 leading-relaxed mb-4">
                    Ghost Notes was created by <strong>Abhra</strong>, a passionate full-stack developer with a focus on
                    security and privacy. This project was born out of the need for a simple, secure way to share
                    sensitive information without leaving digital traces.
                  </p>
                  <p className="text-pink-200/90 leading-relaxed">
                    The application demonstrates modern web development practices, security principles, and user
                    experience design, all while maintaining a zero-persistence philosophy for maximum privacy.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg text-white">
                        <Code className="h-5 w-5 text-blue-400" />
                        Technology Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          Next.js 15
                        </Badge>
                        <span className="text-gray-400 text-sm">React Framework</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          TypeScript
                        </Badge>
                        <span className="text-gray-400 text-sm">Type Safety</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          Tailwind CSS
                        </Badge>
                        <span className="text-gray-400 text-sm">Styling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                          shadcn/ui
                        </Badge>
                        <span className="text-gray-400 text-sm">UI Components</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                          bcrypt
                        </Badge>
                        <span className="text-gray-400 text-sm">Password Hashing</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg text-white">
                        <Globe className="h-5 w-5 text-green-400" />
                        Open Source
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Ghost Notes is built with transparency in mind. The entire codebase demonstrates best practices
                        for secure web application development.
                      </p>
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">Available for review and learning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">Security through transparency</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center pt-6 border-t border-gray-700/50">
                  <p className="text-gray-400 mb-4">
                    Built with ❤️ for privacy and security by{" "}
                    <span className="text-purple-400 font-semibold">Abhra</span>
                  </p>
                  <div className="flex justify-center gap-4">
                    <Badge
                      variant="secondary"
                      className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <Server className="h-3 w-3 mr-1" />
                      Zero Database
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Maximum Privacy
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Open Source
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/30 rounded-full border border-gray-700/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Documentation v1.0</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <span className="text-sm text-gray-400">
              Created by <span className="text-purple-400 font-medium">Abhra</span>
            </span>
            <div className="w-px h-4 bg-gray-600"></div>
            <span className="text-sm text-gray-400">Open Source • Privacy First</span>
          </div>
        </div>
      </div>
    </div>
  )
}
