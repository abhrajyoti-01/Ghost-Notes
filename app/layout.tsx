import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Ghost Notes - Secure Self-Destructing Messages",
  description:
    "Share sensitive information that automatically self-destructs after being viewed once. Created by Abhra for maximum privacy and security.",
  keywords: ["secure messaging", "self-destructing notes", "privacy", "ephemeral", "password protection", "Abhra"],
  authors: [{ name: "Abhra" }],
  creator: "Abhra",
  openGraph: {
    title: "Ghost Notes - Secure Self-Destructing Messages",
    description:
      "Share sensitive information that automatically self-destructs after being viewed once. Zero persistence, maximum privacy.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Notes - Secure Self-Destructing Messages",
    description: "Share sensitive information that automatically self-destructs after being viewed once.",
    creator: "@abhra",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Performance optimizations
  other: {
    "theme-color": "#1f2937",
    "color-scheme": "dark",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Performance hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Optimize for mobile */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} text-rendering-optimized`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="critical-above-fold">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
