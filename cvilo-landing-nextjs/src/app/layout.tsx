import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CVilo - Coming Soon | The Future of Resume Building",
  description: "CVilo is revolutionizing how professionals create stunning resumes. Powered by AI, designed for success. Coming soon!",
  keywords: "resume builder, AI resume, professional resume, CV builder, coming soon",
  authors: [{ name: "CVilo Team" }],
  openGraph: {
    title: "CVilo - Coming Soon | The Future of Resume Building",
    description: "CVilo is revolutionizing how professionals create stunning resumes. Powered by AI, designed for success.",
    type: "website",
    url: "https://cvilo.com",
    siteName: "CVilo",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVilo - Coming Soon | The Future of Resume Building",
    description: "CVilo is revolutionizing how professionals create stunning resumes. Powered by AI, designed for success.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 