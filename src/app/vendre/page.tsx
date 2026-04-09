'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useVendreStore } from '@/stores/vendreStore'
import type { VendreAnswers, QuestionId } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Check, MapPin, RefreshCw } from 'lucide-react'
import Link from 'next/link'

/* ─── Tokens ─── */
const brand      = '#0066FF'
const brandLight = '#EFF6FF'
const fg         = '#0F172A'
const muted      = '#64748B'
const border     = '#E2E8F0'
const surface    = '#F8FAFC'
const white      = '#ffffff'
const success    = '#10B981'
const warning    = '#F59E0B'
const W          = '680px'

/* ─── Styles statiques ─── */
const pageSt: CSSProperties      = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const navSt: CSSProperties       = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: '1px solid ' + border }
const navTopSt: CSSProperties    = { maxWidth: W, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeftSt: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarSt: CSSProperties    = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }
const navNameSt: CSSProperties   = { fontSize: '14px', fontWeight: 700, color: fg }
const navSubSt: CSSProperties    = { fontSize: '11px', color: muted }
const backSt: CSSProperties      = { display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: muted, textDecoration: 'none' }
const phoneSt: CSSProperties     = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: fg, textDecoration: 'none' }
const chatWrap: CSSProperties    = { maxWidth: W, margin: '0 auto', padding: '148px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }
const rowAl: CSSProperties       = { display: 'flex', gap: '10px', alignItems: 'flex-end' }
const rowUser: CSSProperties     = { display: 'flex', justifyContent: 'flex-end' }
const bubbleAl: CSSProperties    = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', fontSize: '14px', color: fg, lineHeight: 1.65, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '84%' }
const bubbleUser: CSSProperties  = { backgroundColor: brand, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: white, lineHeight: 1.5, overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '80%', minWidth: '60px' }
const tsLeft: CSSProperties      = { fontSize: '10px', color: muted, marginTop: '4px' }
const tsRight: CSSProperties     = { fontSize: '10px', color: muted, marginTop: '4px', textAlign: 'right' }
const inlineZone: CSSProperties  = { marginTop: '8px' }
const inputRow: CSSProperties    = { display: 'flex', gap: '10px', alignItems: 'center' }
const inputSt: CSSProperties     = { flex: 1, fontSize: '14px', color: fg, border: '1.5px solid ' + border, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const inputFull: CSSProperties   = { width: '100%', fontSize: '14px', color: fg, border: '1.5px solid ' + border, borderRadius: '12px', padding: '12px 14px', outline: 'none', backgroundColor: white, boxSizing: 'border-box' }
const sendBtnSt: CSSProperties   = { width: '42px', height: '42px', borderRadius: '12px', backgroundColor: brand, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const suggestWrap: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '12px', overflow: 'hidden', marginTop: '6px' }
const suggestBase: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', fontSize: '13px', color: fg, cursor: 'pointer' }
const loadingSt: CSSProperties   = { fontSize: '11px', color: muted, marginTop: '6px' }
const validateBtn: CSSProperties = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: brand, border: 'none', color: white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const validateOff: CSSProperties = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: border, border: 'none', color: muted, fontSize: '14px', fontWeight: 600, cursor: 'not-allowed', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
const sliderWrap: CSSProperties  = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px' }
const sliderValRow: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }
const sliderValBox: CSSProperties = { border: '1.5px solid ' + border, borderRadius: '10px', padding: '8px 16px', fontSize: '18px', fontWeight: 700, color: fg, minWidth: '80px', textAlign: 'center' }
const sliderUnit: CSSProperties  = { fontSize: '14px', fontWeight: 500, color: muted }
const sliderLabels: CSSProperties = { display: 'flex', justifyContent: 'space-between', marginTop: '8px' }
const sliderLbl: CSSProperties   = { fontSize: '11px', color: muted }
const sliderInp: CSSProperties   = { width: '100%', accentColor: brand } as CSSProperties
const multiGrid: CSSProperties   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const emojiSt: CSSProperties     = { fontSize: '20px' }

/* Stepper */
const stepperWrap: CSSProperties = { maxWidth: W, margin: '0 auto', padding: '10px 20px 12px', display: 'flex', alignItems: 'center' }
const stepCol: CSSProperties     = { display: 'flex', flexDirection: 'column', alignItems: 'center' }
const stepLbl: CSSProperties     = { fontSize: '10px', fontWeight: 600, marginTop: '5px', textAlign: 'center' }
const dotBase: CSSProperties     = { width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, transition: 'all 0.3s ease' }
const dotDone: CSSProperties     = { ...dotBase, backgroundColor: brand, color: white, border: '2px solid ' + brand }
const dotCurr: CSSProperties     = { ...dotBase, backgroundColor: brandLight, color: brand, border: '2px solid ' + brand }
const dotFutu: CSSProperties     = { ...dotBase, backgroundColor: white, color: muted, border: '2px solid ' + border }
const lblDone: CSSProperties     = { ...stepLbl, color: fg }
const lblCurr: CSSProperties     = { ...stepLbl, color: brand, fontWeight: 700 }
const lblFutu: CSSProperties     = { ...stepLbl, color: muted }
const connOut: CSSProperties     = { flex: 1, height: '3px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden', margin: '0 4px', marginBottom: '15px' }
const connOn: CSSProperties      = { height: '100%', width: '100%', backgroundColor: brand, borderRadius: '999px' }
const connOff: CSSProperties     = { height: '100%', width: '0%', backgroundColor: brand, borderRadius: '999px' }

/* Coordonnées */
const coordWrap: CSSProperties   = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }
const coordGrid: CSSProperties   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const coordHdr: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }
const coordBadge: CSSProperties  = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '999px', backgroundColor: brandLight, fontSize: '14px' }
const coordTitle: CSSProperties  = { fontSize: '15px', fontWeight: 700, color: fg }
const coordSub: CSSProperties    = { fontSize: '12px', fontWeight: 300, color: muted, marginBottom: '4px' }
const civilGrid: CSSProperties   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }
const rgpdWrap: CSSProperties    = { border: '1.5px solid ' + border, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }
const rgpdWrapErr: CSSProperties = { border: '1.5px solid ' + warning, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', backgroundColor: '#fffbeb' }
const rgpdBox: CSSProperties     = { width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + border, backgroundColor: white, flexShrink: 0, marginTop: '1px' }
const rgpdBoxOn: CSSProperties   = { width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + brand, backgroundColor: brand, flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const rgpdText: CSSProperties    = { fontSize: '12px', fontWeight: 400, color: fg, lineHeight: 1.5 }
const rgpdBold: CSSProperties    = { fontWeight: 600 }
const rgpdErr: CSSProperties     = { fontSize: '11px', fontWeight: 600, color: warning, display: 'flex', alignItems: 'center', gap: '4px' }

/* Calcul loading */
const calculPage: CSSProperties  = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }
const calculIcon: CSSProperties  = { width: '72px', height: '72px', borderRadius: '999px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '32px' }
const calculTitle: CSSProperties = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.02em', marginBottom: '8px', textAlign: 'center' }
const calculSub: CSSProperties   = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '32px', textAlign: 'center' }
const calculSteps: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px', marginBottom: '28px' }
const calculStepRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px' }
const calculStepTxtOn: CSSProperties  = { fontSize: '14px', fontWeight: 600, color: fg }
const calculStepTxtOff: CSSProperties = { fontSize: '14px', fontWeight: 400, color: muted }
const calculBar: CSSProperties   = { width: '100%', maxWidth: '320px', height: '4px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden' }

/* Vérification */
const verifPage: CSSProperties   = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const verifNav: CSSProperties    = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const verifWrap: CSSProperties   = { maxWidth: '500px', margin: '0 auto', padding: '40px 20px 60px', textAlign: 'center' as const }
const verifIcon: CSSProperties   = { width: '64px', height: '64px', borderRadius: '999px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }
const verifTitle: CSSProperties  = { fontSize: '20px', fontWeight: 900, color: fg, letterSpacing: '-0.02em', marginBottom: '8px' }
const verifSub: CSSProperties    = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '28px', lineHeight: 1.6 }
const verifCard: CSSProperties   = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px', textAlign: 'left' as const, marginBottom: '16px' }
const verifCardTitle: CSSProperties = { fontSize: '13px', fontWeight: 700, color: fg, marginBottom: '12px' }
const verifRadioWrap: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }
const verifRadioOff: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '2px solid ' + border, cursor: 'pointer' }
const verifRadioOn: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '2px solid ' + brand, backgroundColor: brandLight, cursor: 'pointer' }
const verifDot: CSSProperties    = { width: '18px', height: '18px', borderRadius: '999px', border: '2px solid ' + border, flexShrink: 0 }
const verifDotOn: CSSProperties  = { width: '18px', height: '18px', borderRadius: '999px', border: '6px solid ' + brand, flexShrink: 0 }
const verifBadge: CSSProperties  = { backgroundColor: '#d1fae5', color: success, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: 'auto' }
const verifNote: CSSProperties   = { fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.6, textAlign: 'center' as const, marginBottom: '20px' }

