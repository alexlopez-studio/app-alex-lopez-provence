import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'

export const metadata: Metadata = { title: 'Mon projet achat' }

const t = { brand: '#0066FF', fg: '#0F172A', muted: '#64748B', border: '#E2E8F0', surface: '#F8FAFC', white: '#ffffff' }

const navStyle: CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: t.white, borderBottom: `1px solid ${t.border}` }
const navInnerStyle: CSSProperties = { maxWidth: '75rem', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const mainStyle: CSSProperties = { maxWidth: '600px', margin: '0 auto', padding: '120px 24px 60px', textAlign: 'center', fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const cardStyle: CSSProperties = { backgroundColor: t.white, borderRadius: '20px', border: `1px solid ${t.border}`, padding: '48px 36px' }

export default function AcheterPage() {
  return (
    <div style= minHeight: '100vh', backgroundColor: t.surface >
      <header style={navStyle}>
        <div style={navInnerStyle}>
          <Link href="/" style= display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: t.muted, textDecoration: 'none' >
            <ChevronLeft size={16} /> Retour aux outils
          </Link>
          <a href="tel:+33613180168" style= display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: t.fg, textDecoration: 'none' >
            <Phone size={14} color={t.brand} /> 06 13 18 01 68
          </a>
        </div>
      </header>
      <main style={mainStyle}>
        <div style={cardStyle}>
          <p style= fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: t.brand, marginBottom: '12px' >Projet acheteur</p>
          <h1 style= fontSize: '24px', fontWeight: 900, color: t.fg, marginBottom: '12px', letterSpacing: '-0.02em' >Définir mon projet achat</h1>
          <p style= fontSize: '14px', fontWeight: 300, color: t.muted >Formulaire en cours de développement — disponible prochainement.</p>
        </div>
      </main>
    </div>
  )
}
