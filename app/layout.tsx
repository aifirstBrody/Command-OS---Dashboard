import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peak Refuel — Command OS',
  description: 'Operations intelligence dashboard',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Barlow+Condensed:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0c0a09] text-[#E9E9E9] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  )
}
