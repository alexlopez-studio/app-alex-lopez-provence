import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ClipboardCheck, ArrowRight, Phone, MapPin, Star } from 'lucide-react'

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
    eyebrow: 'Vendeur / Acheteur',
    label: 'Audit express',
    description: `Évaluez l'état général d'un bien avec notre checklist experte avant achat ou avant mise en vente.`,
    cta: `Lancer l'audit`,
    badge: 'Score détaillé + PDF',
  },
]

const reassurance = [
  { icon: Star, label: '100% gratuit', sub: 'Sans frais cachés' },
  { icon: ClipboardCheck, label: 'Sans engagement', sub: 'Aucun compte requis' },
  { icon: MapPin, label: 'Provence Verte', sub: 'Haut-Var & environs' },
]

export default function HubPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[75rem] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#0F172A] font-black text-base tracking-tight">
              Alex Lopez
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B] border border-[#E2E8F0] rounded-full px-2 py-0.5">
              Mandataire IAD
            </span>
          </div>
          <a
            href="tel:+33613180168"
            className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:text-[#0066FF] transition-colors"
            aria-label="Appeler Alex Lopez"
          >
            <Phone size={15} className="text-[#0066FF]" />
            <span className="hidden sm:inline">06 13 18 01 68</span>
          </a>
        </div>
      </header>

      <main className="flex-1 pt-16">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-[75rem] mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066FF] mb-5">
              Provence Verte &amp; Haut-Var
            </p>
            <h1 className="font-black text-[#0F172A] leading-[1.05] tracking-tight mb-6"
                style={heroTitleStyle}>
              Vos outils immobiliers
              <br />
              <span className="text-[#0066FF]">gratuits &amp; personnalisés</span>
            </h1>
            <p className="text-lg font-light leading-relaxed text-[#64748B] max-w-xl mx-auto mb-10">
              {`Estimation, projet d'achat, audit — des résultats basés sur les données réelles du marché. En quelques minutes.`}
            </p>

            {/* Chips réassurance */}
            <div className="flex flex-wrap justify-center gap-3">
              {reassurance.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label}
                       className="inline-flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-4 py-2">
                    <Icon size={14} className="text-[#0066FF]" />
                    <span className="text-xs font-semibold text-[#0F172A]">{item.label}</span>
                    <span className="text-xs text-[#64748B]">— {item.sub}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Cards outils ───────────────────────────────────── */}
        <section className="pb-24 bg-[#F8FAFC]">
          <div className="max-w-[75rem] mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-3 -mt-6">
              {outils.map((outil) => {
                const Icon = outil.icon
                return (
                  <Link
                    key={outil.href}
                    href={outil.href}
                    className="group flex flex-col bg-white rounded-2xl border border-[#E2E8F0] p-8
                               hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Eyebrow */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B] mb-4">
                      {outil.eyebrow}
                    </p>

                    {/* Icône */}
                    <div className="mb-5 inline-flex items-center justify-center
                                    w-11 h-11 rounded-xl bg-[#EFF6FF]">
                      <Icon size={20} className="text-[#0066FF]" />
                    </div>

                    {/* Titre */}
                    <h2 className="text-xl font-black text-[#0F172A] mb-3 leading-tight">
                      {outil.label}
                    </h2>

                    {/* Description */}
                    <p className="text-sm font-light leading-relaxed text-[#64748B] mb-6 flex-1">
                      {outil.description}
                    </p>

                    {/* Badge */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#10B981] mb-5">
                      ✓ {outil.badge}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-5 border-t border-[#E2E8F0]">
                      <span className="text-sm font-semibold text-[#0066FF]">
                        {outil.cta}
                      </span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EFF6FF]
                                       group-hover:bg-[#0066FF] transition-colors duration-200">
                        <ArrowRight size={14}
                          className="text-[#0066FF] group-hover:text-white transition-colors duration-200" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA contact ────────────────────────────────────── */}
        <section className="py-16 bg-[#EFF6FF]">
          <div className="max-w-[75rem] mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066FF] mb-3">
              Besoin d&apos;un conseil ?
            </p>
            <h2 className="text-2xl font-black text-[#0F172A] mb-4">
              Parlons de votre projet
            </h2>
            <p className="text-base font-light text-[#64748B] mb-8">
              Alex Lopez répond du lundi au samedi — pas de standardiste, pas d&apos;attente.
            </p>
            <a
              href="tel:+33613180168"
              className="inline-flex items-center gap-3 bg-[#0066FF] hover:bg-[#0052CC] text-white
                         font-semibold text-sm px-7 py-3.5 rounded-full transition-colors duration-200"
              aria-label="Appeler Alex Lopez"
            >
              <Phone size={16} />
              06 13 18 01 68
            </a>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] py-6">
        <div className="max-w-[75rem] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} Alex Lopez · Mandataire IAD France
          </p>
          <p className="text-xs text-[#64748B]">
            Provence Verte &amp; Haut-Var ·{' '}
            <a href="tel:+33613180168" className="hover:text-[#0066FF] transition-colors">
              06 13 18 01 68
            </a>
          </p>
        </div>
      </footer>

    </div>
  )
}

const heroTitleStyle = { fontSize: 'clamp(2.2rem, 5vw, 3.75rem)' }
