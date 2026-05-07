import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MetaPixel } from '@/components/meta-pixel'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'AbuDigital Store - Premium Digital Products',
    template: '%s | AbuDigital Store'
  },
  description: 'Discover premium digital products including courses, templates, e-books, and more. Instant delivery, lifetime access, and secure payments with Razorpay.',
  keywords: ['digital products', 'online courses', 'templates', 'e-books', 'digital downloads', 'India'],
  authors: [{ name: 'AbuDigital' }],
  creator: 'AbuDigital',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AbuDigital Store',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <MetaPixel />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
