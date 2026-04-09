import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ClipboardCheck, ArrowRight, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Outils immobiliers gratuits — Alex Lopez Provence',
}

/* ─────────────────────────────────────────────────────────────
   Design tokens — CdC site alex-lopez-provence
   #0066FF brand / #0F172A foreground / #64748B muted
   #E2E8F0 border / #F8FAFC surface / #EFF6FF brand-light
   #10B981 success — Inter 300→900 — rounded-2xl — py-24
───────────────────────────────────────────────────────────── */

const token = {
  brand:       '#0066FF',
  brandHover:  '#0052CC',
  brandLight:  '#EFF6FF',
  fg:          '#0F172A',
  muted:       '#64748B',
  border:      '#E2E8F0',
  surface:     '#F8FAFC',
  success:     '#10B981',
  white:       '#ffffff',
}

const s: Record<string, CSSProperties> = {

  /* Page */
  page: {
    minHeight: '100vh',
    backgroundColor: token.white,
    fontFamily: '"Inter", system-ui, sans-serif',
    color: token.fg,
  },

  /* ── Navbar ── fixed, z-50, bg-white, border-b */
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: token.white,
    borderBottom: `1px solid ${token.border}`,
  },
  navInner: {
    maxWidth: '75rem', margin: '0 auto', padding: '20px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  navLeft: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  navName: {
    fontSize: '15px', fontWeight: 800, color: token.fg,
    letterSpacing: '-0.02em',
  },
  navTag: {
    fontSize: '10px', fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: token.muted,
    border: `1px solid ${token.border}`,
    borderRadius: '999px', padding: '3px 10px',
  },
  navPhone: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 600, color: token.fg,
    textDecoration: 'none',
  },

  /* ── Container — max-w-[75rem] mx-auto px-6 ── */
  wrap: {
    maxWidth: '75rem', margin: '0 auto', padding: '0 24px',
  },

  /* ── Hero — py-24 ── */
  hero: {
    paddingTop: '136px',   /* 64px nav + 72px section */
    paddingBottom: '96px',
    backgroundColor: token.white,
    textAlign: 'center' as const,
  },
  eyebrow: {
    /* CdC : text-xs font-semibold uppercase tracking-[0.18em] */
    fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: token.muted,
    marginBottom: '16px',
  },
  h1: {
    /* CdC : font-black leading-[1.1] tracking-tight clamp(36px, 6vw, 64px) */
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: 900, lineHeight: 1.1,
    letterSpacing: '-0.03em', color: token.fg,
    marginBottom: '24px',
  },
  h1Accent: {
    color: token.brand,
  },
  heroSub: {
    /* CdC : text-lg font-light leading-relaxed */
    fontSize: '18px', fontWeight: 300, lineHeight: 1.7,
    color: token.muted, maxWidth: '540px',
    margin: '0 auto 40px',
  },

  /* Chips réassurance */
  chips: {
    display: 'flex', flexWrap: 'wrap' as const,
    justifyContent: 'center', gap: '10px',
  },
  chip: {
    fontSize: '12px', fontWeight: 500, color: token.fg,
    backgroundColor: token.surface,
    border: `1px solid ${token.border}`,
    borderRadius: '999px', padding: '6px 14px',
  },

  /* ── Cards — py-24 bg-surface ── */
  cardsSection: {
    padding: '96px 0',
    backgroundColor: token.surface,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(288px, 1fr))',
    gap: '24px',
  },
  /* CdC cards : rounded-2xl p-[28-32px] border shadow hover:-translate-y-0.5 shadow-md */
  card: {
    backgroundColor: token.white,
    borderRadius: '16px',
    border: `1px solid ${token.border}`,
    padding: '32px',
    display: 'flex', flexDirection: 'column' as const,
    textDecoration: 'none', color: 'inherit',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    cursor: 'pointer',
  },
  cardEyebrow: {
    fontSize: '10px', fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: token.muted,
    marginBottom: '20px',
  },
  cardIcon: {
    width: '48px', height: '48px',
    borderRadius: '12px',
    backgroundColor: token.brandLight,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '20px',
  },
  /* CdC h3 : text-xl font-black */
  cardTitle: {
    fontSize: '20px', fontWeight: 900,
    color: token.fg, letterSpacing: '-0.02em',
    marginBottom: '12px',
  },
  /* CdC body : text-sm / font-300 */
  cardDesc: {
    fontSize: '14px', fontWeight: 300, lineHeight: 1.7,
    color: token.muted, flexGrow: 1, marginBottom: '16px',
  },
  cardBadge: {
    fontSize: '11px', fontWeight: 600,
    color: token.success, marginBottom: '24px',
  },
  cardFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: '20px', borderTop: `1px solid ${token.border}`,
  },
  /* CdC label UI : text-xs font-semibold */
  cardCta: {
    fontSize: '12px', fontWeight: 600, color: token.brand,
  },
  cardArrow: {
    width: '32px', height: '32px',
    borderRadius: '999px', backgroundColor: token.brandLight,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  /* ── CTA final — bg-brand-light ── */
  cta: {
    backgroundColor: token.brandLight,
    padding: '96px 24px', textAlign: 'center' as const,
  },
  ctaEyebrow: {
    fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: token.brand,
    marginBottom: '16px',
  },
  /* CdC h2 : font-black clamp(28px,4vw,48px) */
  ctaH2: {
    fontSize: 'clamp(28px, 4vw, 48px)',
    fontWeight: 900, lineHeight: 1.15,
    letterSpacing: '-0.03em', color: token.fg,
    marginBottom: '16px',
  },
  ctaSub: {
    fontSize: '16px', fontWeight: 300, color: token.muted,
    marginBottom: '36px',
  },
  /* CdC btn primary : bg-brand text-white rounded-full */
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    backgroundColor: token.brand, color: token.white,
    fontSize: '14px', fontWeight: 600,
    padding: '14px 28px', borderRadius: '999px',
    textDecoration: 'none',
  },

  /* ── Footer ── */
  footer: {
    borderTop: `1px solid ${token.border}`, padding: '24px',
  },
  footerInner: {
    maxWidth: '75rem', margin: '0 auto',
    display: 'flex', flexWrap: 'wrap' as const,
    alignItems: 'center', justifyContent: 'space-between', gap: '8px',
  },
  footerText: {
    fontSize: '12px', color: token.muted,
  },
  footerLink: {
    color: token.muted, textDecoration: 'none',
  },
}

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */

const outils = [
  {
    href: '/vendre',
    icon: Home,
    eyebrow: 'Propriétaire',
    label: 'Estimer mon bien',
    description: `Obtenez une fourchette de prix basée sur les ventes réelles DVF dans votre secteur. Résultat en 3 minutes.`,
    cta: 'Estimer mon bien',
    badge: 'Gratuit & sans engagement',
  },
  {
    href: '/acheter',
    icon: Search,
    eyebrow: 'Acheteur',
    label: 'Définir mon projet',
    description: `Décrivez votre recherche et recevez une analyse personnalisée de votre projet achat en Provence Verte.`,
    cta: 'Démarrer mon projet',
    badge: 'Résultat immédiat',
  },
  {
    href: '/audit',
    icon: ClipboardCheck,
    eyebrow: 'Vendeur · Acheteur',
    label: 'Audit express',
    description: `Évaluez l'état général d'un bien avec notre checklist experte avant achat ou avant mise en vente.`,
    cta: `Lancer l'audit`,
    badge: 'Score détaillé + PDF',
  },
]

const chips = [
  '✓ 100% gratuit',
  '✓ Sans engagement',
  '✓ Sans compte requis',
  '✓ Résultat immédiat',
]

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */

export default function HubPage() {
  return (
    <div style={s.page}>

      {/* Navbar */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navLeft}>
            <span style={s.navName}>Alex Lopez</span>
            <span style={s.navTag}>Mandataire IAD</span>
          </div>
          <a href="tel:+33613180168" style={s.navPhone}>
            <Phone size={14} color={token.brand} />
            <span>06 13 18 01 68</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.wrap}>
          <p style={s.eyebrow}>Provence Verte &amp; Haut-Var</p>
          <h1 style={s.h1}>
            Vos outils immobiliers<br />
            <span style={s.h1Accent}>gratuits &amp; personnalisés</span>
          </h1>
          <p style={s.heroSub}>
            {`Estimation, projet d'achat, audit — des résultats basés sur les données réelles du marché, en quelques minutes.`}
          </p>
          <div style={s.chips}>
            {chips.map((c) => <span key={c} style={s.chip}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={s.cardsSection}>
        <div style={s.wrap}>
          <div style={s.grid}>
            {outils.map((o) => {
              const Icon = o.icon
              return (
                <Link key={o.href} href={o.href} style={s.card}>
                  <p style={s.cardEyebrow}>{o.eyebrow}</p>
                  <div style={s.cardIcon}>
                    <Icon size={22} color={token.brand} />
                  </div>
                  <h2 style={s.cardTitle}>{o.label}</h2>
                  <p style={s.cardDesc}>{o.description}</p>
                  <p style={s.cardBadge}>✓ {o.badge}</p>
                  <div style={s.cardFooter}>
                    <span style={s.cardCta}>{o.cta}</span>
                    <div style={s.cardArrow}>
                      <ArrowRight size={14} color={token.brand} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={s.cta}>
        <p style={s.ctaEyebrow}>Besoin d&apos;un conseil ?</p>
        <h2 style={s.ctaH2}>Parlons de votre projet</h2>
        <p style={s.ctaSub}>
          Alex Lopez répond du lundi au samedi — directement, sans standardiste.
        </p>
        <a href="tel:+33613180168" style={s.btnPrimary}>
          <Phone size={15} />
          06 13 18 01 68
        </a>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <p style={s.footerText}>
            © {new Date().getFullYear()} Alex Lopez · Mandataire IAD France
          </p>
          <p style={s.footerText}>
            Provence Verte &amp; Haut-Var ·{' '}
            <a href="tel:+33613180168" style={s.footerLink}>06 13 18 01 68</a>
          </p>
        </div>
      </footer>

    </div>
  )
}
