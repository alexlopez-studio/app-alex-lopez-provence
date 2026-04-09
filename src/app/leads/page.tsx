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
const topRow: CSSProperties       = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }
const titleWrap: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px' }
const pageTitle: CSSProperties    = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
const totalBadge: CSSProperties   = { fontSize: '12px', fontWeight: 600, color: muted, backgroundColor: surface, border: '1px solid ' + border, borderRadius: '999px', padding: '3px 10px' }
const searchInput: CSSProperties  = { fontSize: '13px', color: fg, border: '1px solid ' + border, borderRadius: '10px', padding: '8px 14px', outline: 'none', backgroundColor: white, width: '240px' }
const filterRow1: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' } as CSSProperties
const filterRow2: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', paddingLeft: '4px' } as CSSProperties
const row2Label: CSSProperties    = { fontSize: '11px', fontWeight: 500, color: muted, marginRight: '2px' }
const tableCard: CSSProperties    = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, overflow: 'hidden' }
const tableHeader: CSSProperties  = { display: 'grid', gridTemplateColumns: '24px 2.8fr 1fr 1.2fr 90px 60px 36px', gap: '12px', padding: '10px 20px', borderBottom: '1px solid ' + border, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted, alignItems: 'center' } as CSSProperties
const rowSt: CSSProperties        = { display: 'grid', gridTemplateColumns: '24px 2.8fr 1fr 1.2fr 90px 60px 36px', gap: '12px', padding: '14px 20px', borderBottom: '1px solid ' + border, textDecoration: 'none', color: 'inherit', alignItems: 'center' }
const checkboxSt: CSSProperties   = { width: '15px', height: '15px', borderRadius: '4px', border: '1.5px solid ' + border, backgroundColor: white, flexShrink: 0 }
const avatarSt: CSSProperties     = { width: '34px', height: '34px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }
const leadRowInner: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px' }
const leadName: CSSProperties     = { fontSize: '14px', fontWeight: 600, color: fg, display: 'flex', alignItems: 'center', gap: '6px' }
const leadInfo: CSSProperties     = { fontSize: '11px', fontWeight: 400, color: muted, marginTop: '2px' }
const estimWrap: CSSProperties    = { textAlign: 'right' as const }
const estimSt: CSSProperties      = { fontSize: '13px', fontWeight: 600, color: fg }
const estimM2: CSSProperties      = { fontSize: '11px', fontWeight: 400, color: muted }
const statusWrap: CSSProperties   = { display: 'flex', justifyContent: 'center' }
const scoreWrap: CSSProperties    = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }
const menuSt: CSSProperties       = { color: muted, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const emptyWrap: CSSProperties    = { padding: '56px', textAlign: 'center' as const }
const emptyTxt: CSSProperties     = { fontSize: '14px', fontWeight: 300, color: muted, marginBottom: '6px' }
const emptySub: CSSProperties     = { fontSize: '12px', color: muted }
const newBadge: CSSProperties     = { fontSize: '9px', fontWeight: 700, color: success, backgroundColor: '#ECFDF5', borderRadius: '999px', padding: '1px 7px', letterSpacing: '0.08em', textTransform: 'uppercase' } as CSSProperties
const paginationSt: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', fontSize: '12px', color: muted, borderTop: '1px solid ' + border }

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'
const STATUT_CFG: Record<Statut, { label: string; color: string; bg: string }> = {
  nouveau:  { label: 'Nouveau',  color: brand,   bg: '#EFF6FF' },
  contacte: { label: 'Contact\u00e9', color: warning, bg: '#FFFBEB' },
  rdv:      { label: 'RDV pris', color: success, bg: '#ECFDF5' },
  signe:    { label: 'Sign\u00e9',    color: success, bg: '#D1FAE5' },
  perdu:    { label: 'Perdu',    color: error,   bg: '#FEF2F2' },
}
const TYPE_CFG: Record<string, { label: string; color: string; bg: string }> = {
  vendre:  { label: 'Vendeur',  color: brand,    bg: '#EFF6FF' },
  acheter: { label: 'Acheteur', color: '#7C3AED', bg: '#F5F3FF' },
  audit:   { label: 'Audit',    color: muted,    bg: surface },
}

function getTemperature(conf: number | null) {
  if (!conf) return { label: 'Froid', color: muted, bg: surface, dot: '#94A3B8' }
  if (conf >= 70) return { label: 'Chaud', color: '#DC2626', bg: '#FEF2F2', dot: '#EF4444' }
  if (conf >= 40) return { label: 'Ti\u00e8de', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' }
  return { label: 'Froid', color: muted, bg: surface, dot: '#94A3B8' }
}
function badge(color: string, bg: string): CSSProperties {
  return { display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 600, color, backgroundColor: bg, borderRadius: '999px', padding: '2px 9px', whiteSpace: 'nowrap' }
}
function scoreCircle(conf: number | null): CSSProperties {
  const t = getTemperature(conf)
  return { width: '32px', height: '32px', borderRadius: '999px', backgroundColor: t.bg, border: '2px solid ' + t.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: t.color, flexShrink: 0 }
}
function tab1St(active: boolean, c?: string): CSSProperties {
  const col = c ?? brand
  return { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: active ? 600 : 500, color: active ? col : muted, backgroundColor: active ? col + '14' : 'transparent', border: '1.5px solid ' + (active ? col : border), textDecoration: 'none', whiteSpace: 'nowrap' } as CSSProperties
}
function tab2St(active: boolean, c?: string): CSSProperties {
  const col = c ?? muted
  return { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: active ? 600 : 400, color: active ? col : muted, backgroundColor: active ? col + '14' : 'transparent', border: '1px solid ' + (active ? col : border), textDecoration: 'none', whiteSpace: 'nowrap' } as CSSProperties
}
function cnt1(active: boolean, c?: string): CSSProperties {
  const col = c ?? brand
  return { fontSize: '11px', fontWeight: 700, color: active ? white : muted, backgroundColor: active ? col : border, borderRadius: '999px', padding: '1px 7px' }
}
function cnt2(active: boolean, c?: string): CSSProperties {
  const col = c ?? muted
  return { fontSize: '10px', fontWeight: 700, color: active ? white : muted, backgroundColor: active ? col : border, borderRadius: '999px', padding: '1px 6px' }
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; temp?: string }> }) {
  const sp          = await searchParams
  const cookieStore = await cookies()
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const svc = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: raw } = await svc.from('leads').select('*').order('created_at', { ascending: false }).limit(100)

  type Lead = Record<string, unknown>
  const all: Lead[] = (raw ?? []) as Lead[]

  const q    = (sp.q    ?? '').toLowerCase()
  const type = sp.type  ?? ''
  const temp = sp.temp  ?? ''

  const filtered = all.filter((l) => {
    const name    = ((l.prenom as string ?? '') + ' ' + (l.nom as string ?? '')).toLowerCase()
    const fd      = (l.form_data as Record<string, string> | null) ?? {}
    const adresse = (fd.adresse ?? '').toLowerCase()
    const conf    = (l.results as Record<string, number> | null)?.confiance ?? null
    return (!q || name.includes(q) || adresse.includes(q))
        && (!type || l.type === type)
        && (!temp || getTemperature(conf).label === temp)
  })

  function cnt(fn: (l: Lead) => boolean) { return all.filter(fn).length }
  const total    = all.length
  const vendeurs = cnt((l) => l.type === 'vendre')
  const acheteurs = cnt((l) => l.type === 'acheter')
  const chauds   = cnt((l) => getTemperature((l.results as Record<string, number> | null)?.confiance ?? null).label === 'Chaud')
  const tiedesN  = cnt((l) => getTemperature((l.results as Record<string, number> | null)?.confiance ?? null).label === 'Ti\u00e8de')
  const froids   = cnt((l) => getTemperature((l.results as Record<string, number> | null)?.confiance ?? null).label === 'Froid')

  function href(ov: Record<string, string>) {
    const p  = new URLSearchParams()
    const qV = ov.q    !== undefined ? ov.q    : q
    const tV = ov.type !== undefined ? ov.type : type
    const eV = ov.temp !== undefined ? ov.temp : temp
    if (qV) p.set('q', qV)
    if (tV) p.set('type', tV)
    if (eV) p.set('temp', eV)
    return '/leads' + (p.toString() ? '?' + p.toString() : '')
  }

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <div style={topRow}>
          <div style={titleWrap}>
            <h1 style={pageTitle}>Prospects</h1>
            <span style={totalBadge}>{filtered.length}</span>
          </div>
          <form method="GET" action="/leads">
            {type && <input type="hidden" name="type" value={type} />}
            {temp && <input type="hidden" name="temp" value={temp} />}
            <input style={searchInput} name="q" defaultValue={q} placeholder="Rechercher un prospect..." autoComplete="off" />
          </form>
        </div>
        <div style={filterRow1}>
          <Link href={href({ type: '' })} style={tab1St(!type)}>Tous <span style={cnt1(!type)}>{total}</span></Link>
          <Link href={href({ type: 'vendre' })} style={tab1St(type === 'vendre')}>Vendeurs <span style={cnt1(type === 'vendre')}>{vendeurs}</span></Link>
          <Link href={href({ type: 'acheter' })} style={tab1St(type === 'acheter', '#7C3AED')}>Acheteurs <span style={cnt1(type === 'acheter', '#7C3AED')}>{acheteurs}</span></Link>
        </div>
        <div style={filterRow2}>
          <span style={row2Label}>Score :</span>
          <Link href={href({ temp: '' })} style={tab2St(!temp)}>Tous <span style={cnt2(!temp)}>{type ? filtered.length : total}</span></Link>
          <Link href={href({ temp: 'Chaud' })} style={tab2St(temp === 'Chaud', '#DC2626')}>Chauds <span style={cnt2(temp === 'Chaud', '#DC2626')}>{chauds}</span></Link>
          <Link href={href({ temp: 'Ti\u00e8de' })} style={tab2St(temp === 'Ti\u00e8de', '#D97706')}>Ti\u00e8des <span style={cnt2(temp === 'Ti\u00e8de', '#D97706')}>{tiedesN}</span></Link>
          <Link href={href({ temp: 'Froid' })} style={tab2St(temp === 'Froid')}>Froids <span style={cnt2(temp === 'Froid')}>{froids}</span></Link>
        </div>
        <div style={tableCard}>
          {filtered.length > 0 ? (
            <>
              <div style={tableHeader}><div /><span>Prospect</span><span>Type</span><span style={estimWrap}>Estimation</span><span style={statusWrap}>Statut</span><span style={scoreWrap}>Score</span><span /></div>
              {filtered.map((lead) => {
                const prenom   = (lead.prenom as string) ?? ''
                const nom      = (lead.nom    as string) ?? ''
                const fd       = (lead.form_data as Record<string, string> | null) ?? {}
                const results  = lead.results as Record<string, number> | null
                const bas      = results?.fourchette_basse
                const haut     = results?.fourchette_haute
                const conf     = results?.confiance ?? null
                const prixM2   = results?.prixM2
                const statut   = (lead.statut as Statut) ?? 'nouveau'
                const sCfg     = STATUT_CFG[statut] ?? STATUT_CFG.nouveau
                const tCfg     = TYPE_CFG[lead.type as string] ?? TYPE_CFG.audit
                const initial  = (prenom[0] ?? (lead.email as string)?.[0] ?? '?').toUpperCase()
                const date     = new Date(lead.created_at as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                const isNew    = statut === 'nouveau'
                return (
                  <Link key={lead.id as string} href={'/leads/' + lead.id} style={rowSt}>
                    <div style={checkboxSt} />
                    <div style={leadRowInner}>
                      <div style={avatarSt}>{initial}</div>
                      <div>
                        <div style={leadName}>{prenom && nom ? prenom + ' ' + nom : 'Anonyme'}{isNew && <span style={newBadge}>New</span>}</div>
                        <div style={leadInfo}>{fd.adresse ?? ''}{fd.type_bien ? ' \u00b7 ' + fd.type_bien : ''}{' \u00b7 ' + date}</div>
                      </div>
                    </div>
                    <div><span style={badge(tCfg.color, tCfg.bg)}>{tCfg.label}</span></div>
                    <div style={estimWrap}>
                      {bas && haut ? (<><div style={estimSt}>{fmt(bas) + ' \u2013 ' + fmt(haut)}</div>{prixM2 && <div style={estimM2}>{prixM2.toLocaleString('fr-FR') + ' \u20ac/m\u00b2'}</div>}</>) : (<div style={estimM2}>Non estim\u00e9</div>)}
                    </div>
                    <div style={statusWrap}><span style={badge(sCfg.color, sCfg.bg)}>{sCfg.label}</span></div>
                    <div style={scoreWrap}><div style={scoreCircle(conf)}>{conf ?? '\u2014'}</div></div>
                    <div style={menuSt}>\u22ef</div>
                  </Link>
                )
              })}
              <div style={paginationSt}><span>Afficher 10 \u00b7 par page</span><span>{'1\u2013' + filtered.length + ' sur ' + filtered.length}</span></div>
            </>
          ) : (
            <div style={emptyWrap}>
              <div style={emptyTxt}>{q ? 'Aucun r\u00e9sultat.' : 'Aucun prospect pour l\'instant.'}</div>
              <div style={emptySub}>{q ? 'Essayez une autre recherche.' : 'Les leads appara\u00eetront ici d\u00e8s le d\u00e9ploiement.'}</div>
            </div>
          )}
        </div>
      </div>
    </CrmLayout>
  )
}
