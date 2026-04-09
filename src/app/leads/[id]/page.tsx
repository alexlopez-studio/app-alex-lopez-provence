import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import CrmLayout from '@/components/crm/CrmLayout'
import type { CSSProperties } from 'react'

const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const white      = '#ffffff'
const brand      = '#0066FF'
const brandLight = '#EFF6FF'
const surface    = '#F8FAFC'
const success    = '#10B981'
const warning    = '#F59E0B'
const error      = '#EF4444'

function formatEur(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

const pageWrap: CSSProperties    = { padding: '32px' }
const topBar: CSSProperties      = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }
const backLnk: CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: muted, textDecoration: 'none', marginBottom: '12px' }
const headName: CSSProperties    = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '4px' }
const headSub: CSSProperties     = { fontSize: '12px', fontWeight: 400, color: muted, display: 'flex', flexWrap: 'wrap', gap: '12px' } as CSSProperties
const actionsRow: CSSProperties  = { display: 'flex', gap: '10px', alignItems: 'center' }
const btnSave: CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: fg, color: white, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer' }
const btnCall: CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brand, color: white, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', textDecoration: 'none' }
const alertBand: CSSProperties   = { backgroundColor: surface, border: '1px solid ' + border, borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' } as CSSProperties
const alertTxt: CSSProperties    = { fontSize: '13px', fontWeight: 500, color: fg, flex: 1 }
const alertScore: CSSProperties  = { fontSize: '13px', fontWeight: 600, color: brand }
const alertIcon: CSSProperties   = { fontSize: '16px' }
const twoCol: CSSProperties      = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }
const card: CSSProperties        = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '24px' }
const bienCard: CSSProperties    = { ...card, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' } as CSSProperties
const cardTitle: CSSProperties   = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '16px' }
const relanceItemSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }
const relanceLbl: CSSProperties  = { fontSize: '13px', fontWeight: 500, color: fg, flex: 1 }
const relanceSub: CSSProperties  = { fontSize: '11px', fontWeight: 400, color: muted }
const relanceInner: CSSProperties = { flex: 1 }
const relanceEmoji: CSSProperties = { fontSize: '20px' }
const activityRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }
const activityEmoji: CSSProperties = { fontSize: '18px' }
const activityTitle: CSSProperties = { fontSize: '13px', fontWeight: 600, color: fg }
const activityDate: CSSProperties  = { fontSize: '11px', color: muted }
const activityNote: CSSProperties  = { fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6 }
const bienEmoji: CSSProperties   = { fontSize: '24px' }
const bienInner: CSSProperties   = { flex: 1 }
const bienTitle: CSSProperties   = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '4px' }
const bienSub: CSSProperties     = { fontSize: '12px', color: muted }
const bienEstim: CSSProperties   = { textAlign: 'right' as const }
const bienRange: CSSProperties   = { fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
const bienM2: CSSProperties      = { fontSize: '12px', color: muted, marginTop: '2px' }
const fieldLabel: CSSProperties  = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted } as CSSProperties
const selectSt: CSSProperties    = { width: '100%', fontSize: '13px', color: fg, border: '1.5px solid ' + border, borderRadius: '10px', padding: '10px 12px', outline: 'none', marginTop: '6px', marginBottom: '16px', backgroundColor: white }
const notesArea: CSSProperties   = { width: '100%', minHeight: '100px', fontSize: '13px', fontWeight: 300, color: fg, border: '1.5px solid ' + border, borderRadius: '10px', padding: '12px 14px', outline: 'none', resize: 'vertical' as const, fontFamily: 'var(--font-inter), system-ui, sans-serif', boxSizing: 'border-box', marginTop: '6px' }
const scoreWrap: CSSProperties   = { display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }
const scoreBig: CSSProperties    = { fontSize: '48px', fontWeight: 900, color: fg, letterSpacing: '-0.05em', lineHeight: 1 }
const scoreDenom: CSSProperties  = { fontSize: '16px', fontWeight: 400, color: muted, marginBottom: '6px' }
const scoreLabel: CSSProperties  = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, marginBottom: '8px' } as CSSProperties
const delaiTxt: CSSProperties    = { fontSize: '12px', color: muted }

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'

