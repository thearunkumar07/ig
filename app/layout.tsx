import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free online Invoice Generator: Create an Invoice in Minutes",
  description: "Generate professional invoices instantly with FranchiseBhoomi's free online invoice generator.",
  keywords: [
    'free invoice generator',
    'free invoice maker',
    'online invoice creator',
    'PDF invoice generator',
    'professional invoice template',
    'freelancer invoice tool',
    'small business invoicing',
    'custom invoice generator',
    'free franchisebhoomi invoice generator',
    'franchisebhoomi invoice generator'
  ],
  icons: {
    icon: '/favicon.png', // This will use your favicon.png as the default favicon
    shortcut: '/favicon.png', // For older browsers
    apple: '/favicon.png', // For Apple devices
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
