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

/* ─── Layout ─── */
const pageSt: CSSProperties    = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 72px' }
const innerSt: CSSProperties   = { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center' }

/* ─── Header centred — style Cal.com / app ─── */
const avatarSt: CSSProperties  = { width: '88px', height: '88px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em', flexShrink: 0 }

/* H1 CdC : font-black 900, letter-spacing -0.03em */
const nameSt: CSSProperties    = { fontSize: '26px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px', textAlign: 'center' }

/* Label UI CdC : 600, 12-13px */
const titleSt: CSSProperties   = { fontSize: '13px', fontWeight: 500, color: muted, marginBottom: '20px', textAlign: 'center' }

/* Badge — vert success */
const badgeSt: CSSProperties   = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: success, backgroundColor: '#d1fae5', borderRadius: '999px', padding: '4px 12px', marginBottom: '24px' }
const badgeDot: CSSProperties  = { width: '7px', height: '7px', borderRadius: '999px', backgroundColor: success, flexShrink: 0 }

/* Méta-infos */
const metaRow: CSSProperties   = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '36px', flexWrap: 'wrap' }
const metaItem: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: muted }
const phoneLnk: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: brand, textDecoration: 'none' }

/* Divider */
const divSt: CSSProperties     = { width: '100%', height: '1px', backgroundColor: border, marginBottom: '28px' }

/* Eyebrow CdC : 11px, 600, uppercase, tracking-[0.18em] */
const eyebrowSt: CSSProperties = { width: '100%', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: muted, marginBottom: '14px' } as CSSProperties

/* Cards CdC : rounded-2xl (16px), border, padding 28px, hover shadow */
const cardLnk: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '16px', width: '100%', backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px 24px', textDecoration: 'none', color: 'inherit', marginBottom: '12px', transition: 'box-shadow 0.2s ease, transform 0.2s ease' }
const cardIcon: CSSProperties  = { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const cardBody: CSSProperties  = { flex: 1, minWidth: 0 }

/* H3 CdC : font-bold 700 */
const cardTitle: CSSProperties = { fontSize: '15px', fontWeight: 700, color: fg, marginBottom: '3px', letterSpacing: '-0.01em' }

/* Body CdC : 400, 14px */
const cardSub: CSSProperties   = { fontSize: '13px', fontWeight: 400, color: muted }

/* Label success */
const cardMeta: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: success, marginTop: '5px', textTransform: 'uppercase', letterSpacing: '0.1em' } as CSSProperties

const arrowWrap: CSSProperties = { width: '32px', height: '32px', borderRadius: '999px', backgroundColor: surface, border: '1px solid ' + border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

/* Btn primaire CdC : bg-brand, rounded-full */
const ctaBtn: CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: brand, color: white, fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '14px', fontWeight: 600, padding: '14px 32px', borderRadius: '999px', textDecoration: 'none', marginTop: '4px', marginBottom: '12px', letterSpacing: '-0.01em' }
const ctaSub: CSSProperties    = { fontSize: '12px', fontWeight: 400, color: muted, textAlign: 'center' }

const outils = [
  {
    href: '/vendre',
    icon: Home,
    label: 'Estimation vendeur',
    sub: 'Estimez la valeur de votre bien en 3 min',
    meta: '\u2713 Gratuit · Sans engagement',
  },
  {
    href: '/acheter',
    icon: Search,
    label: 'Projet acheteur',
    sub: 'Définissez et qualifiez votre recherche',
    meta: '\u2713 Gratuit · Résultat immédiat',
  },
  {
    href: '/audit',
    icon: ClipboardCheck,
    label: 'Audit express',
    sub: "\u00c9valuez l'\u00e9tat d'un bien avant achat",
    meta: '\u2713 Gratuit · Score + PDF',
  },
]

export default function HubPage() {
  return (
    <main style={pageSt}>
      <div style={innerSt}>

        {/* Header centré */}
        <div style={avatarSt}>AL</div>
        <h1 style={nameSt}>Alex Lopez</h1>
        <p style={titleSt}>{'Mandataire IAD · Provence Verte & Haut-Var'}</p>

        <div style={badgeSt}>
          <div style={badgeDot} />
          {'Disponible'}
        </div>

        <div style={metaRow}>
          <span style={metaItem}><MapPin size={13} color={muted} />{'Provence Verte'}</span>
          <span style={metaItem}><Clock size={13} color={muted} />{'Lun – Sam'}</span>
          <a href="tel:+33613180168" style={phoneLnk}>
            <Phone size={13} />{'06 13 18 01 68'}
          </a>
        </div>

        <div style={divSt} />

        {/* Eyebrow CdC */}
        <p style={eyebrowSt}>{'Vos outils immobiliers gratuits'}</p>

        {/* Cards CdC */}
        {outils.map((o) => {
          const Icon = o.icon
          return (
            <Link key={o.href} href={o.href} style={cardLnk}>
              <div style={cardIcon}>
                <Icon size={22} color={brand} />
              </div>
              <div style={cardBody}>
                <div style={cardTitle}>{o.label}</div>
                <div style={cardSub}>{o.sub}</div>
                <div style={cardMeta}>{o.meta}</div>
              </div>
              <div style={arrowWrap}>
                <ArrowRight size={15} color={muted} />
              </div>
            </Link>
          )
        })}

        {/* CTA primaire CdC : bg-brand rounded-full */}
        <div style={divSt} />
        <a href="tel:+33613180168" style={ctaBtn}>
          <Phone size={15} />
          {'Appeler directement'}
        </a>
        <p style={ctaSub}>{'Lundi au samedi · Réponse directe, sans standardiste'}</p>

      </div>
    </main>
  )
}