const STATUT_CONFIG: Record<Statut, { label: string; color: string; bg: string }> = {
  nouveau:  { label: 'Nouveau',   color: brand,   bg: '#EFF6FF' },
  contacte: { label: 'Contact\u00e9',  color: warning, bg: '#FFFBEB' },
  rdv:      { label: 'RDV pris',  color: success, bg: '#ECFDF5' },
  signe:    { label: 'Sign\u00e9',     color: success, bg: '#D1FAE5' },
  perdu:    { label: 'Perdu',     color: error,   bg: '#FEF2F2' },
}

const ETAT_LBL: Record<string, string>  = { neuf: 'Neuf / r\u00e9cent', tres_bon_etat: 'Tr\u00e8s bon \u00e9tat', bon_etat: 'Bon \u00e9tat', rafraichir: '\u00c0 rafra\u00eechir', travaux: 'Travaux importants' }
const DELAI_LBL: Record<string, string> = { immediat: 'Imm\u00e9diat', '1_3_mois': '1-3 mois', '3_6_mois': '3-6 mois', '6_mois': '+6 mois', pas_decide: 'Pas d\u00e9cid\u00e9' }

const RELANCES = [
  { label: 'Premiers contacts',        sub: 'Semaines 1-2', emoji: '\ud83d\ude80' },
  { label: 'R\u00e9cap estimation',    sub: 'J+1',          emoji: '\ud83d\udcca' },
  { label: 'Relance de suivi',         sub: 'J+3',          emoji: '\u23f0' },
  { label: 'Rappel personnalis\u00e9', sub: 'J+7',          emoji: '\ud83d\udcde' },
  { label: 'Suivi J+14',               sub: 'J+14',         emoji: '\ud83d\udc64' },
]

function badgeSt(color: string, bg: string): CSSProperties {
  return { display: 'inline-flex', fontSize: '11px', fontWeight: 600, color, backgroundColor: bg, borderRadius: '999px', padding: '3px 10px' }
}

