'use client'

import { Fragment, useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useVendreStore } from '@/stores/vendreStore'
import type { VendreAnswers, QuestionId } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, Send, Check, MapPin, Edit3, Zap, Map } from 'lucide-react'
import Link from 'next/link'

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
const bubbleAl: CSSProperties    = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px 16px 16px 4px', padding: '14px 16px', fontSize: '14px', color: fg, lineHeight: 1.65, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word', maxWidth: '84%' }
const bubbleUser: CSSProperties  = { backgroundColor: brand, borderRadius: '16px 16px 4px 16px', padding: '10px 16px', fontSize: '14px', fontWeight: 500, color: white, lineHeight: 1.5, overflowWrap: 'break-word', wordBreak: 'break-word', maxWidth: '80%', minWidth: '60px' }
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
const coordWrap: CSSProperties   = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }
const coordGrid: CSSProperties   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const coordHdr: CSSProperties    = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }
const coordBadge: CSSProperties  = { width: '32px', height: '32px', borderRadius: '999px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }
const coordTitle: CSSProperties  = { fontSize: '15px', fontWeight: 700, color: fg }
const coordSub: CSSProperties    = { fontSize: '12px', fontWeight: 300, color: muted }
const civilRow: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }
const rgpdRow: CSSProperties     = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', borderRadius: '12px', cursor: 'pointer' }
const rgpdTxt: CSSProperties     = { fontSize: '12px', fontWeight: 400, color: fg, lineHeight: 1.5 }
const rgpdLinkSt: CSSProperties  = { color: brand, textDecoration: 'underline', cursor: 'pointer' }
const rgpdErrTxt: CSSProperties  = { fontSize: '11px', fontWeight: 600, color: warning, marginTop: '4px' }

/* Adresse info cards */
const infoCardGray: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#f1f5f9', marginTop: '8px' }
const infoCardYellow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#fefce8', border: '1px solid #fde047', marginTop: '6px' }
const infoTxt: CSSProperties        = { fontSize: '13px', fontWeight: 500, color: fg }
const dpeBadgeSt: CSSProperties     = { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: 'auto', backgroundColor: '#dbeafe', color: brand }
const ignBadgeSt: CSSProperties     = { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: 'auto', backgroundColor: '#fef9c3', color: '#854d0e' }

/* Stepper */
const stepperWrap: CSSProperties = { maxWidth: W, margin: '0 auto', padding: '10px 20px 12px', display: 'flex', alignItems: 'center' }
const stepCol: CSSProperties     = { display: 'flex', flexDirection: 'column', alignItems: 'center' }
const stepLbl: CSSProperties     = { fontSize: '10px', fontWeight: 600, marginTop: '5px', textAlign: 'center' }
const dotBase: CSSProperties     = { width: '28px', height: '28px', borderRadius: '999px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }
const dotDone: CSSProperties     = { ...dotBase, backgroundColor: brand, color: white, border: '2px solid ' + brand }
const dotCurr: CSSProperties     = { ...dotBase, backgroundColor: brandLight, color: brand, border: '2px solid ' + brand }
const dotFutu: CSSProperties     = { ...dotBase, backgroundColor: white, color: muted, border: '2px solid ' + border }
const lblDone: CSSProperties     = { ...stepLbl, color: fg }
const lblCurr: CSSProperties     = { ...stepLbl, color: brand, fontWeight: 700 }
const lblFutu: CSSProperties     = { ...stepLbl, color: muted }
const connOut: CSSProperties     = { flex: 1, height: '3px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden', margin: '0 4px', marginBottom: '15px' }
const connOn: CSSProperties      = { height: '100%', width: '100%', backgroundColor: brand, borderRadius: '999px' }
const connOff: CSSProperties     = { height: '100%', width: '0%', backgroundColor: brand, borderRadius: '999px' }

/* Calcul */
const calculPage: CSSProperties  = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }
const calculIcon: CSSProperties  = { width: '72px', height: '72px', borderRadius: '999px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '32px' }
const calculTitle: CSSProperties = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.02em', marginBottom: '8px', textAlign: 'center' }
const calculSub: CSSProperties   = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '32px', textAlign: 'center' }
const calculSteps: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px', marginBottom: '28px' }
const calculStepRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px' }
const calculBar: CSSProperties   = { width: '100%', maxWidth: '320px', height: '4px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden' }
const calculStepTxtOn: CSSProperties  = { fontSize: '14px', fontWeight: 600, color: fg }
const calculStepTxtOff: CSSProperties = { fontSize: '14px', fontWeight: 400, color: muted }
const spinnerDotSt: CSSProperties = { width: '8px', height: '8px', borderRadius: '999px', backgroundColor: white }

