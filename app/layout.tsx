// app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Polling System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans bg-gradient-to-br from-purple-200 via-white to-red-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
