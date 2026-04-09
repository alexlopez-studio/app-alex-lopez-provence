'use client'

import { useRef, useEffect, useState } from 'react'
import { useVendreStore } from '@/stores/vendreStore'
import type { VendreAnswers, QuestionId } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Home, FileText, Target, User } from 'lucide-react'
import Link from 'next/link'

/* ─────────────────────────────────────────────────────────────
   Tokens
───────────────────────────────────────────────────────────── */
const C = {
  brand:       '#0066FF',
  brandLight:  '#EFF6FF',
  brandDark:   '#0052CC',
  fg:          '#0F172A',
  muted:       '#64748B',
  border:      '#E2E8F0',
  surface:     '#F8FAFC',
  white:       '#ffffff',
  success:     '#10B981',
}

/* ─────────────────────────────────────────────────────────────
   Styles statiques
───────────────────────────────────────────────────────────── */
const pageStyle: CSSProperties         = { minHeight: '100vh', backgroundColor: C.surface, fontFamily: 'var(--font-inter), system-ui, sans-serif', display: 'flex', flexDirection: 'column' }
const navStyle: CSSProperties          = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }
const navTopStyle: CSSProperties       = { maxWidth: '700px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeftStyle: CSSProperties      = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarStyle: CSSProperties       = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: C.brand, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }
const navNameStyle: CSSProperties      = { fontSize: '14px', fontWeight: 700, color: C.fg }
const navSubStyle: CSSProperties       = { fontSize: '11px', fontWeight: 400, color: C.muted }
const backLinkStyle: CSSProperties     = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: C.muted, textDecoration: 'none' }
const phoneLinkStyle: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: C.fg, textDecoration: 'none' }

/* Progress bar */
const progressBarWrap: CSSProperties   = { height: '3px', backgroundColor: C.border }
const progressTabs: CSSProperties      = { maxWidth: '700px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

/* Chat area */
const chatAreaStyle: CSSProperties     = { flex: 1, maxWidth: '700px', width: '100%', margin: '0 auto', padding: '130px 20px 160px', display: 'flex', flexDirection: 'column', gap: '16px' }

/* Messages */
const msgRowAlStyle: CSSProperties     = { display: 'flex', gap: '10px', alignItems: 'flex-end' }
const msgRowUserStyle: CSSProperties   = { display: 'flex', justifyContent: 'flex-end' }
const msgAl: CSSProperties             = { backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', maxWidth: '80%', fontSize: '14px', fontWeight: 400, color: C.fg, lineHeight: 1.6, whiteSpace: 'pre-wrap' }
const msgUser: CSSProperties           = { backgroundColor: C.brand, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', maxWidth: '70%', fontSize: '14px', fontWeight: 500, color: C.white, lineHeight: 1.5 }
const tsStyle: CSSProperties           = { fontSize: '10px', color: C.muted, marginTop: '4px' }

/* Input zone */
const inputZoneStyle: CSSProperties    = { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: C.white, borderTop: `1px solid ${C.border}`, padding: '16px 20px 20px' }
const inputInner: CSSProperties        = { maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }
const textInputRow: CSSProperties      = { display: 'flex', gap: '10px', alignItems: 'center' }
const textInputStyle: CSSProperties    = { flex: 1, fontSize: '14px', color: C.fg, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: C.white, boxSizing: 'border-box' }
const sendBtnStyle: CSSProperties      = { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: C.brand, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

/* Cards */
const cardsGrid: CSSProperties         = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const cardsGrid3: CSSProperties        = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }

/* Slider */
const sliderWrap: CSSProperties        = { backgroundColor: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '20px' }
const sliderValueRow: CSSProperties    = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }
const sliderValBox: CSSProperties      = { border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '8px 16px', fontSize: '18px', fontWeight: 700, color: C.fg, minWidth: '80px', textAlign: 'center' }
const sliderUnit: CSSProperties        = { fontSize: '14px', fontWeight: 500, color: C.muted }
const sliderLabels: CSSProperties      = { display: 'flex', justifyContent: 'space-between', marginTop: '8px' }
const sliderLabel: CSSProperties       = { fontSize: '11px', color: C.muted }
const validateBtnStyle: CSSProperties  = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: C.brand, border: 'none', color: C.white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }

/* ─────────────────────────────────────────────────────────────
   Styles dynamiques
───────────────────────────────────────────────────────────── */
function cardStyle(active: boolean): CSSProperties {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '16px 12px', borderRadius: '14px', cursor: 'pointer',
    border: `2px solid ${active ? C.brand : C.border}`,
    backgroundColor: active ? C.brandLight : C.white,
    fontSize: '13px', fontWeight: 600,
    color: active ? C.brand : C.fg,
    transition: 'all 0.15s ease', textAlign: 'center',
  }
}
function cardIconBox(active: boolean): CSSProperties {
  return {
    width: '40px', height: '40px', borderRadius: '10px',
    backgroundColor: active ? C.brand : C.brandLight,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
}
function progressFill(pct: number): CSSProperties {
  return { height: '100%', width: `${pct}%`, backgroundColor: C.brand, transition: 'width 0.4s ease' }
}
function tabStyle(active: boolean): CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 4px',
    fontSize: '11px', fontWeight: 600,
    color: active ? C.brand : C.muted,
    borderBottom: active ? `2px solid ${C.brand}` : '2px solid transparent',
    transition: 'all 0.2s ease',
  }
}