/* ─── Fonctions style dynamique ─── */
function cardSt(active: boolean): CSSProperties {
  return { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 10px', borderRadius: '14px', cursor: 'pointer', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brandLight : white, fontSize: '13px', fontWeight: 600, color: active ? brand : fg, textAlign: 'center', width: '100%' }
}
function multiRowSt(active: boolean): CSSProperties {
  return { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', cursor: 'pointer', border: '1.5px solid ' + (active ? brand : border), backgroundColor: active ? brandLight : white, fontSize: '13px', fontWeight: 500, color: active ? brand : fg }
}
function checkSt(active: boolean): CSSProperties {
  return { width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brand : white, flexShrink: 0 }
}
function civilBtnSt(active: boolean): CSSProperties {
  return { flex: 1, padding: '11px', borderRadius: '12px', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brand : white, color: active ? white : fg, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }
}
function suggestItemSt(last: boolean): CSSProperties {
  return { ...suggestBase, borderBottom: last ? 'none' : '1px solid ' + border }
}
function calculFillSt(pct: number): CSSProperties {
  return { height: '100%', width: pct + '%', backgroundColor: brand, borderRadius: '999px', transition: 'width 0.8s ease' }
}
function stepIconSt(active: boolean, done: boolean): CSSProperties {
  return { width: '24px', height: '24px', borderRadius: '999px', backgroundColor: done ? success : active ? brand : border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.4s ease' }
}

/* ─── Stepper ─── */
const STEPS = [
  { n: 1, label: 'Bien',    questions: ['adresse','type_bien','sous_type_maison','surface','surface_terrain','nb_pieces'] },
  { n: 2, label: 'Détails', questions: ['etat','equipements'] },
  { n: 3, label: 'Projet',  questions: ['delai','recapitulatif'] },
  { n: 4, label: 'Contact', questions: ['coordonnees','done'] },
]
function getCurrentStep(q: QuestionId): number {
  for (const s of STEPS) { if (s.questions.includes(q)) return s.n }
  return 1
}
function Stepper({ currentQ }: { currentQ: QuestionId }) {
  const cs = getCurrentStep(currentQ)
  return (
    <div style={stepperWrap}>
      {STEPS.map((step, i) => {
        const st = step.n < cs ? 'done' : step.n === cs ? 'current' : 'future'
        return (
          <>
            <div key={step.n} style={stepCol}>
              <div style={st === 'done' ? dotDone : st === 'current' ? dotCurr : dotFutu}>
                {st === 'done' ? <Check size={12} color={white} strokeWidth={3} /> : step.n}
              </div>
              <span style={st === 'done' ? lblDone : st === 'current' ? lblCurr : lblFutu}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={connOut}><div style={step.n < cs ? connOn : connOff} /></div>
            )}
          </>
        )
      })}
    </div>
  )
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

const BIEN_LBL: Record<string, string>  = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', immeuble: 'Immeuble', autre: 'Autre' }
const ETAT_LBL: Record<string, string>  = { neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état', rafraichir: 'À rafraîchir', travaux: 'Travaux importants' }
const DELAI_LBL: Record<string, string> = { immediat: 'Immédiat', '1_3_mois': '1 – 3 mois', '3_6_mois': '3 – 6 mois', '6_mois': '+6 mois', pas_decide: 'Pas décidé' }

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
    case 'delai':            return 'recapitulatif'
    case 'recapitulatif':    return 'coordonnees'
    default:                 return 'done'
  }
}

function buildRecap(a: VendreAnswers): string {
  const typeLbl = BIEN_LBL[a.type_bien ?? ''] ?? a.type_bien ?? 'Bien'
  let desc = '🏑 ' + typeLbl
  if (a.surface) desc += ' de ' + a.surface + 'm²'
  if (a.nb_pieces) desc += ', ' + a.nb_pieces + ' pièce' + (Number(a.nb_pieces) > 1 ? 's' : '')
  if (a.surface_terrain) desc += ', terrain ' + a.surface_terrain + 'm²'
  if (a.equipements && a.equipements.length > 0) desc += ' + ' + a.equipements.join(', ')

  const parts = ['Très bien, récapitulons ensemble votre bien 📋\n\nVoici le récapitulatif de votre bien :\n', desc]
  if (a.adresse) parts.push('📍 ' + a.adresse)
  if (a.etat) parts.push('🔧 ' + (ETAT_LBL[a.etat] ?? a.etat))
  if (a.delai) parts.push('🗓 Vente souhaitée : ' + (DELAI_LBL[a.delai] ?? a.delai))
  parts.push('\nEst-ce que ces informations sont correctes ?')
  return parts.join('\n')
}

function getMsg(q: QuestionId, a: VendreAnswers): string {
  if (q === 'recapitulatif') return buildRecap(a)
  switch (q) {
    case 'type_bien':     return "Parfait, je localise votre bien ! Quel type de bien souhaitez-vous faire estimer ?"
    case 'sous_type_maison': return "Très bien ! S'agit-il d'une maison mitoyenne ou individuelle ?"
    case 'surface':       return "Parfait ! Quelle est la surface habitable de votre bien ?"
    case 'surface_terrain': return "C'est noté ! Quelle est la superficie totale du terrain de votre maison ?"
    case 'nb_pieces':     return "C'est noté ! Combien de pièces principales compte votre bien ?\n(Séjour + chambres, sans compter cuisine, salle de bain et WC)"
    case 'etat':          return "Compris ! Quel est l'état général de votre bien ?"
    case 'equipements':   return "Très bien ! Quels équipements et atouts possède votre bien ?"
    case 'delai':         return "Compris ! Dans quel délai souhaitez-vous vendre votre bien ?"
    case 'coordonnees':   return "Parfait ! Pour finaliser votre estimation, j'ai besoin de vos coordonnées."
    default:              return ''
  }
}

function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function Avatar() { return <div style={avatarSt}>AL</div> }

/* ─── Types UI ─── */
type UiState = 'chat' | 'calcul' | 'verification'

/* ─── Page principale ─── */
export default function VendrePage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion } = useVendreStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [uiState, setUiState]       = useState<UiState>('chat')
  const [redirectToken, setToken]   = useState('')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function handleAnswer(key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) {
    const newAnswers = { ...answers, [key]: value }
    setAnswer(key, value)
    if (display) addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion, newAnswers)
    setTimeout(() => {
      const msg = getMsg(next, newAnswers)
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 350)
  }

  function handleFinalSubmit(prenom: string, nom: string, tel: string, email: string, civilite: 'monsieur' | 'madame') {
    setAnswer('prenom', prenom)
    setAnswer('nom', nom)
    setAnswer('telephone', tel)
    setAnswer('email', email)
    setAnswer('civilite', civilite)
    addMessage({ from: 'user', text: prenom + ' ' + nom, timestamp: ts() })
    const token = crypto.randomUUID()
    setToken(token)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...answers, prenom, nom, telephone: tel, email, civilite, token, type: 'vendre' }),
    }).catch(() => null)
    setUiState('calcul')
  }

  const handleCalculComplete = useCallback(() => {
    const userSurface = answers.surface_terrain
    const cadSurface  = answers.cadastre_surface
    if (cadSurface && userSurface && Math.abs(cadSurface - userSurface) / userSurface > 0.12) {
      setUiState('verification')
    } else {
      router.push('/resultats/' + redirectToken)
    }
  }, [answers, redirectToken, router])

  function handleVerificationComplete() {
    router.push('/resultats/' + redirectToken)
  }

  /* ─ Rendu ─ */
  if (uiState === 'calcul') {
    return <CalculLoading onComplete={handleCalculComplete} />
  }
  if (uiState === 'verification') {
    return (
      <VerificationDonnees
        userSurface={answers.surface_terrain ?? 0}
        officialSurface={answers.cadastre_surface ?? 0}
        onChoose={(chosen) => { setAnswer('surface_terrain', chosen); handleVerificationComplete() }}
      />
    )
  }

  return (
    <div style={pageSt}>
      <header style={navSt}>
        <div style={navTopSt}>
          <div style={navLeftSt}>
            <Link href="/" style={backSt}><ChevronLeft size={14} /></Link>
            <Avatar />
            <div>
              <div style={navNameSt}>Alex Lopez</div>
              <div style={navSubSt}>Mandataire IAD · Provence Verte</div>
            </div>
          </div>
          <a href="tel:+33613180168" style={phoneSt}>
            <Phone size={13} color={brand} /> 06 13 18 01 68
          </a>
        </div>
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

/* ─── InputZone ─── */
function InputZone({ question, answers, onAnswer, onFinalSubmit }: {
  question: QuestionId
  answers: VendreAnswers
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
  onFinalSubmit: (prenom: string, nom: string, tel: string, email: string, civilite: 'monsieur' | 'madame') => void
}) {
  const { setAnswer, setQuestion, addMessage } = useVendreStore()

  if (question === 'adresse') return <AdresseInput onAnswer={onAnswer} />
  if (question === 'type_bien') return <Cards options={TYPE_BIEN} cols={2} onSelect={(v, l) => onAnswer('type_bien', v, l)} />
  if (question === 'sous_type_maison') return (
    <Cards
      options={[{ value: 'mitoyenne', label: 'Mitoyenne', emoji: '🏘️' }, { value: 'individuelle', label: 'Individuelle', emoji: '🏠' }]}
      cols={2} onSelect={(v, l) => onAnswer('sous_type', v, l)}
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
  if (question === 'recapitulatif') return (
    <RecapInput
      onConfirm={() => {
        addMessage({ from: 'user', text: "C'est correct ✓", timestamp: ts() })
        setTimeout(() => {
          const msg = getMsg('coordonnees', answers)
          if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
          setQuestion('coordonnees')
        }, 350)
      }}
      onModify={() => {
        addMessage({ from: 'user', text: 'Je veux modifier', timestamp: ts() })
        setTimeout(() => {
          addMessage({ from: 'al', text: "Pas de problème ! Par quelle information souhaitez-vous commencer ?", timestamp: ts() })
          setQuestion('type_bien')
        }, 350)
      }}
    />
  )
  if (question === 'coordonnees') return <CoordonneesFull onFinalSubmit={onFinalSubmit} />
  return null
}

/* ─── Adresse + cadastre ─── */
interface Suggestion { label: string; lat: number; lng: number }
const API_ADRESSE = 'https://api-adresse.data.gouv.fr/search/'

function AdresseInput({ onAnswer }: {
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
}) {
  const [val, setVal]         = useState('')
  const [suggestions, setSug] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const timer                 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { setAnswer }         = useVendreStore()

  async function fetchSug(q: string) {
    if (q.length < 3) { setSug([]); return }
    setLoading(true)
    try {
      const res  = await fetch(API_ADRESSE + '?q=' + encodeURIComponent(q) + '&limit=5')
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSug(data.features.map((f: any) => ({ label: f.properties.label, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] })))
    } catch { setSug([]) } finally { setLoading(false) }
  }

  async function fetchCadastre(lat: number, lng: number) {
    try {
      const res = await fetch('/api/cadastre?lat=' + lat + '&lng=' + lng)
      if (res.ok) {
        const data = await res.json()
        if (data.surface) setAnswer('cadastre_surface', data.surface)
      }
    } catch { /* ignore */ }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => fetchSug(e.target.value), 300)
  }

  function pick(s: Suggestion) {
    setSug([])
    setVal(s.label)
    setAnswer('lat', s.lat)
    setAnswer('lng', s.lng)
    fetchCadastre(s.lat, s.lng)  // en arrière-plan
    onAnswer('adresse', s.label, s.label)
  }

  function submit() {
    if (!val.trim()) return
    setSug([])
    onAnswer('adresse', val.trim(), val.trim())
  }

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
              <MapPin size={13} color={brand} />{s.label}
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
      <div style={sliderLabels}><span style={sliderLbl}>{min} {unit}</span><span style={sliderLbl}>{max} {unit}</span></div>
      <button style={validateBtn} onClick={() => onValidate(val)}><Send size={14} /> Valider</button>
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
              <div style={checkSt(active)} /><span>{o}</span>
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

/* ─── Récapitulatif ─── */
const recapGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }

