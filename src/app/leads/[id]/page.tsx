import { redirect, notFound } from 'next/navigation'
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
const brandLight = '#EFF6FF'
const surface = '#F8FAFC'
const success = '#10B981'
const warning = '#F59E0B'
const error   = '#EF4444'

function formatEur(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

const pageWrap: CSSProperties     = { padding: '32px' }
const topBar: CSSProperties       = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }
const backLink: CSSProperties     = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: muted, textDecoration: 'none', marginBottom: '12px' }
const headName: CSSProperties     = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '4px' }
const headSub: CSSProperties      = { fontSize: '12px', fontWeight: 400, color: muted, display: 'flex', flexWrap: 'wrap', gap: '12px' } as CSSProperties
const headSubItem: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '4px' }
const actionsRow: CSSProperties   = { display: 'flex', gap: '10px', alignItems: 'center' }
const btnSave: CSSProperties      = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: fg, color: white, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer' }
const btnCall: CSSProperties      = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brand, color: white, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', textDecoration: 'none' }
const alertBand: CSSProperties    = { backgroundColor: surface, border: '1px solid ' + border, borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' } as CSSProperties
const alertTxt: CSSProperties     = { fontSize: '13px', fontWeight: 500, color: fg, flex: 1 }
const twoCol: CSSProperties       = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }
const card: CSSProperties         = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '24px' }
const cardTitle: CSSProperties    = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }
const fieldRow: CSSProperties     = { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }
const fieldLabel: CSSProperties   = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted } as CSSProperties
const fieldVal: CSSProperties     = { fontSize: '14px', fontWeight: 500, color: fg }
const relanceItem: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid ' + border }
const relanceLabel: CSSProperties = { fontSize: '13px', fontWeight: 500, color: fg, flex: 1 }
const relanceSub: CSSProperties   = { fontSize: '11px', fontWeight: 400, color: muted }
const scoreBig: CSSProperties     = { fontSize: '48px', fontWeight: 900, color: fg, letterSpacing: '-0.05em', lineHeight: 1 }
const scoreLabel: CSSProperties   = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, marginBottom: '8px' } as CSSProperties
const notesArea: CSSProperties    = { width: '100%', minHeight: '100px', fontSize: '13px', fontWeight: 300, color: fg, border: '1.5px solid ' + border, borderRadius: '10px', padding: '12px 14px', outline: 'none', resize: 'vertical' as const, fontFamily: 'var(--font-inter), system-ui, sans-serif', boxSizing: 'border-box' }

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'

const STATUT_CONFIG: Record<Statut, { label: string; color: string; bg: string }> = {
  nouveau:  { label: 'Nouveau',   color: brand,   bg: '#EFF6FF' },
  contacte: { label: 'Contact\u00e9',  color: warning, bg: '#FFFBEB' },
  rdv:      { label: 'RDV pris',  color: success, bg: '#ECFDF5' },
  signe:    { label: 'Sign\u00e9',     color: success, bg: '#D1FAE5' },
  perdu:    { label: 'Perdu',     color: error,   bg: '#FEF2F2' },
}

const ETAT_LBL: Record<string, string> = { neuf: 'Neuf / r\u00e9cent', tres_bon_etat: 'Tr\u00e8s bon \u00e9tat', bon_etat: 'Bon \u00e9tat', rafraichir: '\u00c0 rafra\u00eechir', travaux: 'Travaux importants' }
const DELAI_LBL: Record<string, string> = { immediat: 'Imm\u00e9diat', '1_3_mois': '1-3 mois', '3_6_mois': '3-6 mois', '6_mois': '+6 mois', pas_decide: 'Pas d\u00e9cid\u00e9' }