/* ─────────────────────────────────────────────────────────────
   Constantes de questions
───────────────────────────────────────────────────────────── */
const TYPE_BIEN_OPTIONS = [
  { value: 'appartement', label: 'Appartement', emoji: '🏢' },
  { value: 'maison',      label: 'Maison',       emoji: '🏠' },
  { value: 'terrain',     label: 'Terrain',      emoji: '🌿' },
  { value: 'commerce',    label: 'Commerce',     emoji: '🏪' },
  { value: 'immeuble',    label: 'Immeuble',     emoji: '🏗️' },
  { value: 'autre',       label: 'Autre',        emoji: '•••' },
]

const ETAT_OPTIONS = [
  { value: 'neuf',          label: 'Neuf / récent',          emoji: '🏆' },
  { value: 'tres_bon_etat', label: 'Très bon état',          emoji: '✨' },
  { value: 'bon_etat',      label: 'Bon état',               emoji: '👍' },
  { value: 'rafraichir',    label: 'À rafraîchir',           emoji: '🖌️' },
  { value: 'travaux',       label: 'Travaux importants',     emoji: '🔨' },
]

const DELAI_OPTIONS = [
  { value: 'immediat',  label: 'Immédiat',   emoji: '🔥' },
  { value: '1_3_mois',  label: '1 – 3 mois', emoji: '📅' },
  { value: '3_6_mois',  label: '3 – 6 mois', emoji: '🗓️' },
  { value: '6_mois',    label: '+6 mois',    emoji: '⏳' },
  { value: 'pas_decide',label: 'Pas décidé', emoji: '🤔' },
]

const EQUIPEMENTS_OPTIONS = [
  'Balcon', 'Terrasse', 'Parking', 'Garage', 'Cave', 'Jardin',
  'Vue exceptionnelle', 'Piscine',
]

/* ─────────────────────────────────────────────────────────────
   Logique de flow
───────────────────────────────────────────────────────────── */
function getNextQuestion(current: QuestionId, answers: VendreAnswers): QuestionId {
  switch (current) {
    case 'adresse':           return 'type_bien'
    case 'type_bien':         return answers.type_bien === 'maison' ? 'sous_type_maison' : 'surface'
    case 'sous_type_maison':  return 'surface'
    case 'surface':           return answers.type_bien === 'maison' ? 'surface_terrain' : 'nb_pieces'
    case 'surface_terrain':   return 'nb_pieces'
    case 'nb_pieces':         return 'etat'
    case 'etat':              return 'equipements'
    case 'equipements':       return 'delai'
    case 'delai':             return 'coordonnees'
    case 'coordonnees':       return 'done'
    default:                  return 'done'
  }
}

