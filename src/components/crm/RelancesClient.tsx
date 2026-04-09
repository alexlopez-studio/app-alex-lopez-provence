'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

const brand   = '#0066FF'
const fg      = '#0F172A'
const muted   = '#64748B'
const border  = '#E2E8F0'
const white   = '#ffffff'
const success = '#10B981'
const error   = '#EF4444'
const surface = '#F8FAFC'

export interface RelanceItem {
  id:           string
  titre:        string | null
  type:         string
  scheduled_at: string
  statut:       string
  leads: { id: string; prenom: string; nom: string; telephone: string | null } | null
}

const TYPE_LBL:  Record<string, string> = { appel: '📞', email: '✉️', sms: '💬', rdv: '🤝' }
const TYPE_NAME: Record<string, string> = { appel: 'Appel', email: 'Email', sms: 'SMS', rdv: 'RDV' }

function groupRelances(items: RelanceItem[]) {
  const now      = new Date(); now.setHours(0, 0, 0, 0)
  const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7)
  const late: RelanceItem[]  = []
  const today: RelanceItem[] = []
  const week: RelanceItem[]  = []
  const later: RelanceItem[] = []
  for (const r of items) {
    const d = new Date(r.scheduled_at); d.setHours(0, 0, 0, 0)
    if      (d < now)                       late.push(r)
    else if (d.getTime() === now.getTime()) today.push(r)
    else if (d < nextWeek)                  week.push(r)
    else                                    later.push(r)
  }
  const groups: { label: string; items: RelanceItem[] }[] = []
  if (late.length)  groups.push({ label: '⚠️ En retard',     items: late  })
  if (today.length) groups.push({ label: "📅 Aujourd'hui",   items: today })
  if (week.length)  groups.push({ label: '📆 Cette semaine', items: week  })
  if (later.length) groups.push({ label: '🗓 Plus tard',     items: later })
  return groups
}

