import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Home, Search, ClipboardCheck, ArrowRight, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Alex Lopez — Outils immobiliers',
  description: 'Estimation gratuite, projet achat et audit immobilier en Provence Verte.',
}

/* ─── Tokens CdC site-alex-lopez-provence ─── */
const brand      = '#0066FF'
const brandLight = '#EFF6FF'
const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const surface    = '#F8FAFC'
const white      = '#ffffff'
const success    = '#10B981'

/* ─── Styles ─── */
const pageSt: CSSProperties     = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 60px' }
const innerSt: CSSProperties    = { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
const avatarSt: CSSProperties   = { width: '80px', height: '80px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }
const nameSt: CSSProperties     = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '4px', textAlign: 'center' }
const titleSt: CSSProperties    = { fontSize: '13px', fontWeight: 500, color: muted, marginBottom: '16px', textAlign: 'center' }
const metaRow: CSSProperties    = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }
const metaItem: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: muted }
const phoneLnk: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: brand, textDecoration: 'none' }
const divSt: CSSProperties      = { width: '100%', height: '1px', backgroundColor: border, marginBottom: '24px' }
const sectionLbl: CSSProperties = { width: '100%', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: muted, marginBottom: '12px' } as CSSProperties
const cardLnk: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '14px', width: '100%', backgroundColor: white, borderRadius: '14px', border: '1px solid ' + border, padding: '18px 20px', textDecoration: 'none', color: 'inherit', marginBottom: '10px' }
const cardIcon: CSSProperties   = { width: '40px', height: '40px', borderRadius: '10px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const cardBody: CSSProperties   = { flex: 1 }
const cardTitle: CSSProperties  = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '2px' }
const cardSub: CSSProperties    = { fontSize: '12px', fontWeight: 400, color: muted }
const cardMeta: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: success, marginTop: '4px' }
const cardArrow: CSSProperties  = { flexShrink: 0, color: muted }
const badgeSt: CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: success, backgroundColor: '#d1fae5', borderRadius: '999px', padding: '4px 12px', marginBottom: '20px' }
const badgeDot: CSSProperties   = { width: '7px', height: '7px', borderRadius: '999px', backgroundColor: success, flexShrink: 0 }
const ctaBtn: CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: brand, color: white, fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '14px', fontWeight: 600, padding: '13px 28px', borderRadius: '999px', textDecoration: 'none', marginTop: '4px', marginBottom: '10px' }
const ctaSub: CSSProperties     = { fontSize: '11px', fontWeight: 400, color: muted, textAlign: 'center' }

const outils = [
  {
    href: '/vendre',
    icon: Home,
    label: 'Estimation vendeur',
    sub: 'Estimez la valeur de votre bien',
    meta: 'Gratuit · 3 min',
  },
  {
    href: '/acheter',
    icon: Search,
    label: 'Projet acheteur',
    sub: 'Définissez et qualifiez votre recherche',
    meta: 'Gratuit · 2 min',
  },
  {
    href: '/audit',
    icon: ClipboardCheck,
    label: 'Audit express',
    sub: "Évaluez l'état d'un bien avant achat",
    meta: 'Gratuit · 3 min',
  },
]

export default function HubPage() {
  return (
    <main style={pageSt}>
      <div style={innerSt}>

        {/* Avatar + header centré */}
        <div style={avatarSt}>AL</div>
        <h1 style={nameSt}>Alex Lopez</h1>
        <p style={titleSt}>{'Mandataire IAD · Provence Verte & Haut-Var'}</p>

        {/* Badge disponibilité */}
        <div style={badgeSt}>
          <div style={badgeDot} />
          {'Disponible'}
        </div>

        {/* Méta */}
        <div style={metaRow}>
          <span style={metaItem}><MapPin size={12} />{'Provence Verte'}</span>
          <span style={metaItem}><Clock size={12} />{'Lun – Sam'}</span>
          <a href="tel:+33613180168" style={phoneLnk}><Phone size={12} />{'06 13 18 01 68'}</a>
        </div>

        <div style={divSt} />

        {/* Outils */}
        <p style={sectionLbl}>{'Vos outils immobiliers gratuits'}</p>

        {outils.map((o) => {
          const Icon = o.icon
          return (
            <Link key={o.href} href={o.href} style={cardLnk}>
              <div style={cardIcon}>
                <Icon size={20} color={brand} />
              </div>
              <div style={cardBody}>
                <div style={cardTitle}>{o.label}</div>
                <div style={cardSub}>{o.sub}</div>
                <div style={cardMeta}>
                  <span>{'✓'}</span>
                  {o.meta}
                </div>
              </div>
              <ArrowRight size={16} style={cardArrow} />
            </Link>
          )
        })}

        {/* CTA téléphone */}
        <div style={divSt} />
        <a href="tel:+33613180168" style={ctaBtn}>
          <Phone size={15} />
          {'Appeler directement'}
        </a>
        <p style={ctaSub}>{'Disponible du lundi au samedi · Réponse garantie'}</p>

      </div>
    </main>
  )
}
