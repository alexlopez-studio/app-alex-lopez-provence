import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ClipboardCheck, ArrowRight, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Outils immobiliers gratuits — Alex Lopez Provence',
}

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

export default function HubPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <header style={navStyle}>
        <div style={containerStyle}>
          <div style= display: 'flex', alignItems: 'center', gap: '12px' >
            <span style= fontWeight: 900, fontSize: '15px', color: '#0F172A', letterSpacing: '-0.02em' >
              Alex Lopez
            </span>
            <span style=
              fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.16em', color: '#64748B',
              border: '1px solid #E2E8F0', borderRadius: '999px', padding: '2px 10px'
            >
              Mandataire IAD
            </span>
          </div>
          <a href="tel:+33613180168" style=
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 600, color: '#0F172A', textDecoration: 'none'
          >
            <Phone size={14} color="#0066FF" />
            06 13 18 01 68
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style= paddingTop: '96px', paddingBottom: '80px', backgroundColor: '#ffffff' >
        <div style= ...containerStyle, textAlign: 'center' >
          <p style=
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: '#0066FF', marginBottom: '20px'
          >
            Provence Verte &amp; Haut-Var
          </p>
          <h1 style=
            fontWeight: 900, color: '#0F172A', lineHeight: 1.08,
            letterSpacing: '-0.03em', marginBottom: '24px',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)'
          >
            Vos outils immobiliers
            <br />
            <span style= color: '#0066FF' >gratuits &amp; personnalisés</span>
          </h1>
          <p style=
            fontSize: '18px', fontWeight: 300, lineHeight: 1.7,
            color: '#64748B', maxWidth: '520px', margin: '0 auto 40px'
          >
            {`Estimation, projet d'achat, audit — des résultats basés sur les données réelles du marché, en quelques minutes.`}
          </p>
          {/* Chips */}
          <div style= display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' >
            {['✓ 100% gratuit', '✓ Sans engagement', '✓ Sans création de compte', '✓ Provence Verte & Haut-Var'].map((chip) => (
              <span key={chip} style=
                fontSize: '12px', fontWeight: 500, color: '#0F172A',
                backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '999px', padding: '6px 14px'
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section style= backgroundColor: '#F8FAFC', paddingTop: '64px', paddingBottom: '96px' >
        <div style={containerStyle}>
          <div style= display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' >
            {outils.map((outil) => {
              const Icon = outil.icon
              return (
                <Link key={outil.href} href={outil.href} style= textDecoration: 'none' >
                  <div style={cardStyle} className="card-hover">
                    {/* Eyebrow */}
                    <p style=
                      fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.18em', color: '#64748B', marginBottom: '20px'
                    >
                      {outil.eyebrow}
                    </p>
                    {/* Icône */}
                    <div style=
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: '#EFF6FF', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                    >
                      <Icon size={22} color="#0066FF" />
                    </div>
                    {/* Titre */}
                    <h2 style=
                      fontSize: '20px', fontWeight: 900, color: '#0F172A',
                      letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.2
                    >
                      {outil.label}
                    </h2>
                    {/* Description */}
                    <p style=
                      fontSize: '14px', fontWeight: 300, lineHeight: 1.75,
                      color: '#64748B', marginBottom: '24px', flex: 1
                    >
                      {outil.description}
                    </p>
                    {/* Badge */}
                    <p style=
                      fontSize: '11px', fontWeight: 600, color: '#10B981',
                      marginBottom: '20px'
                    >
                      ✓ {outil.badge}
                    </p>
                    {/* CTA */}
                    <div style=
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: '20px', borderTop: '1px solid #E2E8F0'
                    >
                      <span style= fontSize: '13px', fontWeight: 600, color: '#0066FF' >
                        {outil.cta}
                      </span>
                      <div style=
                        width: '32px', height: '32px', borderRadius: '999px',
                        backgroundColor: '#EFF6FF', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      >
                        <ArrowRight size={14} color="#0066FF" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style= backgroundColor: '#EFF6FF', padding: '72px 0' >
        <div style= ...containerStyle, textAlign: 'center' >
          <p style=
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: '#0066FF', marginBottom: '12px'
          >
            Besoin d&apos;un conseil ?
          </p>
          <h2 style=
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900,
            color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '12px'
          >
            Parlons de votre projet
          </h2>
          <p style=
            fontSize: '16px', fontWeight: 300, color: '#64748B',
            marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px'
          >
            Alex Lopez répond du lundi au samedi — directement, sans standardiste.
          </p>
          <a href="tel:+33613180168" style=
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#0066FF', color: '#ffffff',
            fontSize: '14px', fontWeight: 600, padding: '14px 28px',
            borderRadius: '999px', textDecoration: 'none'
          >
            <Phone size={15} />
            06 13 18 01 68
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style=
        borderTop: '1px solid #E2E8F0', padding: '24px 0'
      >
        <div style=
          ...containerStyle,
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '8px'
        >
          <p style= fontSize: '12px', color: '#64748B' >
            © {new Date().getFullYear()} Alex Lopez · Mandataire IAD France
          </p>
          <p style= fontSize: '12px', color: '#64748B' >
            Provence Verte &amp; Haut-Var ·{' '}
            <a href="tel:+33613180168" style= color: '#64748B', textDecoration: 'none' >
              06 13 18 01 68
            </a>
          </p>
        </div>
      </footer>

    </div>
  )
}

/* ── Styles objets (évite les conflits Tailwind v4) ── */
const navStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
  backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0',
  height: '64px', display: 'flex', alignItems: 'center'
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px', margin: '0 auto', padding: '0 24px', width: '100%'
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', borderRadius: '16px',
  border: '1px solid #E2E8F0', padding: '32px',
  display: 'flex', flexDirection: 'column',
  cursor: 'pointer', transition: 'all 0.2s ease'
}
