import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import CrmLayout from '@/components/crm/CrmLayout'
import PlanifierTache from '@/components/crm/PlanifierTache'
import LeadActions from '@/components/crm/LeadActions'
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

const pageWrap: CSSProperties   = { padding: '32px' }
const topBar: CSSProperties     = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }
const backLnk: CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: muted, textDecoration: 'none', marginBottom: '12px' }
const headName: CSSProperties   = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '4px' }
const headSub: CSSProperties    = { fontSize: '12px', fontWeight: 400, color: muted, display: 'flex', flexWrap: 'wrap', gap: '12px' } as CSSProperties
const actionsRow: CSSProperties = { display: 'flex', gap: '10px', alignItems: 'center' }
const btnCall: CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brand, color: white, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', textDecoration: 'none' }
const btnMail: CSSProperties    = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: white, color: fg, border: '1.5px solid ' + border, fontSize: '13px', fontWeight: 600, padding: '9px 18px', borderRadius: '999px', textDecoration: 'none' }
const alertBand: CSSProperties  = { backgroundColor: surface, border: '1px solid ' + border, borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' } as CSSProperties
const alertTxt: CSSProperties   = { fontSize: '13px', fontWeight: 500, color: fg, flex: 1 }
const alertScore: CSSProperties = { fontSize: '13px', fontWeight: 600, color: brand }
const twoCol: CSSProperties     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }
const card: CSSProperties       = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '24px' }
const bienCard: CSSProperties   = { ...card, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' } as CSSProperties
const cardTitle: CSSProperties  = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '16px' }
const bienEmoji: CSSProperties  = { fontSize: '24px' }
const bienInner: CSSProperties  = { flex: 1 }
const bienTitle: CSSProperties  = { fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '4px' }
const bienSub: CSSProperties    = { fontSize: '12px', color: muted }
const bienEstim: CSSProperties  = { textAlign: 'right' as const }
const bienRange: CSSProperties  = { fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
const bienM2: CSSProperties     = { fontSize: '12px', color: muted, marginTop: '2px' }
const scoreWrap: CSSProperties  = { display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }
const scoreBig: CSSProperties   = { fontSize: '48px', fontWeight: 900, color: fg, letterSpacing: '-0.05em', lineHeight: 1 }
const scoreDenom: CSSProperties = { fontSize: '16px', fontWeight: 400, color: muted, marginBottom: '6px' }
const scoreLbl: CSSProperties   = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: muted, marginBottom: '8px' } as CSSProperties
const delaiTxt: CSSProperties   = { fontSize: '12px', color: muted }
const actRow: CSSProperties     = { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid ' + border }
const actIcon: CSSProperties    = { fontSize: '18px', flexShrink: 0, marginTop: '1px' }
const actTitle: CSSProperties   = { fontSize: '13px', fontWeight: 600, color: fg }
const actSub: CSSProperties     = { fontSize: '11px', color: muted, marginTop: '2px' }
const emptyNote: CSSProperties  = { fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6, marginTop: '4px' }

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'
const STATUT: Record<Statut, { color: string; bg: string }> = {
  nouveau:  { color: brand,   bg: '#EFF6FF' },
  contacte: { color: warning, bg: '#FFFBEB' },
  rdv:      { color: success, bg: '#ECFDF5' },
  signe:    { color: success, bg: '#D1FAE5' },
  perdu:    { color: error,   bg: '#FEF2F2' },
}
const ETAT:  Record<string, string> = { neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état', rafraichir: 'À rafraîchir', travaux: 'Travaux importants' }
const DELAI: Record<string, string> = { immediat: 'Immédiat', '1_3_mois': '1-3 mois', '3_6_mois': '3-6 mois', '6_mois': '+6 mois', pas_decide: 'Pas décidé' }
const TYPE_ICON: Record<string, string> = { appel: '📞', email: '✉️', sms: '💬', rdv: '🤝' }
const TYPE_LBL:  Record<string, string> = { appel: 'Appel', email: 'Email', sms: 'SMS', rdv: 'RDV' }

function badge(color: string, bg: string): CSSProperties {
  return { display: 'inline-flex', fontSize: '11px', fontWeight: 600, color, backgroundColor: bg, borderRadius: '999px', padding: '3px 10px' }
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }      = await params
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

  const [{ data: lead }, { data: relancesRaw }] = await Promise.all([
    svc.from('leads').select('*').eq('id', id).single(),
    svc.from('relances').select('*').eq('lead_id', id).order('scheduled_at', { ascending: true }),
  ])
  if (!lead) notFound()

  const fd        = lead.form_data as Record<string, unknown> | null ?? {}
  const results   = lead.results  as Record<string, number>  | null ?? {}
  const prenom    = lead.prenom ?? ''
  const nom       = lead.nom    ?? ''
  const statut    = (lead.statut as Statut) ?? 'nouveau'
  const cfg       = STATUT[statut] ?? STATUT.nouveau
  const surface   = fd.surface   as number | undefined
  const nbPieces  = fd.nb_pieces as number | undefined
  const adresse   = fd.adresse   as string | undefined
  const etat      = fd.etat      as string | undefined
  const delai     = fd.delai     as string | undefined
  const typeBien  = fd.type_bien as string | undefined
  const bas       = results?.fourchette_basse
  const haut      = results?.fourchette_haute
  const confiance = results?.confiance as number | undefined
  const hasEstim  = bas && haut
  const date      = new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const typeLbl   = typeBien === 'maison' ? 'Maison' : typeBien === 'appartement' ? 'Appartement' : typeBien ?? 'Bien'

  const relances  = (relancesRaw ?? []) as Record<string, unknown>[]
  const pending   = relances.filter(r => r.statut === 'planifiee')
  const completed = relances.filter(r => r.statut !== 'planifiee')

  return (
    <CrmLayout>
      <div style={pageWrap}>
        <Link href="/leads" style={backLnk}>← Prospects</Link>

        <div style={topBar}>
          <div>
            <h1 style={headName}>{prenom && nom ? prenom + ' ' + nom : 'Anonyme'}</h1>
            <div style={headSub}>
              {adresse        && <span>📍 {adresse}</span>}
              <span>Reçu le {date}</span>
              {lead.telephone && <span>📞 {lead.telephone}</span>}
              {lead.email     && <span>✉️ {lead.email}</span>}
            </div>
          </div>
          <div style={actionsRow}>
            {lead.telephone && (
              <a href={'tel:' + lead.telephone} style={btnCall}>📞 Appeler</a>
            )}
            {lead.email && (
              <a href={'mailto:' + lead.email} style={btnMail}>✉️ Email</a>
            )}
          </div>
        </div>

        {statut === 'nouveau' && (
          <div style={alertBand}>
            <span style= fontSize: '16px' >✨</span>
            <span style={alertTxt}>Nouveau prospect — établir le premier contact rapidement</span>
            {confiance && <span style={alertScore}>Score : {confiance}/100</span>}
          </div>
        )}

        <div style={twoCol}>
          {/* Tâches planifiées */}
          <div style={card}>
            <div style= display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' >
              <div style={cardTitle}>📋 Tâches planifiées</div>
              {pending.length > 0 && (
                <span style= fontSize: '11px', fontWeight: 600, color: brand, backgroundColor: brandLight, borderRadius: '999px', padding: '2px 9px' >
                  {pending.length} en attente
                </span>
              )}
            </div>

            {pending.length === 0 && completed.length === 0 && (
              <p style={emptyNote}>Aucune tâche planifiée. Ajoutez-en une ci-dessous.</p>
            )}

            {pending.map((r, i) => {
              const icon  = TYPE_ICON[r.type as string] ?? '📌'
              const lbl   = TYPE_LBL[r.type as string]  ?? String(r.type)
              const time  = new Date(r.scheduled_at as string).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              const isLate = new Date(r.scheduled_at as string) < new Date()
              return (
                <div key={r.id as string} style= ...actRow, borderBottom: i < pending.length - 1 || completed.length > 0 ? '1px solid ' + border : 'none' >
                  <span style={actIcon}>{icon}</span>
                  <div style= flex: 1 >
                    <div style={actTitle}>{lbl}{r.titre ? ` — ${r.titre}` : ''}</div>
                    <div style= ...actSub, color: isLate ? error : muted >{isLate ? '⚠️ ' : ''}{time}</div>
                  </div>
                  <span style={badge(brand, brandLight)}>À faire</span>
                </div>
              )
            })}

            {completed.map((r, i) => {
              const icon = TYPE_ICON[r.type as string] ?? '📌'
              const lbl  = TYPE_LBL[r.type as string]  ?? String(r.type)
              const time = new Date(r.scheduled_at as string).toLocaleString('fr-FR', { day: 'numeric', month: 'short' })
              return (
                <div key={r.id as string} style= ...actRow, opacity: 0.5, borderBottom: i < completed.length - 1 ? '1px solid ' + border : 'none' >
                  <span style={actIcon}>{icon}</span>
                  <div style= flex: 1 >
                    <div style= ...actTitle, textDecoration: 'line-through' >{lbl}{r.titre ? ` — ${r.titre}` : ''}</div>
                    <div style={actSub}>{time}</div>
                  </div>
                  <span style={badge(success, '#ECFDF5')}>✓ Fait</span>
                </div>
              )
            })}

            <div style= marginTop: '16px' >
              <PlanifierTache leadId={id} />
            </div>
          </div>

          {/* Activité */}
          <div style={card}>
            <div style={cardTitle}>⚡ Activité</div>
            <div style={actRow}>
              <span style={actIcon}>📅</span>
              <div>
                <div style={actTitle}>Lead créé</div>
                <div style={actSub}>{date}</div>
              </div>
            </div>
            {relances.length > 0 && (
              <div style={actRow}>
                <span style={actIcon}>📋</span>
                <div>
                  <div style={actTitle}>{relances.length} tâche{relances.length > 1 ? 's' : ''} planifiée{relances.length > 1 ? 's' : ''}</div>
                  <div style={actSub}>{completed.length} terminée{completed.length > 1 ? 's' : ''} · {pending.length} en attente</div>
                </div>
              </div>
            )}
            {statut !== 'nouveau' && (
              <div style= ...actRow, borderBottom: 'none' >
                <span style={actIcon}>🔄</span>
                <div>
                  <div style={actTitle}>Statut mis à jour</div>
                  <div style={actSub}><span style={badge(cfg.color, cfg.bg)}>{statut}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bien estimé */}
        {(adresse || surface) && (
          <div style={bienCard}>
            <span style={bienEmoji}>🏠</span>
            <div style={bienInner}>
              <div style={bienTitle}>
                {typeLbl}
                {surface   ? ' · ' + surface   + ' m²'                  : ''}
                {nbPieces  ? ' · ' + nbPieces  + ' pièce' + (Number(nbPieces) > 1 ? 's' : '') : ''}
              </div>
              {adresse && <div style={bienSub}>📍 {adresse}</div>}
              {etat    && <div style={bienSub}>🔧 {ETAT[etat] ?? etat}</div>}
              {delai   && <div style={bienSub}>🗓 Vente : {DELAI[delai] ?? delai}</div>}
            </div>
            {hasEstim && (
              <div style={bienEstim}>
                <div style={bienRange}>{formatEur(bas!)} — {formatEur(haut!)}</div>
                {results?.prixM2 && <div style={bienM2}>{results.prixM2.toLocaleString('fr-FR')} €/m²</div>}
              </div>
            )}
          </div>
        )}

        <div style={twoCol}>
          {/* Score */}
          <div style={card}>
            <div style={scoreLbl}>Score de fiabilité</div>
            <div style={scoreWrap}>
              <div style={scoreBig}>{confiance ?? '—'}</div>
              <div style={scoreDenom}>/100</div>
              <span style={badge(cfg.color, cfg.bg)}>{statut}</span>
            </div>
            {delai && <div style={delaiTxt}>🗓 Vente souhaitée : {DELAI[delai] ?? delai}</div>}
          </div>

          {/* Statut & Notes — client component */}
          <div style={card}>
            <div style={cardTitle}>📝 Statut & Notes</div>
            <LeadActions
              leadId={id}
              initialStatut={statut}
              initialNotes={lead.notes ?? ''}
            />
          </div>
        </div>
      </div>
    </CrmLayout>
  )
}