const pageWrap: CSSProperties     = { padding: '32px' }
const topRow: CSSProperties       = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }
const titleWrap: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px' }
const pageTitle: CSSProperties    = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
const totalBadge: CSSProperties   = { fontSize: '12px', fontWeight: 600, color: muted, backgroundColor: surface, border: '1px solid ' + border, borderRadius: '999px', padding: '3px 10px' }
const toggleBtn: CSSProperties    = { fontSize: '12px', fontWeight: 500, color: muted, backgroundColor: white, border: '1px solid ' + border, borderRadius: '999px', padding: '7px 14px', cursor: 'pointer' }
const groupLbl: CSSProperties     = { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: muted, marginBottom: '10px', marginTop: '24px' }
const groupCard: CSSProperties    = { backgroundColor: white, borderRadius: '14px', border: '1px solid ' + border, overflow: 'hidden' }
const rowSt: CSSProperties        = { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: '1px solid ' + border }
const rowLast: CSSProperties      = { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px' }
const iconBox: CSSProperties      = { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }
const iconDone: CSSProperties     = { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }
const rowMain: CSSProperties      = { flex: 1, minWidth: 0 }
const rowTitle: CSSProperties     = { fontSize: '13px', fontWeight: 600, color: fg }
const rowTitleDone: CSSProperties = { fontSize: '13px', fontWeight: 400, color: muted, textDecoration: 'line-through' }
const rowSub: CSSProperties       = { fontSize: '11px', color: muted, marginTop: '2px' }
const leadLink: CSSProperties     = { fontSize: '11px', fontWeight: 500, color: brand, textDecoration: 'none' }
const doneBtn: CSSProperties      = { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: success, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '999px', padding: '6px 12px', cursor: 'pointer' }
const doneBtnOff: CSSProperties   = { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: muted, backgroundColor: surface, border: '1px solid ' + border, borderRadius: '999px', padding: '6px 12px', cursor: 'not-allowed', opacity: 0.6 }
const doneBadge: CSSProperties    = { display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: 600, color: success, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '999px', padding: '4px 10px' }
const emptyWrap: CSSProperties    = { padding: '56px', textAlign: 'center' as const }
const emptyEmoji: CSSProperties   = { fontSize: '32px', marginBottom: '12px' }
const emptyTxt: CSSProperties     = { fontSize: '14px', fontWeight: 300, color: muted }

export default function RelancesClient({ relances: initial }: { relances: RelanceItem[] }) {
  const [items, setItems]       = useState<RelanceItem[]>(initial.filter(r => r.statut === 'planifiee'))
  const [done, setDone]         = useState<RelanceItem[]>(initial.filter(r => r.statut !== 'planifiee'))
  const [showDone, setShowDone] = useState(false)
  const [loading, setLoading]   = useState<string | null>(null)

  async function markDone(id: string) {
    setLoading(id)
    const res = await fetch('/api/relances/' + id, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ statut: 'envoyee' }),
    })
    setLoading(null)
    if (res.ok) {
      const moved = items.find(r => r.id === id)
      if (moved) {
        setItems(prev => prev.filter(r => r.id !== id))
        setDone(prev  => [...prev, { ...moved, statut: 'envoyee' }])
      }
    }
  }

  const groups  = groupRelances(items)
  const pending = items.length

  return (
    <div style={pageWrap}>
      <div style={topRow}>
        <div style={titleWrap}>
          <h1 style={pageTitle}>Relances</h1>
          <span style={totalBadge}>{pending} en attente</span>
        </div>
        <button style={toggleBtn} onClick={() => setShowDone(s => !s)}>
          {showDone ? 'Masquer terminées' : `Terminées (${done.length})`}
        </button>
      </div>

      {groups.length === 0 && !showDone && (
        <div style={emptyWrap}>
          <div style={emptyEmoji}>🎉</div>
          <div style={emptyTxt}>Aucune tâche en attente !</div>
        </div>
      )}

      {groups.map(group => (
        <div key={group.label}>
          <div style={groupLbl}>{group.label}</div>
          <div style={groupCard}>
            {group.items.map((r, i) => {
              const lead     = r.leads
              const name     = lead ? ((lead.prenom ?? '') + ' ' + (lead.nom ?? '')).trim() : 'Prospect'
              const icon     = TYPE_LBL[r.type]  ?? '📌'
              const typeLbl  = TYPE_NAME[r.type] ?? r.type
              const time     = new Date(r.scheduled_at).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              const isLoading = loading === r.id
              const isLast    = i === group.items.length - 1
              return (
                <div key={r.id} style={isLast ? rowLast : rowSt}>
                  <div style={iconBox}>{icon}</div>
                  <div style={rowMain}>
                    <div style={rowTitle}>{typeLbl}{r.titre ? ` — ${r.titre}` : ''}</div>
                    <div style={rowSub}>
                      {time} · {lead
                        ? <Link href={`/leads/${lead.id}`} style={leadLink}>{name}</Link>
                        : name
                      }
                      {lead?.telephone && ` · ${lead.telephone}`}
                    </div>
                  </div>
                  <button
                    style={isLoading ? doneBtnOff : doneBtn}
                    onClick={() => markDone(r.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : '✓ Fait'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {showDone && done.length > 0 && (
        <div>
          <div style={groupLbl}>✅ Terminées ({done.length})</div>
          <div style={groupCard}>
            {done.map((r, i) => {
              const lead    = r.leads
              const name    = lead ? ((lead.prenom ?? '') + ' ' + (lead.nom ?? '')).trim() : 'Prospect'
              const icon    = TYPE_LBL[r.type]  ?? '📌'
              const typeLbl = TYPE_NAME[r.type] ?? r.type
              const time    = new Date(r.scheduled_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              const isLast  = i === done.length - 1
              return (
                <div key={r.id} style={isLast ? rowLast : rowSt}>
                  <div style={iconDone}>{icon}</div>
                  <div style={rowMain}>
                    <div style={rowTitleDone}>{typeLbl}{r.titre ? ` — ${r.titre}` : ''}</div>
                    <div style={rowSub}>{time} · {name}</div>
                  </div>
                  <span style={doneBadge}>✓ Fait</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