const RELANCES = [
  { label: 'Premiers contacts', sub: 'Semaines 1-2' },
  { label: 'R\u00e9cap estimation', sub: 'J+1' },
  { label: 'Relance de suivi', sub: 'J+3' },
  { label: 'Rappel personnalis\u00e9', sub: 'J+7' },
  { label: 'Suivi J+14', sub: 'J+14' },
]

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
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

  const { data: lead } = await serviceClient
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!lead) notFound()

  const fd      = lead.form_data as Record<string, unknown> | null ?? {}
  const results = lead.results as Record<string, number> | null ?? {}
  const prenom  = lead.prenom ?? ''
  const nom     = lead.nom ?? ''
  const statut  = (lead.statut as Statut) ?? 'nouveau'
  const cfg     = STATUT_CONFIG[statut] ?? STATUT_CONFIG.nouveau

  const surface   = fd.surface as number | undefined
  const nbPieces  = fd.nb_pieces as number | undefined
  const adresse   = fd.adresse as string | undefined
  const etat      = fd.etat as string | undefined
  const delai     = fd.delai as string | undefined
  const bas       = results?.fourchette_basse
  const haut      = results?.fourchette_haute
  const confiance = results?.confiance as number | undefined

  const hasEstim  = bas && haut
  const date      = new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const statutBadge: CSSProperties = { display: 'inline-flex', fontSize: '11px', fontWeight: 600, color: cfg.color, backgroundColor: cfg.bg, borderRadius: '999px', padding: '3px 10px' }

  return (
    <CrmLayout>
      <div style={pageWrap}>

        {/* Retour */}
        <Link href="/leads" style={backLink}>
          &#8592; Prospects
        </Link>

        {/* Header */}
        <div style={topBar}>
          <div>
            <h1 style={headName}>
              {prenom && nom ? prenom + ' ' + nom : 'Anonyme'}
            </h1>
            <div style={headSub}>
              {adresse && <span style={headSubItem}>\ud83d\udccd {adresse}</span>}
              <span style={headSubItem}>Re\u00e7u le {date}</span>
              {lead.telephone && <span style={headSubItem}>\ud83d\udcde {lead.telephone}</span>}
              {lead.email && <span style={headSubItem}>\u2709\ufe0f {lead.email}</span>}
            </div>
          </div>
          <div style={actionsRow}>
            {lead.telephone && (
              <a href={'tel:' + lead.telephone} style={btnCall}>\ud83d\udcde Appeler</a>
            )}
            <button style={btnSave}>Sauvegarder</button>
          </div>
        </div>

        {/* Alert */}
        {statut === 'nouveau' && (
          <div style={alertBand}>
            <span style= fontSize: '16px' >\u2728</span>
            <span style={alertTxt}>Nouveau prospect \u2014 \u00e9tablir le premier contact rapidement</span>
            {confiance && <span style= fontSize: '13px', fontWeight: 600, color: brand >Score : {confiance}/100</span>}
          </div>
        )}

        {/* Grid 2 colonnes */}
        <div style={twoCol}>

          {/* Relances */}
          <div style={card}>
            <div style={cardTitle}>\ud83d\udd04 Relances automatiques</div>
            {RELANCES.map((r, i) => (
              <div key={i} style=...relanceItem, borderBottom: i < RELANCES.length - 1 ? '1px solid ' + border : 'none'>
                <span style= fontSize: '20px' >{i === 0 ? '\ud83d\ude80' : i === 1 ? '\ud83d\udcca' : i === 2 ? '\u23f0' : i === 3 ? '\ud83d\udcde' : '\ud83d\udc64'}</span>
                <div style= flex: 1 >
                  <div style={relanceLabel}>{r.label}</div>
                  <div style={relanceSub}>{r.sub}</div>
                </div>
                <span style={statutBadge}>\u00c0 envoyer</span>
              </div>
            ))}
          </div>

          {/* Activité */}
          <div style={card}>
            <div style={cardTitle}>\u26a1 Activit\u00e9 du prospect</div>
            <div style= display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' >
              <span style= fontSize: '18px' >\ud83d\udcc5</span>
              <div>
                <div style= fontSize: '13px', fontWeight: 600, color: fg >Lead cr\u00e9\u00e9</div>
                <div style= fontSize: '11px', color: muted >{date}</div>
              </div>
            </div>
            <div style= fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6 >
              {'Les ouvertures d\'emails, clics et consultations de rapport appara\u00eetront ici d\u00e8s qu\'ils se produiront.'}
            </div>
          </div>

        </div>

        {/* Bien */}
        {(adresse || surface) && (
          <div style=...card, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'>
            <span style= fontSize: '24px' >\ud83c\udfe0</span>
            <div style= flex: 1 >
              <div style= fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '4px' >
                {fd.type_bien === 'maison' ? 'Maison' : fd.type_bien === 'appartement' ? 'Appartement' : (fd.type_bien as string) ?? 'Bien'}
                {surface ? ' · ' + surface + ' m\u00b2' : ''}
                {nbPieces ? ' · ' + nbPieces + ' pi\u00e8ces' : ''}
              </div>
              {adresse && <div style= fontSize: '12px', color: muted >\ud83d\udccd {adresse}</div>}
              {etat && <div style= fontSize: '12px', color: muted, marginTop: '2px' >\ud83d\udd27 {ETAT_LBL[etat] ?? etat}</div>}
            </div>
            {hasEstim && (
              <div style= textAlign: 'right' as const >
                <div style= fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' >{formatEur(bas!)} \u2014 {formatEur(haut!)}</div>
                {results?.prixM2 && <div style= fontSize: '12px', color: muted, marginTop: '2px' >{results.prixM2.toLocaleString('fr-FR')} \u20ac/m\u00b2</div>}
              </div>
            )}
          </div>
        )}

        {/* Score + Statut + Notes */}
        <div style={twoCol}>

          {/* Score */}
          <div style={card}>
            <div style={scoreLabel}>Score de fiabilit\u00e9</div>
            <div style= display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' >
              <div style={scoreBig}>{confiance ?? '\u2014'}</div>
              <div style= fontSize: '16px', fontWeight: 400, color: muted, marginBottom: '6px' >/100</div>
              <div style= ...statutBadge, marginBottom: '6px' >{cfg.label}</div>
            </div>
            {delai && <div style= fontSize: '12px', color: muted >\ud83d\uddd3 Vente souhait\u00e9e : {DELAI_LBL[delai] ?? delai}</div>}
          </div>

          {/* Notes */}
          <div style={card}>
            <div style={cardTitle}>\ud83d\udcdd Statut & Notes</div>
            <div style= marginBottom: '12px' >
              <div style={fieldLabel}>Statut</div>
              <select style= width: '100%', fontSize: '13px', color: fg, border: '1.5px solid ' + border, borderRadius: '10px', padding: '10px 12px', outline: 'none', marginTop: '6px'  defaultValue={statut}>
                {Object.entries(STATUT_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={fieldLabel}>Notes priv\u00e9es</div>
            <textarea style=...notesArea, marginTop: '6px' placeholder="Ajoutez vos notes priv\u00e9es ici..." defaultValue={lead.notes ?? ''} />
          </div>

        </div>

      </div>
    </CrmLayout>
  )
}
