'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

const fg      = '#0F172A'
const muted   = '#64748B'
const border  = '#E2E8F0'
const white   = '#ffffff'
const brand   = '#0066FF'
const success = '#10B981'
const warning = '#F59E0B'
const error   = '#EF4444'

type Statut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'
const STATUT: Record<Statut, { label: string }> = {
  nouveau:  { label: 'Nouveau' },
  contacte: { label: 'Contacté' },
  rdv:      { label: 'RDV pris' },
  signe:    { label: 'Signé' },
  perdu:    { label: 'Perdu' },
}

const fldLbl: CSSProperties = {
  fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.12em', color: muted,
} as CSSProperties
const selectSt: CSSProperties = {
  width: '100%', fontSize: '13px', color: fg,
  border: '1.5px solid ' + border, borderRadius: '10px',
  padding: '10px 12px', outline: 'none',
  marginTop: '6px', marginBottom: '16px', backgroundColor: white,
}
const notesArea: CSSProperties = {
  width: '100%', minHeight: '100px', fontSize: '13px', fontWeight: 300,
  color: fg, border: '1.5px solid ' + border, borderRadius: '10px',
  padding: '12px 14px', outline: 'none', resize: 'vertical' as const,
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  boxSizing: 'border-box', marginTop: '6px',
}
const btnSave: CSSProperties = {
  marginTop: '14px', width: '100%', padding: '11px',
  borderRadius: '10px', backgroundColor: fg, border: 'none',
  color: white, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
}
const feedbackOk: CSSProperties  = { fontSize: '12px', fontWeight: 500, color: success, marginTop: '8px', textAlign: 'center' }
const feedbackErr: CSSProperties = { fontSize: '12px', fontWeight: 500, color: error,   marginTop: '8px', textAlign: 'center' }

export default function LeadActions({
  leadId,
  initialStatut,
  initialNotes,
}: {
  leadId: string
  initialStatut: string
  initialNotes: string
}) {
  const [statut, setStatut]     = useState(initialStatut)
  const [notes, setNotes]       = useState(initialNotes)
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState<'ok' | 'err' | null>(null)

  async function save() {
    setLoading(true); setFeedback(null)
    const res = await fetch('/api/leads/' + leadId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut, notes }),
    })
    setLoading(false)
    setFeedback(res.ok ? 'ok' : 'err')
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div>
      <div style={fldLbl}>Statut</div>
      <select style={selectSt} value={statut} onChange={e => setStatut(e.target.value)}>
        {Object.entries(STATUT).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      <div style={fldLbl}>Notes privées</div>
      <textarea
        style={notesArea}
        placeholder="Ajoutez vos notes privées ici..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <button style={btnSave} onClick={save} disabled={loading}>
        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
      {feedback === 'ok'  && <div style={feedbackOk}>✅ Sauvegardé !</div>}
      {feedback === 'err' && <div style={feedbackErr}>❌ Erreur, réessayez.</div>}
    </div>
  )
}