/* Verification */
const verifPage: CSSProperties   = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const verifNav: CSSProperties    = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
const verifWrap: CSSProperties   = { maxWidth: '500px', margin: '0 auto', padding: '40px 20px 60px' }
const verifIconSt: CSSProperties = { width: '64px', height: '64px', borderRadius: '999px', backgroundColor: brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }
const verifTitle: CSSProperties  = { fontSize: '20px', fontWeight: 900, color: fg, letterSpacing: '-0.02em', marginBottom: '8px', textAlign: 'center' }
const verifSub: CSSProperties    = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '28px', lineHeight: 1.6, textAlign: 'center' }
const verifCard: CSSProperties   = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px', marginBottom: '16px' }
const verifCardTitle: CSSProperties = { fontSize: '13px', fontWeight: 700, color: fg, marginBottom: '12px' }
const verifRadioOff: CSSProperties  = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '2px solid ' + border, cursor: 'pointer', marginBottom: '8px' }
const verifRadioOn: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '2px solid ' + brand, backgroundColor: brandLight, cursor: 'pointer', marginBottom: '8px' }
const verifDot: CSSProperties    = { width: '18px', height: '18px', borderRadius: '999px', border: '2px solid ' + border, flexShrink: 0 }
const verifDotOn: CSSProperties  = { width: '18px', height: '18px', borderRadius: '999px', border: '6px solid ' + brand, flexShrink: 0 }
const verifBadge: CSSProperties  = { backgroundColor: '#d1fae5', color: success, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', marginLeft: 'auto' }
const verifNote: CSSProperties   = { fontSize: '11px', fontWeight: 300, color: muted, lineHeight: 1.6, textAlign: 'center', marginBottom: '20px' }
const verifTxtSt: CSSProperties  = { fontSize: '13px', fontWeight: 500, color: fg }

/* -------- Styles dynamiques -------- */
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
function stepIconSt(done: boolean, active: boolean): CSSProperties {
  return { width: '22px', height: '22px', borderRadius: '999px', backgroundColor: done ? success : active ? brand : border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.4s ease' }
}
function rgpdRowSt(active: boolean, showErr: boolean): CSSProperties {
  return { ...rgpdRow, border: '1.5px solid ' + (showErr ? warning : active ? brand : border), backgroundColor: showErr ? '#fffbeb' : active ? brandLight : white }
}
function rgpdBoxSt(active: boolean): CSSProperties {
  return { width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + (active ? brand : border), backgroundColor: active ? brand : white, flexShrink: 0, marginTop: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
}

/* -------- Stepper — Fragment avec key -------- */
const STEPS = [
  { n: 1, label: 'Bien',    qs: ['adresse','type_bien','sous_type_maison','surface','surface_terrain','nb_pieces'] },
  { n: 2, label: 'D\u00e9tails', qs: ['etat','equipements'] },
  { n: 3, label: 'Projet',  qs: ['delai','recapitulatif'] },
  { n: 4, label: 'Contact', qs: ['coordonnees','done'] },
]
function getCurrentStep(q: QuestionId): number {
  for (const s of STEPS) { if (s.qs.includes(q)) return s.n }
  return 1
}
function Stepper({ currentQ }: { currentQ: QuestionId }) {
  const cs = getCurrentStep(currentQ)
  return (
    <div style={stepperWrap}>
      {STEPS.map((step, i) => {
        const st = step.n < cs ? 'done' : step.n === cs ? 'curr' : 'futu'
        return (
          <Fragment key={step.n}>
            <div style={stepCol}>
              <div style={st === 'done' ? dotDone : st === 'curr' ? dotCurr : dotFutu}>
                {st === 'done' ? <Check size={12} color={white} strokeWidth={3} /> : step.n}
              </div>
              <span style={st === 'done' ? lblDone : st === 'curr' ? lblCurr : lblFutu}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={connOut}><div style={step.n < cs ? connOn : connOff} /></div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

/* -------- Data -------- */
const TYPE_BIEN = [
  { value: 'appartement', label: 'Appartement', emoji: '\ud83c\udfe2' },
  { value: 'maison',      label: 'Maison',      emoji: '\ud83c\udfe0' },
  { value: 'terrain',     label: 'Terrain',     emoji: '\ud83c\udf3f' },
  { value: 'commerce',    label: 'Commerce',    emoji: '\ud83c\udfea' },
  { value: 'immeuble',    label: 'Immeuble',    emoji: '\ud83c\udfd7\ufe0f' },
  { value: 'autre',       label: 'Autre',       emoji: '...' },
]
const ETAT = [
  { value: 'neuf',          label: 'Neuf / r\u00e9cent',      emoji: '\ud83c\udfc6' },
  { value: 'tres_bon_etat', label: 'Tr\u00e8s bon \u00e9tat',  emoji: '\u2728' },
  { value: 'bon_etat',      label: 'Bon \u00e9tat',           emoji: '\ud83d\udc4d' },
  { value: 'rafraichir',    label: '\u00c0 rafra\u00eechir',   emoji: '\ud83d\udd8c\ufe0f' },
  { value: 'travaux',       label: 'Travaux importants',      emoji: '\ud83d\udd28' },
]
const DELAI = [
  { value: 'immediat',   label: 'Imm\u00e9diat',   emoji: '\ud83d\udd25' },
  { value: '1_3_mois',   label: '1 - 3 mois', emoji: '\ud83d\udcc5' },
  { value: '3_6_mois',   label: '3 - 6 mois', emoji: '\ud83d\uddd3\ufe0f' },
  { value: '6_mois',     label: '+6 mois',    emoji: '\u23f3' },
  { value: 'pas_decide', label: 'Pas d\u00e9cid\u00e9', emoji: '\ud83e\udd14' },
]
const EQUIPEMENTS = ['Balcon', 'Terrasse', 'Parking', 'Garage', 'Cave', 'Jardin', 'Vue exceptionnelle', 'Piscine']
const BIEN_LBL: Record<string, string>  = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', immeuble: 'Immeuble', autre: 'Autre' }
const ETAT_LBL: Record<string, string>  = { neuf: 'Neuf / r\u00e9cent', tres_bon_etat: 'Tr\u00e8s bon \u00e9tat', bon_etat: 'Bon \u00e9tat', rafraichir: '\u00c0 rafra\u00eechir', travaux: 'Travaux importants' }
const DELAI_LBL: Record<string, string> = { immediat: 'Imm\u00e9diat', '1_3_mois': '1 - 3 mois', '3_6_mois': '3 - 6 mois', '6_mois': '+6 mois', pas_decide: 'Pas d\u00e9cid\u00e9' }

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
  const tl = BIEN_LBL[a.type_bien ?? ''] ?? a.type_bien ?? 'Bien'
  let desc = tl
  if (a.surface) desc += ' de ' + a.surface + 'm\u00b2'
  if (a.nb_pieces) desc += ', ' + a.nb_pieces + ' pi\u00e8ce' + (Number(a.nb_pieces) > 1 ? 's' : '')
  if (a.surface_terrain) desc += ', terrain ' + a.surface_terrain + 'm\u00b2'
  if (a.equipements && a.equipements.length > 0) desc += ' + ' + a.equipements.join(', ')
  const lines = ['Tr\u00e8s bien, r\u00e9capitulons ensemble votre bien !', '', 'Voici le r\u00e9capitulatif de votre bien :', '', '\ud83c\udfd1 ' + desc]
  if (a.adresse) lines.push('\ud83d\udccd ' + a.adresse)
  if (a.etat) lines.push('\ud83d\udd27 ' + (ETAT_LBL[a.etat] ?? a.etat))
  if (a.delai) lines.push('\ud83d\uddd3 Vente souhait\u00e9e : ' + (DELAI_LBL[a.delai] ?? a.delai))
  lines.push('', 'Est-ce que ces informations sont correctes ?')
  return lines.join('\n')
}

function getMsg(q: QuestionId, a: VendreAnswers): string {
  if (q === 'recapitulatif') return buildRecap(a)
  switch (q) {
    case 'type_bien':        return "Parfait, je localise votre bien ! Quel type de bien souhaitez-vous faire estimer ?"
    case 'sous_type_maison': return "Tr\u00e8s bien ! S'agit-il d'une maison mitoyenne ou individuelle ?"
    case 'surface':          return "Parfait ! Quelle est la surface habitable de votre bien ?"
    case 'surface_terrain':  return "C'est not\u00e9 ! Quelle est la superficie totale du terrain de votre maison ?"
    case 'nb_pieces':        return "C'est not\u00e9 ! Combien de pi\u00e8ces principales compte votre bien ?\n(S\u00e9jour + chambres, sans compter cuisine, salle de bain et WC)"
    case 'etat':             return "Compris ! Quel est l'\u00e9tat g\u00e9n\u00e9ral de votre bien ?"
    case 'equipements':      return "Tr\u00e8s bien ! Quels \u00e9quipements et atouts poss\u00e8de votre bien ?"
    case 'delai':            return "Compris ! Dans quel d\u00e9lai souhaitez-vous vendre votre bien ?"
    case 'coordonnees':      return "Parfait ! Pour finaliser votre estimation, j'ai besoin de vos coordonn\u00e9es."
    default:                 return ''
  }
}

function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
function Avatar() { return <div style={avatarSt}>AL</div> }

type UiState = 'chat' | 'calcul' | 'verification'

export default function VendrePage() {
  const router = useRouter()
  const { messages, currentQuestion, answers, addMessage, setAnswer, setQuestion, reset } = useVendreStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [uiState, setUiState] = useState<UiState>('chat')
  const [token, setToken]     = useState('')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, currentQuestion])

  function handleAnswer(key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) {
    const newA = { ...answers, [key]: value }
    setAnswer(key, value)
    if (display) addMessage({ from: 'user', text: display, timestamp: ts() })
    const next = getNext(currentQuestion, newA)
    setTimeout(() => {
      const msg = getMsg(next, newA)
      if (msg) addMessage({ from: 'al', text: msg, timestamp: ts() })
      setQuestion(next)
    }, 350)
  }

  function handleFinalSubmit(prenom: string, nom: string, tel: string, email: string, civilite: 'monsieur' | 'madame') {
    setAnswer('prenom', prenom); setAnswer('nom', nom); setAnswer('telephone', tel); setAnswer('email', email); setAnswer('civilite', civilite)
    addMessage({ from: 'user', text: prenom + ' ' + nom, timestamp: ts() })
    const t = crypto.randomUUID()
    setToken(t)
    fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...answers, prenom, nom, telephone: tel, email, civilite, token: t, type: 'vendre' }) }).catch(() => null)
    setUiState('calcul')
  }

  const handleCalculComplete = useCallback(() => {
    const userSurface = answers.surface_terrain
    const cadSurface  = answers.cadastre_surface
    if (cadSurface && userSurface && Math.abs(cadSurface - userSurface) / userSurface > 0.12) {
      setUiState('verification')
    } else {
      router.push('/resultats/' + token)
    }
  }, [answers, token, router])

  function handleVerifComplete(chosen: number) { setAnswer('surface_terrain', chosen); router.push('/resultats/' + token) }

  if (uiState === 'calcul') return <CalculLoading onComplete={handleCalculComplete} />
  if (uiState === 'verification') return <VerificationDonnees userSurface={answers.surface_terrain ?? 0} cadastreSurface={answers.cadastre_surface ?? 0} onComplete={handleVerifComplete} />

  return (
    <div style={pageSt}>
      <header style={navSt}>
        <div style={navTopSt}>
          <div style={navLeftSt}>
            <Link href="/" style={backSt}><ChevronLeft size={14} /></Link>
            <Avatar />
            <div><div style={navNameSt}>Alex Lopez</div><div style={navSubSt}>Mandataire IAD - Provence Verte</div></div>
          </div>
          <a href="tel:+33613180168" style={phoneSt}><Phone size={13} color={brand} /> 06 13 18 01 68</a>
        </div>
        <Stepper currentQ={currentQuestion} />
      </header>

      <div style={chatWrap}>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.from === 'al' ? (
              <div style={rowAl}><Avatar /><div><div style={bubbleAl}>{msg.text}</div><div style={tsLeft}>{msg.timestamp}</div></div></div>
            ) : (
              <div style={rowUser}><div><div style={bubbleUser}>{msg.text}</div><div style={tsRight}>{msg.timestamp}</div></div></div>
            )}
          </div>
        ))}
        {currentQuestion !== 'done' && (
          <div style={inlineZone}>
            <InputZone question={currentQuestion} answers={answers} onAnswer={handleAnswer} onFinalSubmit={handleFinalSubmit} onRestart={() => { reset(); setUiState('chat') }} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function InputZone({ question, answers, onAnswer, onFinalSubmit, onRestart }: {
  question: QuestionId; answers: VendreAnswers
  onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void
  onFinalSubmit: (p: string, n: string, t: string, e: string, c: 'monsieur' | 'madame') => void
  onRestart: () => void
}) {
  if (question === 'adresse') return <AdresseInput onAnswer={onAnswer} />
  if (question === 'type_bien') return <Cards options={TYPE_BIEN} cols={2} onSelect={(v, l) => onAnswer('type_bien', v, l)} />
  if (question === 'sous_type_maison') return <Cards options={[{ value: 'mitoyenne', label: 'Mitoyenne', emoji: '\ud83c\udfd8\ufe0f' }, { value: 'individuelle', label: 'Individuelle', emoji: '\ud83c\udfe0' }]} cols={2} onSelect={(v, l) => onAnswer('sous_type', v, l)} />
  if (question === 'surface') return <Slider unit="m\u00b2" min={5} max={1000} def={80} onValidate={(v) => onAnswer('surface', v, v + ' m\u00b2')} />
  if (question === 'surface_terrain') return <Slider unit="m\u00b2" min={50} max={5000} def={500} onValidate={(v) => onAnswer('surface_terrain', v, v + ' m\u00b2')} />
  if (question === 'nb_pieces') return <Cards options={['1','2','3','4','5','6+'].map((n) => ({ value: n, label: n, emoji: '' }))} cols={3} onSelect={(v, l) => onAnswer('nb_pieces', parseInt(v) || 6, l + (parseInt(v) > 1 ? ' pi\u00e8ces' : ' pi\u00e8ce'))} />
  if (question === 'etat') return <Cards options={ETAT} cols={2} onSelect={(v, l) => onAnswer('etat', v, l)} />
  if (question === 'equipements') return <MultiSelect options={EQUIPEMENTS} onValidate={(sel) => onAnswer('equipements', sel, sel.length ? sel.join(', ') : 'Aucun \u00e9quipement')} />
  if (question === 'delai') return <Cards options={DELAI} cols={2} onSelect={(v, l) => onAnswer('delai', v, l)} />
  if (question === 'recapitulatif') return <RecapInput onConfirm={() => onAnswer('recapitulatif' as keyof VendreAnswers, true, '')} onRestart={onRestart} />
  if (question === 'coordonnees') return <Coordonnees onFinalSubmit={onFinalSubmit} />
  return null
}

/* -------- Adresse + DPE + Parcelle -------- */
const API_ADRESSE = 'https://api-adresse.data.gouv.fr/search/'
interface Suggestion { label: string; lat: number; lng: number }
interface AdresseInfos { dpe?: { lettre: string }; parcelle?: { id: string; commune: string; surface: number | null } }

function AdresseInput({ onAnswer }: { onAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers], display: string) => void }) {
  const [val, setVal]           = useState('')
  const [suggestions, setSug]   = useState<Suggestion[]>([])
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [infos, setInfos]       = useState<AdresseInfos>({})
  const [fetching, setFetching] = useState(false)
  const timer                   = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  async function pickSuggestion(s: Suggestion) {
    setSug([]); setVal(s.label); setSelected(s); setFetching(true)
    try {
      const res  = await fetch('/api/adresse-infos?lat=' + s.lat + '&lng=' + s.lng + '&q=' + encodeURIComponent(s.label))
      const data = await res.json()
      setInfos(data)
      if (data.parcelle?.surface) onAnswer('cadastre_surface', data.parcelle.surface, '')
    } catch { setInfos({}) } finally { setFetching(false) }
  }

  function validate() {
    if (!selected) return
    onAnswer('lat', selected.lat, ''); onAnswer('lng', selected.lng, ''); onAnswer('adresse', selected.label, selected.label)
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value); setSelected(null); setInfos({})
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => fetchSug(e.target.value), 300)
  }

  function submit() { if (!val.trim()) return; setSug([]); onAnswer('adresse', val.trim(), val.trim()) }

  return (
    <div>
      <div style={inputRow}>
        <input style={inputSt} type="text" placeholder="Ex : 12 rue de la Paix, Cotignac"
          value={val} onChange={onChange} onKeyDown={(e) => e.key === 'Enter' && submit()} autoFocus autoComplete="off" />
        {!selected && <button style={sendBtnSt} onClick={submit}><Send size={16} color={white} /></button>}
      </div>
      {suggestions.length > 0 && (
        <div style={suggestWrap}>
          {suggestions.map((s, i) => (
            <div key={i} style={suggestItemSt(i === suggestions.length - 1)} onClick={() => pickSuggestion(s)}>
              <MapPin size={13} color={brand} />{s.label}
            </div>
          ))}
        </div>
      )}
      {loading && <p style={loadingSt}>Recherche en cours...</p>}
      {fetching && <p style={loadingSt}>V\u00e9rification des donn\u00e9es officielles...</p>}
      {selected && !fetching && (
        <div>
          {infos.dpe && (
            <div style={infoCardGray}>
              <Zap size={15} color={brand} />
              <span style={infoTxt}>DPE trouv\u00e9 : <strong>{infos.dpe.lettre}</strong></span>
              <span style={dpeBadgeSt}>V\u00e9rifi\u00e9 ADEME</span>
            </div>
          )}
          {infos.parcelle && (
            <div style={infoCardYellow}>
              <Map size={15} color="#ca8a04" />
              <span style={infoTxt}>
                Parcelle <strong>{infos.parcelle.id}</strong>
                {infos.parcelle.commune ? ' \u00b7 ' + infos.parcelle.commune : ''}
                {infos.parcelle.surface ? ' \u00b7 ' + infos.parcelle.surface + ' m\u00b2' : ''}
              </span>
              <span style={ignBadgeSt}>IGN</span>
            </div>
          )}
          <button style={validateBtn} onClick={validate}><Send size={14} /> Valider cette adresse</button>
        </div>
      )}
    </div>
  )
}

