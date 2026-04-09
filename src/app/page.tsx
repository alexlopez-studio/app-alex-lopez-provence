import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, ClipboardCheck, ArrowRight, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Estimation immobilière gratuite — Alex Lopez Provence',
}

const outils = [
  {
    href: '/vendre',
    icon: Home,
    label: 'Estimer mon bien',
    description:
      'Obtenez une estimation gratuite de votre bien en 3 minutes, basée sur les ventes réelles du marché.',
    cta: 'Estimer maintenant',
    color: 'brand',
  },
  {
    href: '/acheter',
    icon: Search,
    label: 'Définir mon projet achat',
    description:
      'Décrivez votre projet et recevez une analyse personnalisée des biens disponibles dans votre zone.',
    cta: 'Démarrer mon projet',
    color: 'brand',
  },
  {
    href: '/audit',
    icon: ClipboardCheck,
    label: 'Audit immobilier express',
    description:
      'Évaluez l'état général d'un bien avant achat ou avant mise en vente avec notre checklist experte.',
    cta: 'Lancer l'audit',
    color: 'brand',
  },
]

export default function HubPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] py-4">
        <div className="container-app flex items-center justify-between">
          <div>
            <span className="text-[#0F172A] font-bold text-lg tracking-tight">
              Alex Lopez
            </span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">
              Mandataire IAD
            </span>
          </div>
          <a
            href="tel:+33613180168"
            className="flex items-center gap-2 text-sm font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors"
            aria-label="Appeler Alex Lopez"
          >
            <Phone size={16} />
            06 13 18 01 68
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container-app text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B] mb-4">
            Provence Verte &amp; Haut-Var
          </p>
          <h1 className="font-black leading-[1.1] tracking-tight text-[#0F172A] mb-6"
              style= fontSize: 'clamp(2rem, 5vw, 3.5rem)' >
            Vos outils immobiliers
            <br />
            <span className="text-[#0066FF]">gratuits et personnalisés</span>
          </h1>
          <p className="text-lg font-light leading-relaxed text-[#64748B] max-w-2xl mx-auto">
            Estimation de vente, projet d'achat ou audit de bien — obtenez
            des résultats personnalisés en quelques minutes, sans engagement.
          </p>
        </div>
      </section>

      {/* Outils */}
      <section className="pb-24">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-3">
            {outils.map((outil) => {
              const Icon = outil.icon
              return (
                <Link
                  key={outil.href}
                  href={outil.href}
                  className="group block rounded-2xl border border-[#E2E8F0] bg-white p-8
                             hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="mb-5 inline-flex items-center justify-center
                                  w-12 h-12 rounded-xl bg-[#EFF6FF]">
                    <Icon size={22} className="text-[#0066FF]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-3">
                    {outil.label}
                  </h2>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                    {outil.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold
                                   text-[#0066FF] group-hover:gap-3 transition-all">
                    {outil.cta}
                    <ArrowRight size={16} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-8 text-center">
        <p className="text-xs text-[#64748B]">
          © {new Date().getFullYear()} Alex Lopez · Mandataire IAD France ·{' '}
          <a href="tel:+33613180168" className="hover:text-[#0066FF] transition-colors">
            06 13 18 01 68
          </a>
        </p>
      </footer>
    </main>
  )
}
