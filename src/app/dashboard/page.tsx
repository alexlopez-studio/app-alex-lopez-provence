import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CrmLayout from '@/components/crm/CrmLayout'
import type { CSSProperties } from 'react'

const fg     = '#0F172A'
const muted  = '#64748B'
const border = '#E2E8F0'
const white  = '#ffffff'
const brand  = '#0066FF'
const brandLight = '#EFF6FF'
const success = '#10B981'
const warning = '#F59E0B'

const pageWrap: CSSProperties   = { padding: '32px 32px' }
const pageTitle: CSSProperties  = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px' }
const pageSub: CSSProperties    = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '32px' }
const kpiGrid: CSSProperties    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }
const kpiCard: CSSProperties    = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '24px' }
const kpiLabel: CSSProperties   = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, marginBottom: '8px' } as CSSProperties
const kpiValue: CSSProperties   = { fontSize: '32px', fontWeight: 900, color: fg, letterSpacing: '-0.04em', lineHeight: 1 }
const kpiSub: CSSProperties     = { fontSize: '12px', fontWeight: 400, color: muted, marginTop: '4px' }
const sectionTitle: CSSProperties = { fontSize: '16px', fontWeight: 700, color: fg, letterSpacing: '-0.02em', marginBottom: '16px' }

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  /* Stats depuis Supabase */
  const serviceSupabase = require('@supabase/supabase-js').createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const today = new Date(); today.setHours(0,0,0,0)
  const thisWeek = new Date(); thisWeek.setDate(thisWeek.getDate() - 7)

  const [{ count: total }, { count: today_count }, { count: vendeurs }] = await Promise.all([
    serviceSupabase.from('leads').select('id', { count: 'exact', head: true }),
    serviceSupabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    serviceSupabase.from('leads').select('id', { count: 'exact', head: true }).eq('type', 'vendre'),
  ])

  const kpis = [
    { label: 'Total prospects', value: total ?? 0, sub: 'depuis le lancement' },
    { label: "Aujourd'hui", value: today_count ?? 0, sub: 'nouveaux leads' },
    { label: 'Vendeurs', value: vendeurs ?? 0, sub: 'estimations demandes' },
    { label: 'Conversion', value: '0%', sub: 'lead → RDV' },
  ]

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <h1 style={pageTitle}>Tableau de bord</h1>
        <p style={pageSub}>{'Vue d\'ensemble de votre activité commerciale'}</p>

        <div style={kpiGrid}>
          {kpis.map((k) => (
            <div key={k.label} style={kpiCard}>
              <div style={kpiLabel}>{k.label}</div>
              <div style={kpiValue}>{k.value}</div>
              <div style={kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={sectionTitle}>Activité récente</div>
        <div style=...kpiCard, color: muted, fontSize: '13px', fontWeight: 300>
          {'Les leads de la semaine et les relances à effectuer apparaîtront ici.'}
        </div>
      </div>
    </CrmLayout>
  )
}
