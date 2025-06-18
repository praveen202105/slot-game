import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GoogleOAuthProvider } from "@react-oauth/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lucky Slots Casino",
  description: "The ultimate online slot machine experience",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
