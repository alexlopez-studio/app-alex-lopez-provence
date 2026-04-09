import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit immobilier express',
}

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 max-w-xl w-full text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066FF] mb-3">
          Audit express
        </p>
        <h1 className="text-2xl font-black text-[#0F172A] mb-3">
          Audit immobilier
        </h1>
        <p className="text-sm text-[#64748B]">
          Formulaire multi-étapes — en cours de développement
        </p>
      </div>
    </main>
  )
}