function getProgressForQuestion(q: QuestionId): number {
  const map: Record<QuestionId, number> = {
    adresse: 5, type_bien: 15, sous_type_maison: 22, surface: 30, surface_terrain: 38,
    nb_pieces: 45, etat: 55, travaux: 62, equipements: 70, sous_sol: 75,
    proprietaire: 80, situation_juridique: 85, delai: 90, coordonnees: 95, done: 100,
  }
  return map[q] ?? 0
}

function getALMessage(q: QuestionId, answers: VendreAnswers): string {
  switch (q) {
    case 'type_bien':        return `Parfait, je localise votre bien ! Quel type de bien souhaitez-vous faire estimer ?`
    case 'sous_type_maison': return `Très bien ! S'agit-il d'une maison mitoyenne ou individuelle ?`
    case 'surface':          return `Parfait ! Quelle est la surface habitable de votre bien ?`
    case 'surface_terrain':  return `C'est noté ! Quelle est la superficie totale du terrain de votre maison ?`
    case 'nb_pieces':        return `C'est noté ! Combien de pièces principales compte votre bien ? (Séjour + chambres, sans compter cuisine, salle de bain et WC)`
    case 'etat':             return `Parfait ! Quel est l'état général de votre bien ?`
    case 'equipements':      return `Très bien ! Quels équipements et atouts possède votre bien ?`
    case 'delai':            return `Compris ! Dans quel délai souhaitez-vous vendre votre bien ?`
    case 'coordonnees':      return `Parfait ! Pour finaliser votre estimation, j'ai besoin de vos coordonnées. Comment puis-je vous appeler ?`
    case 'done':             return `Merci ${answers.prenom} ! 🎉 Je prépare votre estimation personnalisée. Vous recevrez vos résultats par email sous quelques instants.`
    default:                 return ''
  }
}

function getSectionForQuestion(q: QuestionId): 'bien' | 'details' | 'projet' | 'contact' {
  if (['adresse', 'type_bien', 'sous_type_maison', 'surface', 'surface_terrain', 'nb_pieces'].includes(q)) return 'bien'
  if (['etat', 'travaux', 'equipements', 'sous_sol'].includes(q)) return 'details'
  if (['proprietaire', 'situation_juridique', 'delai'].includes(q)) return 'projet'
  return 'contact'
}

