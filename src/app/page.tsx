import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ClipboardCheck, ArrowRight, Phone } from 'lucide-react'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Outils immobiliers gratuits — Alex Lopez Provence',
}

/* ─────────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────────── */

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
  },

  /* Navbar */
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #E2E8F0',
    height: '64px', display: 'flex', alignItems: 'center',
  },
  navInner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  navBrand: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  navName: {
    fontSize: '15px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em',
  },
  navBadge: {
    fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.16em', color: '#64748B',
    border: '1px solid #E2E8F0', borderRadius: '999px',
    padding: '2px 10px',
  },
  navPhone: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 600, color: '#0F172A',
    textDecoration: 'none',
  },

  /* Container */
  container: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
  },

  /* Hero */
  hero: {
    paddingTop: '120px', paddingBottom: '80px',
    backgroundColor: '#ffffff', textAlign: 'center' as const,
  },
  heroEyebrow: {
    fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: '#0066FF', marginBottom: '20px',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 900, lineHeight: 1.08,
    letterSpacing: '-0.03em', color: '#0F172A',
    marginBottom: '20px',
  },
  heroAccent: {
    color: '#0066FF',
  },
  heroSub: {
    fontSize: '17px', fontWeight: 300, lineHeight: 1.7,
    color: '#64748B', maxWidth: '520px', margin: '0 auto 36px',
  },
  chips: {
    display: 'flex', flexWrap: 'wrap' as const,
    justifyContent: 'center', gap: '10px',
  },
  chip: {
    fontSize: '12px', fontWeight: 500, color: '#0F172A',
    backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
    borderRadius: '999px', padding: '6px 14px',
  },

  /* Cards section */
  cardsSection: {
    backgroundColor: '#F8FAFC',
    paddingTop: '64px', paddingBottom: '80px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: '20px',
    border: '1px solid #E2E8F0', padding: '32px',
    display: 'flex', flexDirection: 'column' as const,
    textDecoration: 'none', color: 'inherit',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  cardEyebrow: {
    fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: '#64748B', marginBottom: '20px',
  },
  cardIcon: {
    width: '48px', height: '48px', borderRadius: '14px',
    backgroundColor: '#EFF6FF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px', fontWeight: 800, color: '#0F172A',
    letterSpacing: '-0.02em', marginBottom: '12px',
  },
  cardDesc: {
    fontSize: '14px', fontWeight: 300, lineHeight: 1.7,
    color: '#64748B', marginBottom: '20px', flexGrow: 1,
  },
  cardBadge: {
    fontSize: '11px', fontWeight: 600, color: '#10B981',
    marginBottom: '24px',
  },
  cardFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: '20px', borderTop: '1px solid #E2E8F0',
  },
  cardCta: {
    fontSize: '13px', fontWeight: 600, color: '#0066FF',
  },
  cardArrow: {
    width: '32px', height: '32px', borderRadius: '999px',
    backgroundColor: '#EFF6FF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  /* CTA section */
  ctaSection: {
    backgroundColor: '#EFF6FF',
    padding: '72px 24px', textAlign: 'center' as const,
  },
  ctaEyebrow: {
    fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.18em', color: '#0066FF', marginBottom: '12px',
  },
  ctaTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 900, color: '#0F172A',
    letterSpacing: '-0.02em', marginBottom: '12px',
  },
  ctaSub: {
    fontSize: '15px', fontWeight: 300, color: '#64748B', marginBottom: '32px',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    backgroundColor: '#0066FF', color: '#ffffff',
    fontSize: '14px', fontWeight: 600,
    padding: '14px 28px', borderRadius: '999px',
    textDecoration: 'none', transition: 'background-color 0.2s ease',
  },

  /* Footer */
  footer: {
    borderTop: '1px solid #E2E8F0', padding: '24px',
  },
  footerInner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', flexWrap: 'wrap' as const,
    alignItems: 'center', justifyContent: 'space-between', gap: '8px',
  },
  footerText: {
    fontSize: '12px', color: '#64748B',
  },
  footerLink: {
    color: '#64748B', textDecoration: 'none',
  },
}

/* ─────────────────────────────────────────────────────────────
   Données
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

/* ─────────────────────────────────────────────────────────────
   Composant
───────────────────────────────────────────────────────────── */

export default function HubPage() {
  return (
    <div style={s.page}>

      {/* Navbar */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navBrand}>
            <span style={s.navName}>Alex Lopez</span>
            <span style={s.navBadge}>Mandataire IAD</span>
          </div>
          <a href="tel:+33613180168" style={s.navPhone} aria-label="Appeler Alex Lopez">
            <Phone size={14} color="#0066FF" />
            06 13 18 01 68
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.container}>
          <p style={s.heroEyebrow}>Provence Verte &amp; Haut-Var</p>
          <h1 style={s.heroTitle}>
            Vos outils immobiliers
            <br />
            <span style={s.heroAccent}>gratuits &amp; personnalisés</span>
          </h1>
          <p style={s.heroSub}>
            {`Estimation, projet d'achat, audit — des résultats basés sur les données réelles du marché, en quelques minutes.`}
          </p>
          <div style={s.chips}>
            {['✓ 100% gratuit', '✓ Sans engagement', '✓ Sans compte requis', '✓ Provence Verte & Haut-Var'].map((chip) => (
              <span key={chip} style={s.chip}>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={s.cardsSection}>
        <div style={s.container}>
          <div style={s.cardsGrid}>
            {outils.map((outil) => {
              const Icon = outil.icon
              return (
                <Link key={outil.href} href={outil.href} style={s.card}>
                  <p style={s.cardEyebrow}>{outil.eyebrow}</p>
                  <div style={s.cardIcon}>
                    <Icon size={22} color="#0066FF" />
                  </div>
                  <h2 style={s.cardTitle}>{outil.label}</h2>
                  <p style={s.cardDesc}>{outil.description}</p>
                  <p style={s.cardBadge}>✓ {outil.badge}</p>
                  <div style={s.cardFooter}>
                    <span style={s.cardCta}>{outil.cta}</span>
                    <div style={s.cardArrow}>
                      <ArrowRight size={14} color="#0066FF" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <p style={s.ctaEyebrow}>Besoin d&apos;un conseil ?</p>
        <h2 style={s.ctaTitle}>Parlons de votre projet</h2>
        <p style={s.ctaSub}>
          Alex Lopez répond du lundi au samedi — directement, sans standardiste.
        </p>
        <a href="tel:+33613180168" style={s.ctaBtn} aria-label="Appeler Alex Lopez">
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
            <a href="tel:+33613180168" style={s.footerLink}>
              06 13 18 01 68
            </a>
          </p>
        </div>
      </footer>

    </div>
  )
}