function RecapInput({ onConfirm, onModify }: { onConfirm: () => void; onModify: () => void }) {
  const confirmSt: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 14px', borderRadius: '14px', cursor: 'pointer', border: '2px solid ' + success, backgroundColor: '#f0fdf4', fontSize: '13px', fontWeight: 600, color: success, textAlign: 'center', width: '100%' }
  const modifySt: CSSProperties  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 14px', borderRadius: '14px', cursor: 'pointer', border: '2px solid ' + border, backgroundColor: white, fontSize: '13px', fontWeight: 600, color: fg, textAlign: 'center', width: '100%' }
  return (
    <div style={recapGrid}>
      <button style={confirmSt} onClick={onConfirm}>
        <Check size={20} color={success} />
        C&apos;est correct ✓
      </button>
      <button style={modifySt} onClick={onModify}>
        <RefreshCw size={20} color={muted} />
        Je veux modifier
      </button>
    </div>
  )
}

/* ─── Coordonnées améliorées ─── */
function CoordonneesFull({ onFinalSubmit }: {
  onFinalSubmit: (prenom: string, nom: string, tel: string, email: string, civilite: 'monsieur' | 'madame') => void
}) {
  const [civilite, setCivilite] = useState<'monsieur' | 'madame'>('monsieur')
  const [prenom, setPrenom]     = useState('')
  const [nom, setNom]           = useState('')
  const [email, setEmail]       = useState('')
  const [tel, setTel]           = useState('')
  const [rgpd, setRgpd]         = useState(false)
  const [showRgpdErr, setRgpdErr] = useState(false)

  const valid = !!(prenom.trim() && nom.trim() && (email.trim() || tel.trim()))

  function submit() {
    if (!rgpd) { setRgpdErr(true); return }
    if (!valid) return
    onFinalSubmit(prenom.trim(), nom.trim(), tel.trim(), email.trim(), civilite)
  }

  return (
    <div style={coordWrap}>
      {/* En-tête */}
      <div style={coordHdr}>
        <div style={coordBadge}>✨</div>
        <div>
          <div style={coordTitle}>Dernière étape !</div>
          <div style={coordSub}>Recevez votre estimation personnalisée</div>
        </div>
      </div>

      {/* Civilité */}
      <div style={civilGrid}>
        <button style={civilBtnSt(civilite === 'monsieur')} onClick={() => setCivilite('monsieur')}>Monsieur</button>
        <button style={civilBtnSt(civilite === 'madame')}   onClick={() => setCivilite('madame')}>Madame</button>
      </div>

      {/* Prénom + Nom */}
      <div style={coordGrid}>
        <input style={inputFull} placeholder="Prénom *" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <input style={inputFull} placeholder="Nom *"    value={nom}    onChange={(e) => setNom(e.target.value)} />
      </div>

      {/* Email */}
      <input style={inputFull} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {/* Tél */}
      <input style={inputFull} type="tel" placeholder="Téléphone" value={tel} onChange={(e) => setTel(e.target.value)} />

      {/* RGPD */}
      <div style={showRgpdErr ? rgpdWrapErr : rgpdWrap} onClick={() => { setRgpd(!rgpd); setRgpdErr(false) }}>
        <div style={rgpd ? rgpdBoxOn : rgpdBox}>
          {rgpd && <Check size={11} color={white} strokeWidth={3} />}
        </div>
        <p style={rgpdText}>
          <span style={rgpdBold}>J&apos;accepte</span> que mes données soient transmises au professionnel immobilier pour être recontacté.
          Politique de confidentialité.
        </p>
      </div>
      {showRgpdErr && <p style={rgpdErr}>⚠️ Requis pour continuer</p>}

      <button style={valid && rgpd ? validateBtn : validateOff} onClick={submit} disabled={!valid}>
        Voir mon estimation →
      </button>
    </div>
  )
}

