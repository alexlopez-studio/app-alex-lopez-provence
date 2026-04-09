'use client'

import { useRef, useEffect, useState } from 'react'
import { useVendreStore } from '@/stores/vendreStore'
import type { VendreAnswers, QuestionId } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Home, FileText, Target, User, MapPin } from 'lucide-react'
import Link from 'next/link'

/* ─── Tokens ─── */
const brand      = '#0066FF'
const brandLight = '#EFF6FF'
const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const surface    = '#F8FAFC'
const white      = '#ffffff'
const CONTENT_WIDTH = '700px'

/* ─── Styles statiques ─── */
const pageStyle: CSSProperties      = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const navStyle: CSSProperties       = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: `1px solid ${border}` }
const navTopStyle: CSSProperties    = { maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeftStyle: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarStyle: CSSProperties    = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }
const navNameStyle: CSSProperties   = { fontSize: '14px', fontWeight: 700, color: fg }
const navSubStyle: CSSProperties    = { fontSize: '11px', color: muted }
const backStyle: CSSProperties      = { display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: muted, textDecoration: 'none' }
const phoneStyle: CSSProperties     = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: fg, textDecoration: 'none' }
const progressOuter: CSSProperties  = { backgroundColor: border, height: '3px' }
const progressInner: CSSProperties  = { maxWidth: CONTENT_WIDTH, margin: '0 auto', height: '3px', position: 'relative' }
const tabsWrap: CSSProperties       = { maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const pctStyle: CSSProperties       = { fontSize: '11px', fontWeight: 700, color: brand }
const chatWrap: CSSProperties       = { maxWidth: CONTENT_WIDTH, margin: '0 auto', padding: '120px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }
const rowAl: CSSProperties          = { display: 'flex', gap: '10px', alignItems: 'flex-end' }
const rowUser: CSSProperties        = { display: 'flex', justifyContent: 'flex-end' }
const bubbleAl: CSSProperties       = { backgroundColor: white, border: `1px solid ${border}`, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', fontSize: '14px', color: fg, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '85%' }
const bubbleUser: CSSProperties     = { backgroundColor: brand, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: white, lineHeight: 1.5, wordBreak: 'break-word', maxWidth: '85%' }
const tsLeft: CSSProperties         = { fontSize: '10px', color: muted, marginTop: '4px' }
const tsRight: CSSProperties        = { fontSize: '10px', color: muted, marginTop: '4px', textAlign: 'right' }
const inlineZone: CSSProperties     = { marginTop: '8px' }
const inputRow: CSSProperties       = { display: 'flex', gap: '10px', alignItems: 'center' }
const inputStyle: CSSProperties     = { flex: 1, fontSize: '14px', color: fg, border: `1.5px solid ${border}`, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const inputFull: CSSProperties      = { width: '100%', fontSize: '14px', color: fg, border: `1.5px solid ${border}`, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const sendBtn: CSSProperties        = { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: brand, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const suggestWrap: CSSProperties    = { backgroundColor: white, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden', marginTop: '6px' }
const suggestItem: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', fontSize: '13px', color: fg, cursor: 'pointer' }
const loadingStyle: CSSProperties   = { fontSize: '11px', color: muted, marginTop: '6px' }
const validateBtn: CSSProperties    = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: brand, border: 'none', color: white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const validateOff: CSSProperties    = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: border, border: 'none', color: muted, fontSize: '14px', fontWeight: 600, cursor: 'not-allowed', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const sliderWrap: CSSProperties     = { backgroundColor: white, borderRadius: '16px', border: `1px solid ${border}`, padding: '20px' }
const sliderValRow: CSSProperties   = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }
const sliderValBox: CSSProperties   = { border: `1.5px solid ${border}`, borderRadius: '10px', padding: '8px 16px', fontSize: '18px', fontWeight: 700, color: fg, minWidth: '80px', textAlign: 'center' }
const sliderUnit: CSSProperties     = { fontSize: '14px', fontWeight: 500, color: muted }
const sliderLabels: CSSProperties   = { display: 'flex', justifyContent: 'space-between', marginTop: '8px' }
const sliderLbl: CSSProperties      = { fontSize: '11px', color: muted }
const sliderInp: CSSProperties      = { width: '100%', accentColor: brand } as CSSProperties
const multiGrid: CSSProperties      = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const emojiSt: CSSProperties        = { fontSize: '20px' }
const coordGrid: CSSProperties      = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const coordWrap: CSSProperties      = { display: 'flex', flexDirection: 'column', gap: '10px' }

/* ─── Styles dynamiques ─── */
function fillStyle(pct: number): CSSProperties {
  return { position: 'absolute', top: 0, left: 0, height: '100%', width: pct + '%', backgroundColor: brand, transition: 'width 0.4s ease' }
}
function tabSt(active: boolean): CSSProperties {
  return { display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: active ? brand : muted, borderBottom: active ? '2px solid ' + brand : '2px solid transparent' }
}
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
function getPct(q: QuestionId): number {
  const m: Partial<Record<QuestionId, number>> = { adresse:5, type_bien:15, sous_type_maison:22, surface:30, surface_terrain:38, nb_pieces:45, etat:55, equipements:70, delai:85, coordonnees:95, done:100 }
  return m[q] ?? 0
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
    case 'done':             return "Merci " + (a.prenom || '') + " ! 🎉 Je prépare votre estimation personnalisée. Vous recevrez vos résultats par email sous quelques instants."
    default:                 return ''
  }
}
function getSection(q: QuestionId): 'bien' | 'details' | 'projet' | 'contact' {
  if (['adresse','type_bien','sous_type_maison','surface','surface_terrain','nb_pieces'].includes(q)) return 'bien'
  if (['etat','equipements'].includes(q)) return 'details'
  if (q === 'delai') return 'projet'
  return 'contact'
}
function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }

/* ─── Avatar ─── */
function Avatar() { return <div style={avatarStyle}>AL</div> }

/* ─── Page ─── */
export default function VendrePage() {
  const { messages, currentQuestion, answers, progress, addMessage, setAnswer, setQuestion, setProgress } = useVendreStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const section = getSection(currentQuestion)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function handleAnswer(key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) {
    setAnswer(key, value)
    if (display) addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion, { ...answers, [key]: value })
    setProgress(getPct(next))
    setTimeout(() => {
      const msg = getMsg(next, { ...answers, [key]: value })
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 350)
  }

  const tabs = [
    { id: 'bien',    label: 'Bien',    Icon: Home },
    { id: 'details', label: 'Détails', Icon: FileText },
    { id: 'projet',  label: 'Projet',  Icon: Target },
    { id: 'contact', label: 'Contact', Icon: User },
  ]

  return (
    <div style={pageStyle}>
      <header style={navStyle}>
        <div style={navTopStyle}>
          <div style={navLeftStyle}>
            <Link href="/" style={backStyle}><ChevronLeft size={14} /></Link>
            <Avatar />
            <div>
              <div style={navNameStyle}>Alex Lopez</div>
              <div style={navSubStyle}>Mandataire IAD · Provence Verte</div>
            </div>
          </div>
          <a href="tel:+33613180168" style={phoneStyle}>
            <Phone size={13} color={brand} />
            06 13 18 01 68
          </a>
        </div>

        <div style={progressOuter}>
          <div style={progressInner}>
            <div style={fillStyle(progress)} />
          </div>
        </div>

        <div style={tabsWrap}>
          {tabs.map((tab) => {
            const Icon = tab.Icon
            return (
              <div key={tab.id} style={tabSt(section === tab.id)}>
                <Icon size={13} />{tab.label}
              </div>
            )
          })}
          <div style={tabSt(false)}>
            <span style={pctStyle}>{progress}%</span>
          </div>
        </div>
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
            <InputZone question={currentQuestion} answers={answers} onAnswer={handleAnswer} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

/* ─── Routing inputs ─── */
function InputZone({ question, answers, onAnswer }: {
  question: QuestionId
  answers: VendreAnswers
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
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
  if (question === 'coordonnees') return <Coordonnees onAnswer={onAnswer} />
  return null
}

/* ─── Adresse — API adresse.data.gouv.fr (gratuite, sans clé) ─── */
interface Suggestion { label: string; lat: number; lng: number }

const API_ADRESSE = 'https://api-adresse.data.gouv.fr/search/'

function AdresseInput({ onAnswer }: {
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  const [val, setVal]             = useState('')
  const [suggestions, setSug]     = useState<Suggestion[]>([])
  const [loading, setLoading]     = useState(false)
  const timer                     = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchSug(q: string) {
    if (q.length < 3) { setSug([]); return }
    setLoading(true)
    try {
      const url = API_ADRESSE + '?q=' + encodeURIComponent(q) + '&limit=5'
      const res  = await fetch(url)
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
        <input style={inputStyle} type="text" placeholder="Ex : 12 rue de la Paix, Cotignac"
          value={val} onChange={onChange} onKeyDown={(e) => e.key === 'Enter' && submit()} autoFocus autoComplete="off" />
        <button style={sendBtn} onClick={submit}><Send size={16} color={white} /></button>
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
      {loading && <p style={loadingStyle}>Recherche en cours...</p>}
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
  const [selected, setSel] = useState<string[]>([])
  function toggle(o: string) { setSel((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o]) }
  const label = selected.length === 0 ? 'Aucun équipement' : 'Valider (' + selected.length + ' sélectionné' + (selected.length > 1 ? 's' : '') + ')'
  return (
    <div>
      <div style={multiGrid}>
        {options.map((o) => {
          const active = selected.includes(o)
          return (
            <div key={o} style={multiRowSt(active)} onClick={() => toggle(o)}>
              <div style={checkSt(active)} />
              <span>{o}</span>
            </div>
          )
        })}
      </div>
      <button style={validateBtn} onClick={() => onValidate(selected)}>
        {label} <Send size={14} />
      </button>
    </div>
  )
}

/* ─── Coordonnées ─── */
function Coordonnees({ onAnswer }: {
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom]       = useState('')
  const [tel, setTel]       = useState('')
  const [email, setEmail]   = useState('')
  const valid = !!(prenom.trim() && nom.trim() && tel.trim() && email.trim())

  function submit() {
    if (!valid) return
    onAnswer('prenom', prenom.trim(), '')
    onAnswer('nom', nom.trim(), '')
    onAnswer('telephone', tel.trim(), '')
    onAnswer('email', email.trim(), prenom + ' ' + nom)
  }

  return (
    <div style={coordWrap}>
      <div style={coordGrid}>
        <input style={inputFull} placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <input style={inputFull} placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <input style={inputFull} type="tel" placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
      <input style={inputFull} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button style={valid ? validateBtn : validateOff} onClick={submit} disabled={!valid}>
        Obtenir mon estimation <Send size={14} />
      </button>
    </div>
  )
}
