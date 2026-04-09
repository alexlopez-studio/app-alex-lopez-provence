'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import type { CSSProperties } from 'react'

const brand  = '#0066FF'
const fg     = '#0F172A'
const muted  = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white  = '#ffffff'
const error  = '#EF4444'

const pageSt: CSSProperties  = { minHeight: '100vh', backgroundColor: surface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const cardSt: CSSProperties  = { backgroundColor: white, borderRadius: '20px', border: '1px solid ' + border, padding: '40px 36px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }
const logoSt: CSSProperties  = { width: '48px', height: '48px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, margin: '0 auto 20px' }
const h1St: CSSProperties    = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px', textAlign: 'center' }
const subSt: CSSProperties   = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '32px', textAlign: 'center' }
const lblSt: CSSProperties   = { display: 'block', fontSize: '13px', fontWeight: 600, color: fg, marginBottom: '6px' }
const inpSt: CSSProperties   = { width: '100%', fontSize: '14px', color: fg, border: '1.5px solid ' + border, borderRadius: '10px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }
const btnSt: CSSProperties   = { width: '100%', padding: '13px', borderRadius: '999px', backgroundColor: brand, color: white, fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '8px' }
const errSt: CSSProperties   = { fontSize: '12px', fontWeight: 500, color: error, marginBottom: '16px', padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState('')

  async function handleLogin() {
    if (!email || !password) { setErr('Email et mot de passe requis.'); return }
    setLoading(true); setErr('')
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErr('Identifiants incorrects. V\u00e9rifiez votre email et mot de passe.')
      setLoading(false)
    } else {
      router.push('/leads')
    }
  }

  return (
    <div style={pageSt}>
      <div style={cardSt}>
        <div style={logoSt}>AL</div>
        <h1 style={h1St}>Espace conseiller</h1>
        <p style={subSt}>{'Alex Lopez \u00b7 Mandataire IAD'}</p>
        {err && <div style={errSt}>{err}</div>}
        <label style={lblSt}>Email</label>
        <input style={inpSt} type="email" placeholder="alex@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus />
        <label style={lblSt}>Mot de passe</label>
        <input style={inpSt} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        <button style={btnSt} onClick={handleLogin} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )
}