/* ─── Écran calcul animé ─── */
const CALCUL_STEPS = [
  'Recherche des ventes récentes...',
  'Analyse du marché local',
  'Calcul de votre estimation',
]

function CalculLoading({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const [pct, setPct]               = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => { setActiveStep(1); setPct(33) },  800),
      setTimeout(() => { setActiveStep(2); setPct(66) },  1800),
      setTimeout(() => { setActiveStep(3); setPct(100) }, 2700),
      setTimeout(() => onComplete(), 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div style={calculPage}>
      <div style={calculIcon}>🏠</div>
      <h1 style={calculTitle}>Calcul de votre estimation</h1>
      <p style={calculSub}>Analyse des ventes récentes dans votre secteur</p>

      <div style={calculSteps}>
        {CALCUL_STEPS.map((label, i) => {
          const done   = activeStep > i + 1
          const active = activeStep === i + 1
          return (
            <div key={i} style={calculStepRow}>
              <div style={stepIconSt(active, done)}>
                {done
                  ? <Check size={11} color={white} strokeWidth={3} />
                  : active
                    ? <div style=157 />
                    : null
                }
              </div>
              <span style={active || done ? calculStepTxtOn : calculStepTxtOff}>{label}</span>
            </div>
          )
        })}
      </div>

      <div style={calculBar}>
        <div style={calculFillSt(pct)} />
      </div>
    </div>
  )
}

