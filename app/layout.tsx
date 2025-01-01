import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Management System",
  description: "Manage your tasks and projects efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navigation />
              <main className="flex-grow p-4 md:p-8">{children}</main>
            </div>
          </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