function relanceBorderSt(last: boolean): CSSProperties {
  return { ...relanceItemSt, borderBottom: last ? 'none' : '1px solid ' + border }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: lead } = await serviceClient
    .from('leads').select('*').eq('id', id).single()

  if (!lead) notFound()

  const fd       = lead.form_data as Record<string, unknown> | null ?? {}
  const results  = lead.results  as Record<string, number>  | null ?? {}
  const prenom   = lead.prenom ?? ''
  const nom      = lead.nom ?? ''
  const statut   = (lead.statut as Statut) ?? 'nouveau'
  const cfg      = STATUT_CONFIG[statut] ?? STATUT_CONFIG.nouveau
  const surface  = fd.surface   as number | undefined
  const nbPieces = fd.nb_pieces as number | undefined
  const adresse  = fd.adresse   as string | undefined
  const etat     = fd.etat      as string | undefined
  const delai    = fd.delai     as string | undefined
  const typeBien = fd.type_bien as string | undefined
  const bas      = results?.fourchette_basse
  const haut     = results?.fourchette_haute
  const confiance = results?.confiance as number | undefined
  const hasEstim = bas && haut
  const date     = new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const typeLbl  = typeBien === 'maison' ? 'Maison' : typeBien === 'appartement' ? 'Appartement' : typeBien ?? 'Bien'

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <Link href="/leads" style={backLnk}>{'\u2190 Prospects'}</Link>

        <div style={topBar}>
          <div>
            <h1 style={headName}>{prenom && nom ? prenom + ' ' + nom : 'Anonyme'}</h1>
            <div style={headSub}>
              {adresse && <span>{'\ud83d\udccd ' + adresse}</span>}
              <span>{'Re\u00e7u le ' + date}</span>
              {lead.telephone && <span>{'\ud83d\udcde ' + lead.telephone}</span>}
              {lead.email && <span>{'\u2709\ufe0f ' + lead.email}</span>}
            </div>
          </div>
          <div style={actionsRow}>
            {lead.telephone && (<a href={'tel:' + lead.telephone} style={btnCall}>{'\ud83d\udcde Appeler'}</a>)}
            <button style={btnSave}>Sauvegarder</button>
          </div>
        </div>

        {statut === 'nouveau' && (
          <div style={alertBand}>
            <span style={alertIcon}>{'\u2728'}</span>
            <span style={alertTxt}>{'Nouveau prospect \u2014 \u00e9tablir le premier contact rapidement'}</span>
            {confiance && <span style={alertScore}>{'Score : ' + confiance + '/100'}</span>}
          </div>
        )}

        <div style={twoCol}>
          <div style={card}>
            <div style={cardTitle}>{'\ud83d\udd04 Relances automatiques'}</div>
            {RELANCES.map((r, i) => (
              <div key={i} style={relanceBorderSt(i === RELANCES.length - 1)}>
                <span style={relanceEmoji}>{r.emoji}</span>
                <div style={relanceInner}>
                  <div style={relanceLbl}>{r.label}</div>
                  <div style={relanceSub}>{r.sub}</div>
                </div>
                <span style={badgeSt(brand, brandLight)}>{'\u00c0 envoyer'}</span>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={cardTitle}>{'\u26a1 Activit\u00e9 du prospect'}</div>
            <div style={activityRow}>
              <span style={activityEmoji}>{'\ud83d\udcc5'}</span>
              <div>
                <div style={activityTitle}>{'Lead cr\u00e9\u00e9'}</div>
                <div style={activityDate}>{date}</div>
              </div>
            </div>
            <div style={activityNote}>{'Les ouvertures d\'emails et consultations de rapport appara\u00eetront ici.'}</div>
          </div>
        </div>

        {(adresse || surface) && (
          <div style={bienCard}>
            <span style={bienEmoji}>{'\ud83c\udfe0'}</span>
            <div style={bienInner}>
              <div style={bienTitle}>
                {typeLbl}
                {surface ? ' \u00b7 ' + surface + ' m\u00b2' : ''}
                {nbPieces ? ' \u00b7 ' + nbPieces + ' pi\u00e8ces' : ''}
              </div>
              {adresse && <div style={bienSub}>{'\ud83d\udccd ' + adresse}</div>}
              {etat && <div style={bienSub}>{'\ud83d\udd27 ' + (ETAT_LBL[etat] ?? etat)}</div>}
            </div>
            {hasEstim && (
              <div style={bienEstim}>
                <div style={bienRange}>{formatEur(bas!) + ' \u2014 ' + formatEur(haut!)}</div>
                {results?.prixM2 && <div style={bienM2}>{results.prixM2.toLocaleString('fr-FR') + ' \u20ac/m\u00b2'}</div>}
              </div>
            )}
          </div>
        )}

        <div style={twoCol}>
          <div style={card}>
            <div style={scoreLabel}>{'Score de fiabilit\u00e9'}</div>
            <div style={scoreWrap}>
              <div style={scoreBig}>{confiance ?? '\u2014'}</div>
              <div style={scoreDenom}>/100</div>
              <span style={badgeSt(cfg.color, cfg.bg)}>{cfg.label}</span>
            </div>
            {delai && <div style={delaiTxt}>{'\ud83d\uddd3 Vente souhait\u00e9e : ' + (DELAI_LBL[delai] ?? delai)}</div>}
          </div>
          <div style={card}>
            <div style={cardTitle}>{'\ud83d\udcdd Statut & Notes'}</div>
            <div style={fieldLabel}>Statut</div>
            <select style={selectSt} defaultValue={statut}>
              {Object.entries(STATUT_CONFIG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
            </select>
            <div style={fieldLabel}>{'Notes priv\u00e9es'}</div>
            <textarea style={notesArea} placeholder={'Ajoutez vos notes priv\u00e9es ici...'} defaultValue={lead.notes ?? ''} />
          </div>
        </div>
      </div>
    </CrmLayout>
  )
}
