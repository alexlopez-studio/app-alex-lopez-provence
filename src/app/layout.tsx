import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { CSSProperties } from 'react'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Alex Lopez · Mandataire IAD',
    default: 'Estimation immobilière gratuite — Alex Lopez Provence',
  },
  description:
    'Estimez votre bien, simulez votre recherche ou obtenez un audit immobilier en quelques minutes. Service gratuit — Provence Verte & Haut-Var.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  margin: 0,
  padding: 0,
  backgroundColor: '#ffffff',
  color: '#0F172A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body style={bodyStyle}>
        {children}
      </body>
    </html>
  )
}
