'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useVendreStore } from '@/stores/vendreStore'
import type { VendreAnswers, QuestionId } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Check, MapPin } from 'lucide-react'
import Link from 'next/link'

/* ─── Tokens ─── */
const brand      = '#0066FF'
const brandLight = '#EFF6FF'
const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const surface    = '#F8FAFC'
const white      = '#ffffff'
const W          = '680px'

/* ─── Styles statiques ─── */
const pageStyle: CSSProperties     = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const navStyle: CSSProperties      = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: '1px solid ' + border }
const navTopStyle: CSSProperties   = { maxWidth: W, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeftStyle: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarStyle: CSSProperties   = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }
const navNameSt: CSSProperties     = { fontSize: '14px', fontWeight: 700, color: fg }
const navSubSt: CSSProperties      = { fontSize: '11px', color: muted }
const backSt: CSSProperties        = { display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: muted, textDecoration: 'none' }
const phoneSt: CSSProperties       = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: fg, textDecoration: 'none' }
const chatWrap: CSSProperties      = { maxWidth: W, margin: '0 auto', padding: '148px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }
const rowAl: CSSProperties         = { display: 'flex', gap: '10px', alignItems: 'flex-end' }
const rowUser: CSSProperties       = { display: 'flex', justifyContent: 'flex-end' }

/* Fix bulles — overflowWrap + minWidth */
const bubbleAl: CSSProperties      = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', fontSize: '14px', color: fg, lineHeight: 1.65, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '80%' }
const bubbleUser: CSSProperties    = { backgroundColor: brand, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: white, lineHeight: 1.5, overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '80%', minWidth: '60px' }
const tsLeft: CSSProperties        = { fontSize: '10px', color: muted, marginTop: '4px' }
const tsRight: CSSProperties       = { fontSize: '10px', color: muted, marginTop: '4px', textAlign: 'right' }
const inlineZone: CSSProperties    = { marginTop: '8px' }
const inputRow: CSSProperties      = { display: 'flex', gap: '10px', alignItems: 'center' }
const inputSt: CSSProperties       = { flex: 1, fontSize: '14px', color: fg, border: '1.5px solid ' + border, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const inputFull: CSSProperties     = { width: '100%', fontSize: '14px', color: fg, border: '1.5px solid ' + border, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const sendBtnSt: CSSProperties     = { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: brand, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const suggestWrap: CSSProperties   = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '12px', overflow: 'hidden', marginTop: '6px' }
const suggestItem: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', fontSize: '13px', color: fg, cursor: 'pointer' }
const loadingSt: CSSProperties     = { fontSize: '11px', color: muted, marginTop: '6px' }
const validateBtn: CSSProperties   = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: brand, border: 'none', color: white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const validateOff: CSSProperties   = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: border, border: 'none', color: muted, fontSize: '14px', fontWeight: 600, cursor: 'not-allowed', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const sliderWrap: CSSProperties    = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px' }
const sliderValRow: CSSProperties  = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }
const sliderValBox: CSSProperties  = { border: '1.5px solid ' + border, borderRadius: '10px', padding: '8px 16px', fontSize: '18px', fontWeight: 700, color: fg, minWidth: '80px', textAlign: 'center' }
const sliderUnit: CSSProperties    = { fontSize: '14px', fontWeight: 500, color: muted }
const sliderLabels: CSSProperties  = { display: 'flex', justifyContent: 'space-between', marginTop: '8px' }
const sliderLbl: CSSProperties     = { fontSize: '11px', color: muted }
const sliderInp: CSSProperties     = { width: '100%', accentColor: brand } as CSSProperties
const multiGrid: CSSProperties     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const emojiSt: CSSProperties       = { fontSize: '20px' }
const coordGrid: CSSProperties     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const coordWrap: CSSProperties     = { display: 'flex', flexDirection: 'column', gap: '10px' }

/* ─── Stepper connecté ─── */
const stepperWrap: CSSProperties   = { maxWidth: W, margin: '0 auto', padding: '10px 20px 12px', display: 'flex', alignItems: 'center' }
const stepLabelSt: CSSProperties   = { fontSize: '10px', fontWeight: 600, marginTop: '5px', textAlign: 'center' }

const STEPS = [
  { n: 1, label: 'Bien',    questions: ['adresse','type_bien','sous_type_maison','surface','surface_terrain','nb_pieces'] },
  { n: 2, label: 'Détails', questions: ['etat','equipements'] },
  { n: 3, label: 'Projet',  questions: ['delai'] },
  { n: 4, label: 'Contact', questions: ['coordonnees','done'] },
]

function getCurrentStep(q: QuestionId): number {
  for (const s of STEPS) {
    if (s.questions.includes(q)) return s.n
  }
  return 1
}

function StepDot({ n, status }: { n: number; status: 'done' | 'current' | 'future' }) {
  const base: CSSProperties = {
    width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, transition: 'all 0.3s ease',
  }
  if (status === 'done')    return <div style=...base, backgroundColor: brand, color: white, border: '2px solid ' + brand><Check size={12} color={white} strokeWidth={3} /></div>
  if (status === 'current') return <div style=...base, backgroundColor: brandLight, color: brand, border: '2px solid ' + brand>{n}</div>
  return <div style=...base, backgroundColor: white, color: muted, border: '2px solid ' + border>{n}</div>
}

function StepConnector({ filled }: { filled: boolean }) {
  const outer: CSSProperties = { flex: 1, height: '3px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden', margin: '0 4px', marginBottom: '15px' }
  const inner: CSSProperties = { height: '100%', width: filled ? '100%' : '0%', backgroundColor: brand, transition: 'width 0.4s ease', borderRadius: '999px' }
  return <div style={outer}><div style={inner} /></div>
}

function Stepper({ currentQ }: { currentQ: QuestionId }) {
  const currentStep = getCurrentStep(currentQ)
  return (
    <div style={stepperWrap}>
      {STEPS.map((step, i) => {
        const status = step.n < currentStep ? 'done' : step.n === currentStep ? 'current' : 'future'
        return (
          <>
            <div key={step.n} style=display:'flex',flexDirection:'column',alignItems:'center'>
              <StepDot n={step.n} status={status} />
              <span style=...stepLabelSt, color: status === 'future' ? muted : status === 'current' ? brand : fg, fontWeight: status === 'current' ? 700 : 500>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <StepConnector filled={step.n < currentStep} />}
          </>
        )
      })}
    </div>
  )
}

/* ─── Styles dynamiques ─── */
function cardSt(active: boolean): CSSProperties {
  return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 10px', borderRadius: '14px', cursor: 'pointer', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brandLight : white, fontSize: '13px', fontWeight: 600, color: active ? brand : fg, textAlign: 'center', width: '100%' }
}
function multiRowSt(active: boolean): CSSProperties {
  return { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', cursor: 'pointer', border: '1.5px solid ' + (active ? brand : border), backgroundColor: active ? brandLight : white, fontSize: '13px', fontWeight: 500, color: active ? brand : fg }
}
function checkSt(active: boolean): CSSProperties {
  return { width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brand : white, flexShrink: 0 }
}
function suggestItemSt(last: boolean): CSSProperties {
  return { ...suggestItem, borderBottom: last ? 'none' : '1px solid ' + border }
}

/* ─── Données ─── */
const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', emoji: '🏢' },
  { value: 'maison',      label: 'Maison',      emoji: '🏠' },
  { value: 'terrain',     label: 'Terrain',     emoji: '🌿' },
  { value: 'commerce',    label: 'Commerce',    emoji: '🏪' },
  { value: 'immeuble',    label: 'Immeuble',    emoji: '🏗️' },
  { value: 'autre',       label: 'Autre',       emoji: '•••' },
]
const ETAT = [
  { value: 'neuf',          label: 'Neuf / récent',      emoji: '🏆' },
  { value: 'tres_bon_etat', label: 'Très bon état',      emoji: '✨' },
  { value: 'bon_etat',      label: 'Bon état',           emoji: '👍' },
  { value: 'rafraichir',    label: 'À rafraîchir',       emoji: '🖌️' },
  { value: 'travaux',       label: 'Travaux importants', emoji: '🔨' },
]
const DELAI = [
  { value: 'immediat',   label: 'Immédiat',   emoji: '🔥' },
  { value: '1_3_mois',   label: '1 – 3 mois', emoji: '📅' },
  { value: '3_6_mois',   label: '3 – 6 mois', emoji: '🗓️' },
  { value: '6_mois',     label: '+6 mois',    emoji: '⏳' },
  { value: 'pas_decide', label: 'Pas décidé', emoji: '🤔' },
]
const EQUIPEMENTS = ['Balcon', 'Terrasse', 'Parking', 'Garage', 'Cave', 'Jardin', 'Vue exceptionnelle', 'Piscine']

/* ─── Flow ─── */
function getNext(q: QuestionId, a: VendreAnswers): QuestionId {
  switch (q) {
    case 'adresse':          return 'type_bien'
    case 'type_bien':        return a.type_bien === 'maison' ? 'sous_type_maison' : 'surface'
    case 'sous_type_maison': return 'surface'
    case 'surface':          return a.type_bien === 'maison' ? 'surface_terrain' : 'nb_pieces'
    case 'surface_terrain':  return 'nb_pieces'
    case 'nb_pieces':        return 'etat'
    case 'etat':             return 'equipements'
    case 'equipements':      return 'delai'
    case 'delai':            return 'coordonnees'
    default:                 return 'done'
  }
}
function getMsg(q: QuestionId, a: VendreAnswers): string {
  switch (q) {
    case 'type_bien':        return "Parfait, je localise votre bien ! Quel type de bien souhaitez-vous faire estimer ?"
    case 'sous_type_maison': return "Très bien ! S'agit-il d'une maison mitoyenne ou individuelle ?"
    case 'surface':          return "Parfait ! Quelle est la surface habitable de votre bien ?"
    case 'surface_terrain':  return "C'est noté ! Quelle est la superficie totale du terrain de votre maison ?"
    case 'nb_pieces':        return "C'est noté ! Combien de pièces principales compte votre bien ?\n(Séjour + chambres, sans compter cuisine, salle de bain et WC)"
    case 'etat':             return "Compris ! Quel est l'état général de votre bien ?"
    case 'equipements':      return "Très bien ! Quels équipements et atouts possède votre bien ?"
    case 'delai':            return "Compris ! Dans quel délai souhaitez-vous vendre votre bien ?"
    case 'coordonnees':      return "Parfait ! Pour finaliser votre estimation, j'ai besoin de vos coordonnées."
    default:                 return ''
  }
}
function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }

function Avatar() { return <div style={avatarStyle}>AL</div> }

/* ─── Page ─── */
export default function VendrePage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion } = useVendreStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  /* Handler générique — une réponse à la fois */
  function handleAnswer(key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) {
    setAnswer(key, value)
    if (display) addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion, { ...answers, [key]: value })
    setTimeout(() => {
      const msg = getMsg(next, { ...answers, [key]: value })
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 350)
  }

  /* Handler coordonnées — soumission unique, pas de répétition */
  function handleFinalSubmit(prenom: string, nom: string, tel: string, email: string) {
    setAnswer('prenom', prenom)
    setAnswer('nom', nom)
    setAnswer('telephone', tel)
    setAnswer('email', email)
    addMessage({ from: 'user', text: prenom + ' ' + nom, timestamp: ts() })
    const token = crypto.randomUUID()
    /* Envoi en arrière-plan vers l'API (lead + email) */
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...answers, prenom, nom, telephone: tel, email, token, type: 'vendre' }),
    }).catch(() => null)
    /* Redirection immédiate vers la page de résultats */
    router.push('/resultats/' + token)
  }

  return (
    <div style={pageStyle}>
      <header style={navStyle}>
        <div style={navTopStyle}>
          <div style={navLeftStyle}>
            <Link href="/" style={backSt}><ChevronLeft size={14} /></Link>
            <Avatar />
            <div>
              <div style={navNameSt}>Alex Lopez</div>
              <div style={navSubSt}>Mandataire IAD · Provence Verte</div>
            </div>
          </div>
          <a href="tel:+33613180168" style={phoneSt}>
            <Phone size={13} color={brand} />
            06 13 18 01 68
          </a>
        </div>
        {/* Stepper connecté = progrès + étapes fusionnés */}
        <Stepper currentQ={currentQuestion} />
      </header>

      <div style={chatWrap}>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.from === 'al' ? (
              <div style={rowAl}>
                <Avatar />
                <div>
                  <div style={bubbleAl}>{msg.text}</div>
                  <div style={tsLeft}>{msg.timestamp}</div>
                </div>
              </div>
            ) : (
              <div style={rowUser}>
                <div>
                  <div style={bubbleUser}>{msg.text}</div>
                  <div style={tsRight}>{msg.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {currentQuestion !== 'done' && (
          <div style={inlineZone}>
            <InputZone question={currentQuestion} answers={answers} onAnswer={handleAnswer} onFinalSubmit={handleFinalSubmit} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

/* ─── Routing inputs ─── */
function InputZone({ question, answers, onAnswer, onFinalSubmit }: {
  question: QuestionId
  answers: VendreAnswers
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
  onFinalSubmit: (prenom: string, nom: string, tel: string, email: string) => void
}) {
  if (question === 'adresse') return <AdresseInput onAnswer={onAnswer} />
  if (question === 'type_bien') return <Cards options={TYPE_BIEN} cols={2} onSelect={(v, l) => onAnswer('type_bien', v, l)} />
  if (question === 'sous_type_maison') return (
    <Cards
      options={[{ value: 'mitoyenne', label: 'Mitoyenne', emoji: '🏘️' }, { value: 'individuelle', label: 'Individuelle', emoji: '🏠' }]}
      cols={2}
      onSelect={(v, l) => onAnswer('sous_type', v, l)}
    />
  )
  if (question === 'surface') return <Slider unit="m²" min={5} max={1000} def={80} onValidate={(v) => onAnswer('surface', v, v + ' m²')} />
  if (question === 'surface_terrain') return <Slider unit="m²" min={50} max={5000} def={500} onValidate={(v) => onAnswer('surface_terrain', v, v + ' m²')} />
  if (question === 'nb_pieces') return (
    <Cards
      options={['1','2','3','4','5','6+'].map((n) => ({ value: n, label: n, emoji: '' }))}
      cols={3}
      onSelect={(v, l) => onAnswer('nb_pieces', parseInt(v) || 6, l + (parseInt(v) > 1 ? ' pièces' : ' pièce'))}
    />
  )
  if (question === 'etat') return <Cards options={ETAT} cols={2} onSelect={(v, l) => onAnswer('etat', v, l)} />
  if (question === 'equipements') return (
    <MultiSelect options={EQUIPEMENTS} onValidate={(sel) => onAnswer('equipements', sel, sel.length ? sel.join(', ') : 'Aucun équipement')} />
  )
  if (question === 'delai') return <Cards options={DELAI} cols={2} onSelect={(v, l) => onAnswer('delai', v, l)} />
  if (question === 'coordonnees') return <Coordonnees onFinalSubmit={onFinalSubmit} />
  return null
}

/* ─── Adresse — api-adresse.data.gouv.fr ─── */
interface Suggestion { label: string; lat: number; lng: number }
const API_ADRESSE = 'https://api-adresse.data.gouv.fr/search/'

function AdresseInput({ onAnswer }: {
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  const [val, setVal]         = useState('')
  const [suggestions, setSug] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const timer                 = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchSug(q: string) {
    if (q.length < 3) { setSug([]); return }
    setLoading(true)
    try {
      const res  = await fetch(API_ADRESSE + '?q=' + encodeURIComponent(q) + '&limit=5')
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSug(data.features.map((f: any) => ({ label: f.properties.label, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] })))
    } catch { setSug([]) }
    finally { setLoading(false) }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => fetchSug(e.target.value), 300)
  }

  function pick(s: Suggestion) { setSug([]); setVal(s.label); onAnswer('adresse', s.label, s.label) }
  function submit() { if (!val.trim()) return; setSug([]); onAnswer('adresse', val.trim(), val.trim()) }

  return (
    <div>
      <div style={inputRow}>
        <input style={inputSt} type="text" placeholder="Ex : 12 rue de la Paix, Cotignac"
          value={val} onChange={onChange} onKeyDown={(e) => e.key === 'Enter' && submit()} autoFocus autoComplete="off" />
        <button style={sendBtnSt} onClick={submit}><Send size={16} color={white} /></button>
      </div>
      {suggestions.length > 0 && (
        <div style={suggestWrap}>
          {suggestions.map((s, i) => (
            <div key={i} style={suggestItemSt(i === suggestions.length - 1)} onClick={() => pick(s)}>
              <MapPin size={13} color={brand} />
              {s.label}
            </div>
          ))}
        </div>
      )}
      {loading && <p style={loadingSt}>Recherche en cours...</p>}
    </div>
  )
}

/* ─── Cards ─── */
function Cards({ options, cols, onSelect }: {
  options: { value: string; label: string; emoji: string }[]
  cols: number
  onSelect: (value: string, label: string) => void
}) {
  const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gap: '10px' }
  return (
    <div style={grid}>
      {options.map((o) => (
        <button key={o.value} style={cardSt(false)} onClick={() => onSelect(o.value, o.label)}>
          {o.emoji ? <span style={emojiSt}>{o.emoji}</span> : null}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ─── Slider ─── */
function Slider({ unit, min, max, def, onValidate }: { unit: string; min: number; max: number; def: number; onValidate: (v: number) => void }) {
  const [val, setVal] = useState(def)
  return (
    <div style={sliderWrap}>
      <div style={sliderValRow}>
        <div style={sliderValBox}>{val}</div>
        <span style={sliderUnit}>{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={val} style={sliderInp} onChange={(e) => setVal(Number(e.target.value))} />
      <div style={sliderLabels}>
        <span style={sliderLbl}>{min} {unit}</span>
        <span style={sliderLbl}>{max} {unit}</span>
      </div>
      <button style={validateBtn} onClick={() => onValidate(val)}>
        <Send size={14} /> Valider
      </button>
    </div>
  )
}

/* ─── Multi-select ─── */
function MultiSelect({ options, onValidate }: { options: string[]; onValidate: (s: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  function toggle(o: string) { setSel((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o]) }
  return (
    <div>
      <div style={multiGrid}>
        {options.map((o) => {
          const active = sel.includes(o)
          return (
            <div key={o} style={multiRowSt(active)} onClick={() => toggle(o)}>
              <div style={checkSt(active)} />
              <span>{o}</span>
            </div>
          )
        })}
      </div>
      <button style={validateBtn} onClick={() => onValidate(sel)}>
        {sel.length === 0 ? 'Aucun équipement' : 'Valider (' + sel.length + ' sélectionné' + (sel.length > 1 ? 's' : '') + ')'} <Send size={14} />
      </button>
    </div>
  )
}

/* ─── Coordonnées — soumission unique (fix répétitions) ─── */
function Coordonnees({ onFinalSubmit }: {
  onFinalSubmit: (prenom: string, nom: string, tel: string, email: string) => void
}) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom]       = useState('')
  const [tel, setTel]       = useState('')
  const [email, setEmail]   = useState('')
  const valid = !!(prenom.trim() && nom.trim() && tel.trim() && email.trim())

  return (
    <div style={coordWrap}>
      <div style={coordGrid}>
        <input style={inputFull} placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <input style={inputFull} placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <input style={inputFull} type="tel" placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
      <input style={inputFull} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button style={valid ? validateBtn : validateOff} onClick={() => valid && onFinalSubmit(prenom.trim(), nom.trim(), tel.trim(), email.trim())} disabled={!valid}>
        Obtenir mon estimation <Send size={14} />
      </button>
    </div>
  )
}