function Cards({ options, cols, onSelect }: { options: { value: string; label: string; emoji: string }[]; cols: number; onSelect: (value: string, label: string) => void }) {
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

function Slider({ unit, min, max, def, onValidate }: { unit: string; min: number; max: number; def: number; onValidate: (v: number) => void }) {
  const [val, setVal] = useState(def)
  return (
    <div style={sliderWrap}>
      <div style={sliderValRow}><div style={sliderValBox}>{val}</div><span style={sliderUnit}>{unit}</span></div>
      <input type="range" min={min} max={max} value={val} style={sliderInp} onChange={(e) => setVal(Number(e.target.value))} />
      <div style={sliderLabels}><span style={sliderLbl}>{min} {unit}</span><span style={sliderLbl}>{max} {unit}</span></div>
      <button style={validateBtn} onClick={() => onValidate(val)}><Send size={14} /> Valider</button>
    </div>
  )
}

function MultiSelect({ options, onValidate }: { options: string[]; onValidate: (s: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([])
  function toggle(o: string) { setSel((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o]) }
  return (
    <div>
      <div style={multiGrid}>
        {options.map((o) => { const active = sel.includes(o); return (<div key={o} style={multiRowSt(active)} onClick={() => toggle(o)}><div style={checkSt(active)} /><span>{o}</span></div>) })}
      </div>
      <button style={validateBtn} onClick={() => onValidate(sel)}>
        {sel.length === 0 ? 'Aucun \u00e9quipement' : 'Valider (' + sel.length + ' s\u00e9lectionn\u00e9' + (sel.length > 1 ? 's' : '') + ')'} <Send size={14} />
      </button>
    </div>
  )
}

const recapGrid: CSSProperties    = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const recapBtnOk: CSSProperties   = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 12px', borderRadius: '16px', cursor: 'pointer', border: '2px solid ' + success, backgroundColor: '#f0fdf4', fontSize: '13px', fontWeight: 600, color: success }
const recapBtnEdit: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 12px', borderRadius: '16px', cursor: 'pointer', border: '2px solid ' + border, backgroundColor: white, fontSize: '13px', fontWeight: 600, color: fg }

function RecapInput({ onConfirm, onRestart }: { onConfirm: () => void; onRestart: () => void }) {
  return (
    <div style={recapGrid}>
      <button style={recapBtnOk} onClick={onConfirm}><span style={emojiSt}>\u2705</span><span>C&apos;est correct</span></button>
      <button style={recapBtnEdit} onClick={onRestart}><Edit3 size={20} color={muted} /><span>Je veux modifier</span></button>
    </div>
  )
}

function Coordonnees({ onFinalSubmit }: { onFinalSubmit: (p: string, n: string, t: string, e: string, c: 'monsieur' | 'madame') => void }) {
  const [civilite, setCiv]   = useState<'monsieur' | 'madame'>('monsieur')
  const [prenom, setPrenom]  = useState('')
  const [nom, setNom]        = useState('')
  const [tel, setTel]        = useState('')
  const [email, setEmail]    = useState('')
  const [rgpd, setRgpd]      = useState(false)
  const [showErr, setShowErr] = useState(false)
  const valid = !!(prenom.trim() && nom.trim() && tel.trim() && email.trim())
  function submit() { if (!valid) return; if (!rgpd) { setShowErr(true); return }; onFinalSubmit(prenom.trim(), nom.trim(), tel.trim(), email.trim(), civilite) }
  return (
    <div style={coordWrap}>
      <div style={coordHdr}>
        <div style={coordBadge}>\u2728</div>
        <div><div style={coordTitle}>Derni\u00e8re \u00e9tape !</div><div style={coordSub}>Recevez votre estimation personnalis\u00e9e</div></div>
      </div>
      <div style={civilRow}>
        <button style={civilBtnSt(civilite === 'monsieur')} onClick={() => setCiv('monsieur')}>Monsieur</button>
        <button style={civilBtnSt(civilite === 'madame')} onClick={() => setCiv('madame')}>Madame</button>
      </div>
      <div style={coordGrid}>
        <input style={inputFull} placeholder="Pr\u00e9nom *" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <input style={inputFull} placeholder="Nom *" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <input style={inputFull} type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input style={inputFull} type="tel" placeholder="T\u00e9l\u00e9phone *" value={tel} onChange={(e) => setTel(e.target.value)} />
      <div style={rgpdRowSt(rgpd, showErr && !rgpd)} onClick={() => { setRgpd(!rgpd); setShowErr(false) }}>
        <div style={rgpdBoxSt(rgpd)}>{rgpd && <Check size={11} color={white} strokeWidth={3} />}</div>
        <div>
          <span style={rgpdTxt}><strong>J&apos;accepte</strong> que mes donn\u00e9es soient transmises au professionnel immobilier pour \u00eatre recontact\u00e9.{' '}<span style={rgpdLinkSt}>Politique de confidentialit\u00e9</span></span>
          {showErr && !rgpd && <div style={rgpdErrTxt}>Requis pour continuer</div>}
        </div>
      </div>
      <button style={valid && rgpd ? validateBtn : validateOff} onClick={submit}>Voir mon estimation <Send size={14} /></button>
    </div>
  )
}

const CALCUL_STEPS = ['Recherche des ventes r\u00e9centes...', 'Analyse du march\u00e9 local', 'Calcul de votre estimation']

function CalculLoading({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress]     = useState(0)
  const ref = useRef(onComplete); ref.current = onComplete
  useEffect(() => {
    const t1 = setTimeout(() => { setActiveStep(1); setProgress(35) }, 900)
    const t2 = setTimeout(() => { setActiveStep(2); setProgress(68) }, 1900)
    const t3 = setTimeout(() => { setActiveStep(3); setProgress(100) }, 2800)
    const t4 = setTimeout(() => ref.current(), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])
  return (
    <div style={calculPage}>
      <div style={calculIcon}>\ud83c\udfe0</div>
      <div style={calculTitle}>Calcul de votre estimation</div>
      <div style={calculSub}>Analyse des ventes r\u00e9centes dans votre secteur</div>
      <div style={calculSteps}>
        {CALCUL_STEPS.map((step, i) => {
          const done = i < activeStep; const active = i === activeStep
          return (
            <div key={i} style={calculStepRow}>
              <div style={stepIconSt(done, active)}>
                {done ? <Check size={11} color={white} strokeWidth={3} /> : active ? <div style={spinnerDotSt} /> : null}
              </div>
              <span style={active || done ? calculStepTxtOn : calculStepTxtOff}>{step}</span>
            </div>
          )
        })}
      </div>
      <div style={calculBar}><div style={calculFillSt(progress)} /></div>
    </div>
  )
}

function VerificationDonnees({ userSurface, cadastreSurface, onComplete }: { userSurface: number; cadastreSurface: number; onComplete: (chosen: number) => void }) {
  const [chosen, setChosen] = useState<'user' | 'cadastre'>('cadastre')
  return (
    <div style={verifPage}>
      <header style={verifNav}><div style={avatarSt}>AL</div><div style={navNameSt}>Alex Lopez</div></header>
      <div style={verifWrap}>
        <div style={verifIconSt}>\ud83d\udee1\ufe0f</div>
        <div style={verifTitle}>V\u00e9rification des informations</div>
        <div style={verifSub}>Nous avons r\u00e9cup\u00e9r\u00e9 des donn\u00e9es officielles qui diff\u00e8rent de certaines informations que vous avez indiqu\u00e9es.</div>
        <div style={verifCard}>
          <div style={verifCardTitle}>Surface terrain</div>
          <div style={chosen === 'user' ? verifRadioOn : verifRadioOff} onClick={() => setChosen('user')}>
            <div style={chosen === 'user' ? verifDotOn : verifDot} />
            <span style={verifTxtSt}>Vos informations : {userSurface} m\u00b2</span>
          </div>
          <div style={chosen === 'cadastre' ? verifRadioOn : verifRadioOff} onClick={() => setChosen('cadastre')}>
            <div style={chosen === 'cadastre' ? verifDotOn : verifDot} />
            <span style={verifTxtSt}>Donn\u00e9es officielles (Cadastre IGN) : {cadastreSurface} m\u00b2</span>
            <div style={verifBadge}>Recommand\u00e9</div>
          </div>
        </div>
        <div style={verifNote}>Les donn\u00e9es officielles proviennent de sources gouvernementales et sont g\u00e9n\u00e9ralement plus pr\u00e9cises.</div>
        <button style={validateBtn} onClick={() => onComplete(chosen === 'cadastre' ? cadastreSurface : userSurface)}>
          Valider et voir mon estimation <Send size={14} />
        </button>
      </div>
    </div>
  )
}
