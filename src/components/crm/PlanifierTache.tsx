'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

const brand   = '#0066FF'
const fg      = '#0F172A'
const muted   = '#64748B'
const border  = '#E2E8F0'
const white   = '#ffffff'
const success = '#10B981'

const triggerBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  fontSize: '13px', fontWeight: 600, color: brand,
  backgroundColor: '#EFF6FF', border: '1.5px solid ' + brand,
  borderRadius: '999px', padding: '8px 16px', cursor: 'pointer',
}
const formBox: CSSProperties = {
  backgroundColor: white, border: '1px solid ' + border,
  borderRadius: '14px', padding: '20px', marginTop: '14px',
}
const formTitle: CSSProperties = {
  fontSize: '14px', fontWeight: 700, color: fg, marginBottom: '16px',
}
const grid2: CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px',
}
const fieldWrap: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '5px' }
const lbl: CSSProperties = {
  fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.12em', color: muted,
} as CSSProperties
const inputSt: CSSProperties = {
  fontSize: '13px', color: fg, border: '1.5px solid ' + border,
  borderRadius: '10px', padding: '10px 12px', outline: 'none',
  backgroundColor: white, width: '100%', boxSizing: 'border-box',
}
const fullField: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }
const rowBtns: CSSProperties = { display: 'flex', gap: '10px', marginTop: '16px' }
const btnSubmit: CSSProperties = {
  flex: 1, padding: '11px', borderRadius: '10px',
  backgroundColor: brand, border: 'none', color: white,
  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
}
const btnCancel: CSSProperties = {
  padding: '11px 16px', borderRadius: '10px',
  backgroundColor: white, border: '1.5px solid ' + border,
  color: muted, fontSize: '13px', fontWeight: 500, cursor: 'pointer',
}
const successBand: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '12px 14px', borderRadius: '10px',
  backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0',
  fontSize: '13px', fontWeight: 500, color: success, marginTop: '14px',
}

export default function PlanifierTache({ leadId }: { leadId: string }) {
  const [open, setOpen]       = useState(false)
  const [type, setType]       = useState('appel')
  const [titre, setTitre]     = useState('')
  const [date, setDate]       = useState('')
  const [heure, setHeure]     = useState('09:00')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  async function submit() {
    if (!date) return
    setLoading(true)
    const scheduled_at = new Date(date + 'T' + heure + ':00').toISOString()
    const res = await fetch('/api/relances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, titre: titre.trim() || null, type, scheduled_at }),
    })
    setLoading(false)
    if (res.ok) {
      setDone(true)
      setTimeout(() => {
        setDone(false); setOpen(false)
        setTitre(''); setDate(''); setType('appel')
        window.location.reload()
      }, 1600)
    }
  }

  if (done) return <div style={successBand}>✅ Tâche planifiée !</div>

  return (
    <div>
      {!open && (
        <button style={triggerBtn} onClick={() => setOpen(true)}>+ Planifier une action</button>
      )}
      {open && (
        <div style={formBox}>
          <div style={formTitle}>Nouvelle tâche</div>
          <div style={grid2}>
            <div style={fieldWrap}>
              <span style={lbl}>Type</span>
              <select style={inputSt} value={type} onChange={e => setType(e.target.value)}>
                <option value="appel">📞 Appel</option>
                <option value="email">✉️ Email</option>
                <option value="sms">💬 SMS</option>
                <option value="rdv">🤝 RDV</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <span style={lbl}>Date</span>
              <input
                style={inputSt} type="date" value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>
          <div style={fullField}>
            <span style={lbl}>Heure</span>
            <input style={inputSt} type="time" value={heure} onChange={e => setHeure(e.target.value)} />
          </div>
          <div style={fullField}>
            <span style={lbl}>Note (optionnel)</span>
            <input
              style={inputSt} type="text"
              placeholder="Ex : Rappeler pour le prix, Envoyer le rapport..."
              value={titre}
              onChange={e => setTitre(e.target.value)}
            />
          </div>
          <div style={rowBtns}>
            <button style={btnSubmit} onClick={submit} disabled={!date || loading}>
              {loading ? 'Planification...' : 'Planifier'}
            </button>
            <button style={btnCancel} onClick={() => setOpen(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}
