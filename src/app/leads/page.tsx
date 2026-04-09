import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import CrmLayout from '@/components/crm/CrmLayout'
import type { CSSProperties } from 'react'

const fg      = '#0F172A'
const muted   = '#64748B'
const border  = '#E2E8F0'
const white   = '#ffffff'
const brand   = '#0066FF'
const surface = '#F8FAFC'
const success = '#10B981'
const warning = '#F59E0B'
const error   = '#EF4444'

const pageWrap: CSSProperties     = { padding: '32px' }
const pageHeader: CSSProperties   = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }
const pageTitle: CSSProperties    = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
const tabRow: CSSProperties       = { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }
const tableCard: CSSProperties    = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, overflow: 'hidden' }
const tableHeader: CSSProperties  = { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '12px 20px', borderBottom: '1px solid ' + border, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted } as CSSProperties
const rowSt: CSSProperties        = { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 20px', borderBottom: '1px solid ' + border, textDecoration: 'none', color: 'inherit', alignItems: 'center', transition: 'background-color 0.1s ease' }
const avatarSt: CSSProperties     = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }
const leadName: CSSProperties     = { fontSize: '14px', fontWeight: 600, color: fg, marginBottom: '2px' }
const leadSub: CSSProperties      = { fontSize: '12px', fontWeight: 400, color: muted }
const emptyWrap: CSSProperties    = { padding: '48px', textAlign: 'center' as const }
const emptyTxt: CSSProperties     = { fontSize: '14px', fontWeight: 300, color: muted, marginBottom: '8px' }

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'

const STATUT_CONFIG: Record<Statut, { label: string; color: string; bg: string }> = {
  nouveau:   { label: 'Nouveau',   color: brand,   bg: '#EFF6FF' },
  contacte:  { label: 'Contact\u00e9',  color: warning, bg: '#FFFBEB' },
  rdv:       { label: 'RDV pris',  color: success, bg: '#ECFDF5' },
  signe:     { label: 'Sign\u00e9',     color: success, bg: '#D1FAE5' },
  perdu:     { label: 'Perdu',     color: error,   bg: '#FEF2F2' },
}

const TYPE_CONFIG: Record<string, string> = {
  vendre: 'Vendeur', acheter: 'Acheteur', audit: 'Audit',
}

function StatutBadge({ statut }: { statut: Statut }) {
  const cfg = STATUT_CONFIG[statut] ?? STATUT_CONFIG.nouveau
  const st: CSSProperties = { display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 600, color: cfg.color, backgroundColor: cfg.bg, borderRadius: '999px', padding: '3px 10px', whiteSpace: 'nowrap' }
  return <span style={st}>{cfg.label}</span>
}

function TypeBadge({ type }: { type: string }) {
  const st: CSSProperties = { display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 500, color: muted, backgroundColor: surface, borderRadius: '999px', padding: '3px 10px', border: '1px solid ' + border, whiteSpace: 'nowrap' }
  return <span style={st}>{TYPE_CONFIG[type] ?? type}</span>
}

function TabBtn({ label, active, count }: { label: string; active: boolean; count?: number }) {
  const st: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? brand : muted, backgroundColor: active ? '#EFF6FF' : 'transparent', border: '1px solid ' + (active ? brand : border), cursor: 'pointer' }
  return (
    <div style={st}>
      {label}
      {count !== undefined && (
        <span style= fontSize: '11px', fontWeight: 700, color: active ? white : muted, backgroundColor: active ? brand : border, borderRadius: '999px', padding: '1px 7px' >{count}</span>
      )}
    </div>
  )
}

export default async function LeadsPage() {
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

  const { data: leads } = await serviceClient
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const total = leads?.length ?? 0
  const nouveaux = leads?.filter((l) => l.statut === 'nouveau').length ?? 0

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <div style={pageHeader}>
          <h1 style={pageTitle}>Prospects</h1>
          <span style= fontSize: '13px', fontWeight: 500, color: muted >{total} lead{total > 1 ? 's' : ''}</span>
        </div>

        <div style={tabRow}>
          <TabBtn label="Tout" active={true} count={total} />
          <TabBtn label="Nouveaux" active={false} count={nouveaux} />
        </div>

        <div style={tableCard}>
          {leads && leads.length > 0 ? (
            <>
              <div style={tableHeader}>
                <span>Prospect</span>
                <span>Type</span>
                <span>Estimation</span>
                <span>Statut</span>
                <span>Re\u00e7u le</span>
              </div>
              {leads.map((lead) => {
                const initial = (lead.prenom?.[0] ?? lead.email?.[0] ?? '?').toUpperCase()
                const results = lead.results as Record<string, number> | null
                const bas  = results?.fourchette_basse
                const haut = results?.fourchette_haute
                const estim = bas && haut
                  ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(bas)
                    + ' \u2014 '
                    + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(haut)
                  : 'Non estim\u00e9'
                const date = new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

                return (
                  <Link key={lead.id} href={'/leads/' + lead.id} style={rowSt}>
                    <div style= display: 'flex', alignItems: 'center', gap: '12px' >
                      <div style={avatarSt}>{initial}</div>
                      <div>
                        <div style={leadName}>
                          {lead.prenom && lead.nom ? lead.prenom + ' ' + lead.nom : 'Anonyme'}
                        </div>
                        <div style={leadSub}>{lead.form_data?.adresse ?? ''}</div>
                      </div>
                    </div>
                    <div><TypeBadge type={lead.type} /></div>
                    <div style= fontSize: '13px', fontWeight: 500, color: fg >{estim}</div>
                    <div><StatutBadge statut={lead.statut as Statut} /></div>
                    <div style= fontSize: '12px', color: muted >{date}</div>
                  </Link>
                )
              })}
            </>
          ) : (
            <div style={emptyWrap}>
              <div style={emptyTxt}>{'Aucun prospect pour l\'instant.'}</div>
              <div style= fontSize: '12px', color: muted >{'Les leads g\u00e9n\u00e9r\u00e9s via le formulaire appara\u00eetront ici.'}</div>
            </div>
          )}
        </div>
      </div>
    </CrmLayout>
  )
}