/* ─────────────────────────────────────────────────────────────
   Composant Avatar
───────────────────────────────────────────────────────────── */
function Avatar() {
  return <div style={avatarStyle}>AL</div>
}

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
export default function VendrePage() {
  const { messages, currentQuestion, answers, progress, addMessage, setAnswer, setQuestion, setProgress } = useVendreStore()
  const chatRef = useRef<HTMLDivElement>(null)
  const section = getSectionForQuestion(currentQuestion)

  // Scroll au dernier message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  function handleAnswer(key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], displayText: string) {
    setAnswer(key, value)
    addMessage({ from: 'user', text: displayText, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })
    const next = getNextQuestion(currentQuestion, { ...answers, [key]: value })
    const nextPct = getProgressForQuestion(next)
    setProgress(nextPct)
    if (next !== 'done') {
      setTimeout(() => {
        const msg = getALMessage(next, answers)
        if (msg) addMessage({ from: 'al', text: msg, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })
        setQuestion(next)
      }, 400)
    } else {
      setTimeout(() => {
        const msg = getALMessage('done', { ...answers, [key]: value })
        addMessage({ from: 'al', text: msg, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })
        setQuestion('done')
        setProgress(100)
      }, 400)
    }
  }

  const tabs = [
    { id: 'bien',    label: 'Bien',    Icon: Home },
    { id: 'details', label: 'Détails', Icon: FileText },
    { id: 'projet',  label: 'Projet',  Icon: Target },
    { id: 'contact', label: 'Contact', Icon: User },
  ]

  return (
    <div style={pageStyle}>

      {/* ── Navbar ── */}
      <header style={navStyle}>
        {/* Ligne 1 : avatar + nom + retour + tel */}
        <div style={navTopStyle}>
          <div style={navLeftStyle}>
            <Link href="/" style={backLinkStyle}>
              <ChevronLeft size={14} />
            </Link>
            <Avatar />
            <div>
              <div style={navNameStyle}>Alex Lopez</div>
              <div style={navSubStyle}>Mandataire IAD · Provence Verte</div>
            </div>
          </div>
          <a href="tel:+33613180168" style={phoneLinkStyle}>
            <Phone size={13} color={C.brand} />
            06 13 18 01 68
          </a>
        </div>

        {/* Barre de progression */}
        <div style={progressBarWrap}>
          <div style={progressFill(progress)} />
        </div>

        {/* Onglets sections */}
        <div style={progressTabs}>
          {tabs.map((tab) => {
            const active = section === tab.id
            const Icon = tab.Icon
            return (
              <div key={tab.id} style={tabStyle(active)}>
                <Icon size={13} />
                {tab.label}
              </div>
            )
          })}
          <div style={tabStyle(false)}>
            <span style= fontSize: '11px', fontWeight: 700, color: C.brand >{progress}%</span>
          </div>
        </div>
      </header>

      {/* ── Chat ── */}
      <div ref={chatRef} style={chatAreaStyle}>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.from === 'al' ? (
              <div style={msgRowAlStyle}>
                <Avatar />
                <div>
                  <div style={msgAl}>{msg.text}</div>
                  <div style={tsStyle}>{msg.timestamp}</div>
                </div>
              </div>
            ) : (
              <div style={msgRowUserStyle}>
                <div>
                  <div style={msgUser}>{msg.text}</div>
                  <div style= ...tsStyle, textAlign: 'right' >{msg.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Zone de saisie ── */}
      {currentQuestion !== 'done' && (
        <div style={inputZoneStyle}>
          <div style={inputInner}>
            <InputForQuestion
              question={currentQuestion}
              answers={answers}
              onAnswer={handleAnswer}
            />
          </div>
        </div>
      )}

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Composant de saisie selon la question
───────────────────────────────────────────────────────────── */
function InputForQuestion({ question, answers, onAnswer }: {
  question: QuestionId
  answers: VendreAnswers
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  if (question === 'adresse') return <AdresseInput onAnswer={onAnswer} />
  if (question === 'type_bien') return <CardsInput options={TYPE_BIEN_OPTIONS} onSelect={(v, l) => onAnswer('type_bien', v, l)} />
  if (question === 'sous_type_maison') return (
    <CardsInput
      options={[{ value: 'mitoyenne', label: 'Mitoyenne', emoji: '🏘️' }, { value: 'individuelle', label: 'Individuelle', emoji: '🏠' }]}
      onSelect={(v, l) => onAnswer('sous_type', v, l)}
    />
  )
  if (question === 'surface') return <SliderInput unit="m²" min={5} max={1000} defaultValue={80} label="Surface habitable" onValidate={(v) => onAnswer('surface', v, `${v} m²`)} />
  if (question === 'surface_terrain') return <SliderInput unit="m²" min={50} max={5000} defaultValue={500} label="Surface terrain" onValidate={(v) => onAnswer('surface_terrain', v, `${v} m²`)} />
  if (question === 'nb_pieces') return (
    <CardsInput
      options={['1','2','3','4','5','6+'].map((n) => ({ value: n, label: n, emoji: '' }))}
      onSelect={(v, l) => onAnswer('nb_pieces', parseInt(v) || 6, `${l} pièce${parseInt(v) > 1 ? 's' : ''}`)}
      cols={3}
    />
  )
  if (question === 'etat') return <CardsInput options={ETAT_OPTIONS} onSelect={(v, l) => onAnswer('etat', v, l)} cols={2} />
  if (question === 'equipements') return <MultiSelectInput options={EQUIPEMENTS_OPTIONS} onValidate={(selected) => onAnswer('equipements', selected, selected.length ? selected.join(', ') : 'Aucun équipement')} />
  if (question === 'delai') return <CardsInput options={DELAI_OPTIONS} onSelect={(v, l) => onAnswer('delai', v, l)} cols={2} />
  if (question === 'coordonnees') return <CoordonneesInput onAnswer={onAnswer} />
  return null
}

/* ─────────────────────────────────────────────────────────────
   Saisie adresse
───────────────────────────────────────────────────────────── */
function AdresseInput({ onAnswer }: { onAnswer: (key: keyof VendreAnswers, value: string, display: string) => void }) {
  const [val, setVal] = useState('')
  function submit() {
    if (!val.trim()) return
    onAnswer('adresse', val.trim(), val.trim())
  }
  return (
    <div style={textInputRow}>
      <input
        style= ...textInputStyle, flex: 1 
        type="text"
        placeholder="Entrez votre adresse..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        autoFocus
      />
      <button style={sendBtnStyle} onClick={submit}>
        <Send size={16} color={C.white} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Cards de choix
───────────────────────────────────────────────────────────── */
function CardsInput({ options, onSelect, cols = 2 }: {
  options: { value: string; label: string; emoji: string }[]
  onSelect: (value: string, label: string) => void
  cols?: number
}) {
  const gridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }
  return (
    <div style={gridStyle}>
      {options.map((opt) => (
        <button key={opt.value} style={cardStyle(false)} onClick={() => onSelect(opt.value, opt.label)}>
          {opt.emoji && <span style= fontSize: '20px' >{opt.emoji}</span>}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Slider
───────────────────────────────────────────────────────────── */
function SliderInput({ unit, min, max, defaultValue, label, onValidate }: {
  unit: string; min: number; max: number; defaultValue: number
  label: string; onValidate: (v: number) => void
}) {
  const [val, setVal] = useState(defaultValue)
  return (
    <div style={sliderWrap}>
      <div style={sliderValueRow}>
        <div style={sliderValBox}>{val}</div>
        <span style={sliderUnit}>{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style= width: '100%', accentColor: C.brand 
      />
      <div style={sliderLabels}>
        <span style={sliderLabel}>{min} {unit}</span>
        <span style={sliderLabel}>{max} {unit}</span>
      </div>
      <button style={validateBtnStyle} onClick={() => onValidate(val)}>
        <Send size={14} /> Valider
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Multi-select
───────────────────────────────────────────────────────────── */
function MultiSelectInput({ options, onValidate }: {
  options: string[]
  onValidate: (selected: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  function toggle(opt: string) {
    setSelected((prev) => prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt])
  }
  return (
    <div>
      <div style={cardsGrid}>
        {options.map((opt) => {
          const active = selected.includes(opt)
          const checkStyle: CSSProperties = {
            width: '18px', height: '18px', borderRadius: '4px',
            border: `2px solid ${active ? C.brand : C.border}`,
            backgroundColor: active ? C.brand : C.white,
            flexShrink: 0,
          }
          const rowStyle: CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
            border: `1.5px solid ${active ? C.brand : C.border}`,
            backgroundColor: active ? C.brandLight : C.white,
            fontSize: '13px', fontWeight: 500, color: active ? C.brand : C.fg,
          }
          return (
            <div key={opt} style={rowStyle} onClick={() => toggle(opt)}>
              <div style={checkStyle} />
              <span>{opt}</span>
            </div>
          )
        })}
      </div>
      <button style= ...validateBtnStyle, marginTop: '12px'  onClick={() => onValidate(selected)}>
        {selected.length === 0 ? 'Aucun équipement' : `Valider (${selected.length} sélectionné${selected.length > 1 ? 's' : ''})`}
        <Send size={14} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Coordonnées
───────────────────────────────────────────────────────────── */
function CoordonneesInput({ onAnswer }: {
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const valid = prenom.trim() && nom.trim() && tel.trim() && email.trim()

  const coordWrap: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' }
  const coordRow: CSSProperties  = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }

  function submit() {
    if (!valid) return
    onAnswer('prenom', prenom.trim(), '')
    onAnswer('nom', nom.trim(), '')
    onAnswer('telephone', tel.trim(), '')
    onAnswer('email', email.trim(), `${prenom} ${nom}`)
  }

  return (
    <div style={coordWrap}>
      <div style={coordRow}>
        <input style={textInputStyle} placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <input style={textInputStyle} placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <input style={textInputStyle} type="tel" placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />
      <input style={textInputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button
        style= ...validateBtnStyle, opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' 
        onClick={submit}
        disabled={!valid}
      >
        Obtenir mon estimation <Send size={14} />
      </button>
    </div>
  )
}
