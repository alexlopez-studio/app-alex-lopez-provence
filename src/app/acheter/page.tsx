import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'

export const metadata: Metadata = { title: 'Mon projet achat' }

const brand = '#0066FF'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'

const pageStyle: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const navStyle: CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: `1px solid ${border}` }
const navInner: CSSProperties = { maxWidth: '75rem', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const backLink: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: muted, textDecoration: 'none' }
const phoneLink: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: fg, textDecoration: 'none' }
const mainStyle: CSSProperties = { maxWidth: '600px', margin: '0 auto', padding: '120px 24px 60px', textAlign: 'center' }
const cardStyle: CSSProperties = { backgroundColor: white, borderRadius: '20px', border: `1px solid ${border}`, padding: '48px 36px' }
const eyebrow: CSSProperties = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: brand, marginBottom: '12px' }
const h1Style: CSSProperties = { fontSize: '24px', fontWeight: 900, color: fg, marginBottom: '12px', letterSpacing: '-0.02em' }
const subStyle: CSSProperties = { fontSize: '14px', fontWeight: 300, color: muted }

export default function AcheterPage() {
  return (
    <div style={pageStyle}>
      <header style={navStyle}>
        <div style={navInner}>
          <Link href="/" style={backLink}>
            <ChevronLeft size={16} /> Retour aux outils
          </Link>
          <a href="tel:+33613180168" style={phoneLink}>
            <Phone size={14} color={brand} /> 06 13 18 01 68
          </a>
        </div>
      </header>
      <main style={mainStyle}>
        <div style={cardStyle}>
          <p style={eyebrow}>Projet acheteur</p>
          <h1 style={h1Style}>Définir mon projet achat</h1>
          <p style={subStyle}>Formulaire en cours de développement — disponible prochainement.</p>
        </div>
      </main>
    </div>
  )
}
