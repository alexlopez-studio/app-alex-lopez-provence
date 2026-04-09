import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import CrmLayout from '@/components/crm/CrmLayout'
import type { CSSProperties } from 'react'

const fg     = '#0F172A'
const muted  = '#64748B'
const border = '#E2E8F0'
const white  = '#ffffff'

const pageWrap: CSSProperties    = { padding: '32px' }
const pageTitle: CSSProperties   = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px' }
const pageSub: CSSProperties     = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '32px' }
const kpiGrid: CSSProperties     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }
const kpiCard: CSSProperties     = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '24px' }
const kpiLbl: CSSProperties      = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, marginBottom: '8px' } as CSSProperties
const kpiVal: CSSProperties      = { fontSize: '32px', fontWeight: 900, color: fg, letterSpacing: '-0.04em', lineHeight: 1 }
const kpiSub: CSSProperties      = { fontSize: '12px', fontWeight: 400, color: muted, marginTop: '4px' }
const sectionTitle: CSSProperties = { fontSize: '16px', fontWeight: 700, color: fg, letterSpacing: '-0.02em', marginBottom: '16px' }
const emptyCard: CSSProperties   = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '32px', fontSize: '13px', fontWeight: 300, color: muted }

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const today = new Date(); today.setHours(0,0,0,0)

  const [{ count: total }, { count: todayCount }, { count: vendeurs }] = await Promise.all([
    serviceClient.from('leads').select('id', { count: 'exact', head: true }),
    serviceClient.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    serviceClient.from('leads').select('id', { count: 'exact', head: true }).eq('type', 'vendre'),
  ])

  const kpis = [
    { label: 'Total prospects',   value: String(total ?? 0),       sub: 'depuis le lancement' },
    { label: "Aujourd'hui",       value: String(todayCount ?? 0),  sub: 'nouveaux leads' },
    { label: 'Vendeurs',          value: String(vendeurs ?? 0),    sub: 'estimations demand\u00e9es' },
    { label: 'Conversion',        value: '0%',                     sub: 'lead \u2192 RDV' },
  ]

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <h1 style={pageTitle}>Tableau de bord</h1>
        <p style={pageSub}>{'Vue d\'ensemble de votre activit\u00e9 commerciale'}</p>

        <div style={kpiGrid}>
          {kpis.map((k) => (
            <div key={k.label} style={kpiCard}>
              <div style={kpiLbl}>{k.label}</div>
              <div style={kpiVal}>{k.value}</div>
              <div style={kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={sectionTitle}>{'Activit\u00e9 r\u00e9cente'}</div>
        <div style={emptyCard}>
          {'Les leads de la semaine et les relances \u00e0 effectuer appara\u00eetront ici.'}
        </div>
      </div>
    </CrmLayout>
  )
}