/* ─── Vérification données officielles ─── */
function VerificationDonnees({ userSurface, officialSurface, onChoose }: {
  userSurface: number
  officialSurface: number
  onChoose: (surface: number) => void
}) {
  const [chosen, setChosen] = useState<'user' | 'official'>('official')
  return (
    <div style={verifPage}>
      <header style={verifNav}>
        <div style={avatarSt}>AL</div>
      </header>
      <main style={verifWrap}>
        <div style={verifIcon}>🛡️</div>
        <h1 style={verifTitle}>Vérification des informations</h1>
        <p style={verifSub}>
          Nous avons récupéré des données officielles qui diffèrent de certaines informations que vous avez indiquées.
        </p>

        <div style={verifCard}>
          <p style={verifCardTitle}>Surface terrain</p>
          <div style={verifRadioWrap}>
            <div style={chosen === 'user' ? verifRadioOn : verifRadioOff} onClick={() => setChosen('user')}>
              <div style={chosen === 'user' ? verifDotOn : verifDot} />
              <span>Vos informations : {userSurface} m²</span>
            </div>
            <div style={chosen === 'official' ? verifRadioOn : verifRadioOff} onClick={() => setChosen('official')}>
              <div style={chosen === 'official' ? verifDotOn : verifDot} />
              <span>Données officielles (Cadastre IGN) : {officialSurface} m²</span>
              <span style={verifBadge}>Recommandé</span>
            </div>
          </div>
        </div>

        <p style={verifNote}>
          Les données officielles proviennent de sources gouvernementales et sont généralement plus précises.
        </p>

        <button style={validateBtn} onClick={() => onChoose(chosen === 'official' ? officialSurface : userSurface)}>
          Valider et voir mon estimation →
        </button>
      </main>
    </div>
  )
}
