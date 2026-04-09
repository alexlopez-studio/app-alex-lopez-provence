'use client'

import { useVendreStore } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Link from 'next/link'

/* ─── Tokens ─── */
const brand = '#0066FF'
const brandLight = '#EFF6FF'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const success = '#10B981'
const white = '#ffffff'

/* ─── Styles statiques ─── */
const page: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const nav: CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: `1px solid ${border}` }
const navInner: CSSProperties = { maxWidth: '75rem', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navBack: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: muted, textDecoration: 'none' }
const navPhone: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: fg, textDecoration: 'none' }
const main: CSSProperties = { maxWidth: '600px', margin: '0 auto', padding: '100px 24px 60px' }
const progressWrap: CSSProperties = { marginBottom: '40px' }
const progressHeader: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
const progressLabel: CSSProperties = { fontSize: '12px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: '6px' }
const progressCount: CSSProperties = { fontSize: '12px', fontWeight: 600, color: muted }
const progressBar: CSSProperties = { height: '4px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden' }
const stepsRow: CSSProperties = { display: 'flex', gap: '8px', marginTop: '16px' }
const card: CSSProperties = { backgroundColor: white, borderRadius: '20px', border: `1px solid ${border}`, padding: '36px', marginBottom: '20px' }
const cardEyebrow: CSSProperties = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: brand, marginBottom: '8px' }
const cardTitle: CSSProperties = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.02em', marginBottom: '6px' }
const cardSub: CSSProperties = { fontSize: '14px', fontWeight: 300, color: muted, marginBottom: '32px', lineHeight: 1.6 }
const fieldGroup: CSSProperties = { marginBottom: '24px' }
const lbl: CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: fg, marginBottom: '8px' }
const inp: CSSProperties = { width: '100%', fontSize: '14px', color: fg, backgroundColor: white, border: `1.5px solid ${border}`, borderRadius: '10px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box' }
const row2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
const optGrid2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const optGrid3: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }
const optGrid1: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' }
const optGridDpe: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }
const toggleRow: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', border: `1.5px solid ${border}`, marginBottom: '10px', cursor: 'pointer' }
const toggleLabel: CSSProperties = { fontSize: '13px', fontWeight: 500, color: fg }
const navBtns: CSSProperties = { display: 'flex', gap: '12px', justifyContent: 'space-between' }
const btnSecondary: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 24px', borderRadius: '999px', border: `1.5px solid ${border}`, backgroundColor: white, fontSize: '14px', fontWeight: 600, color: fg, cursor: 'pointer' }
const btnPrimaryActive: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 28px', borderRadius: '999px', backgroundColor: brand, fontSize: '14px', fontWeight: 600, color: white, cursor: 'pointer', border: 'none', marginLeft: 'auto' }
const btnPrimaryDisabled: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 28px', borderRadius: '999px', backgroundColor: border, fontSize: '14px', fontWeight: 600, color: muted, cursor: 'not-allowed', border: 'none', marginLeft: 'auto' }
const hint: CSSProperties = { fontSize: '11px', fontWeight: 400, color: muted, marginTop: '6px' }
const mention: CSSProperties = { fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6, marginBottom: '24px' }
const badgeSuccess: CSSProperties = { fontSize: '11px', fontWeight: 600, color: success }

/* ─── Styles dynamiques ─── */
function progressFill(pct: number): CSSProperties {
  return { height: '100%', width: `${pct}%`, backgroundColor: brand, borderRadius: '999px', transition: 'width 0.4s ease' }
}
function stepDot(active: boolean, done: boolean): CSSProperties {
  return {
    width: '28px', height: '28px', borderRadius: '999px',
    border: `2px solid ${done || active ? brand : border}`,
    backgroundColor: done ? brand : active ? brandLight : white,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700,
    color: done ? white : active ? brand : muted,
    transition: 'all 0.2s ease',
  }
}
function opt(active: boolean, fullWidth = false): CSSProperties {
  return {
    border: `2px solid ${active ? brand : border}`,
    backgroundColor: active ? brandLight : white,
    borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 600,
    color: active ? brand : fg,
    textAlign: fullWidth ? 'left' : 'center',
    transition: 'all 0.15s ease',
    width: '100%',
  }
}
function toggle(on: boolean): CSSProperties {
  return { width: '40px', height: '22px', borderRadius: '999px', backgroundColor: on ? brand : border, position: 'relative', transition: 'background-color 0.2s ease', flexShrink: 0 }
}
function toggleThumb(on: boolean): CSSProperties {
  return { position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '999px', backgroundColor: white, transition: 'left 0.2s ease' }
}

const STEPS = [{ n: 1, label: 'Le bien' }, { n: 2, label: 'État' }, { n: 3, label: 'Contexte' }, { n: 4, label: 'Contact' }]

/* ─── Étapes ─── */

function Step1() {
  const { type_bien, adresse, surface: surf, nb_pieces, etage, annee_construction, setField } = useVendreStore()
  return (
    <div>
      <p style={cardEyebrow}>Étape 1 sur 4</p>
      <h1 style={cardTitle}>Votre bien</h1>
      <p style={cardSub}>Renseignez les informations principales de votre bien immobilier.</p>
      <div style={fieldGroup}>
        <label style={lbl}>Type de bien</label>
        <div style={optGrid2}>
          {([['appartement', '🏢 Appartement'], ['maison', '🏠 Maison'], ['terrain', '🌿 Terrain'], ['autre', '🏗️ Autre']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={opt(type_bien === v)} onClick={() => setField('type_bien', v as never)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Adresse du bien</label>
        <input style={inp} type="text" placeholder="12 rue de la Paix, Cotignac" value={adresse} onChange={(e) => setField('adresse', e.target.value)} />
        <p style={hint}>Adresse complète pour une estimation précise</p>
      </div>
      <div style={row2}>
        <div style={fieldGroup}>
          <label style={lbl}>Surface habitable (m²)</label>
          <input style={inp} type="number" placeholder="85" value={surf} onChange={(e) => setField('surface', e.target.value)} min="1" />
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Nombre de pièces</label>
          <input style={inp} type="number" placeholder="4" value={nb_pieces} onChange={(e) => setField('nb_pieces', e.target.value)} min="1" />
        </div>
      </div>
      <div style={row2}>
        <div style={fieldGroup}>
          <label style={lbl}>Étage (optionnel)</label>
          <input style={inp} type="number" placeholder="2" value={etage} onChange={(e) => setField('etage', e.target.value)} min="0" />
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Année de construction</label>
          <input style={inp} type="number" placeholder="1985" value={annee_construction} onChange={(e) => setField('annee_construction', e.target.value)} min="1800" max="2025" />
        </div>
      </div>
    </div>
  )
}

function Step2() {
  const { etat, garage, parking, cave, exterieur, cuisine_equipee, double_vitrage, dpe, setField } = useVendreStore()
  return (
    <div>
      <p style={cardEyebrow}>Étape 2 sur 4</p>
      <h1 style={cardTitle}>État & prestations</h1>
      <p style={cardSub}>Ces critères impactent directement la valeur estimée de votre bien.</p>
      <div style={fieldGroup}>
        <label style={lbl}>État général</label>
        <div style={optGrid2}>
          {([['a_renover', '🔨 À rénover'], ['bon_etat', '👍 Bon état'], ['tres_bon_etat', '✨ Très bon état'], ['neuf', '🏆 Neuf']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={opt(etat === v)} onClick={() => setField('etat', v as never)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Annexes</label>
        {([['garage', '🚗 Garage', garage], ['parking', '🅿️ Parking', parking], ['cave', '📦 Cave', cave]] as [string, string, boolean][]).map(([key, label, val]) => (
          <div key={key} style={toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={toggleLabel}>{label}</span>
            <div style={toggle(val)}><div style={toggleThumb(val)} /></div>
          </div>
        ))}
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Extérieur</label>
        <div style={optGrid2}>
          {([['aucun', 'Aucun'], ['balcon', '🌿 Balcon'], ['terrasse', '☀️ Terrasse'], ['jardin', '🌳 Jardin']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={opt(exterieur === v)} onClick={() => setField('exterieur', v as never)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Équipements</label>
        {([['cuisine_equipee', '🍳 Cuisine équipée', cuisine_equipee], ['double_vitrage', '🪟 Double vitrage', double_vitrage]] as [string, string, boolean][]).map(([key, label, val]) => (
          <div key={key} style={toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={toggleLabel}>{label}</span>
            <div style={toggle(val)}><div style={toggleThumb(val)} /></div>
          </div>
        ))}
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>DPE (Diagnostic de Performance Énergétique)</label>
        <div style={optGridDpe}>
          {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NC'] as string[]).map((v) => (
            <button key={v} style={opt(dpe === v)} onClick={() => setField('dpe', v as never)}>{v === 'NC' ? '?' : v}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step3() {
  const { delai, occupe, deja_estime, prix_souhaite, setField } = useVendreStore()
  return (
    <div>
      <p style={cardEyebrow}>Étape 3 sur 4</p>
      <h1 style={cardTitle}>Contexte de vente</h1>
      <p style={cardSub}>Quelques questions sur votre projet pour affiner l&apos;estimation.</p>
      <div style={fieldGroup}>
        <label style={lbl}>Délai de vente souhaité</label>
        <div style={optGrid1}>
          {([['urgent', '🔥 Urgent — moins de 3 mois'], ['3_6_mois', '📅 3 à 6 mois'], ['6_mois_plus', '🗓️ Plus de 6 mois']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={opt(delai === v, true)} onClick={() => setField('delai', v as never)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Informations complémentaires</label>
        {([['occupe', '🔑 Bien actuellement occupé', occupe], ['deja_estime', '📋 Déjà estimé par un professionnel', deja_estime]] as [string, string, boolean][]).map(([key, label, val]) => (
          <div key={key} style={toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={toggleLabel}>{label}</span>
            <div style={toggle(val)}><div style={toggleThumb(val)} /></div>
          </div>
        ))}
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Prix de vente espéré (optionnel)</label>
        <input style={inp} type="number" placeholder="250000" value={prix_souhaite} onChange={(e) => setField('prix_souhaite', e.target.value)} min="0" />
        <p style={hint}>En euros — laissez vide si vous n&apos;avez pas d&apos;idée précise</p>
      </div>
    </div>
  )
}

function Step4() {
  const { prenom, nom, telephone, email, setField } = useVendreStore()
  return (
    <div>
      <p style={cardEyebrow}>Étape 4 sur 4</p>
      <h1 style={cardTitle}>Vos coordonnées</h1>
      <p style={cardSub}>Pour recevoir votre estimation personnalisée par email.</p>
      <div style={row2}>
        <div style={fieldGroup}>
          <label style={lbl}>Prénom</label>
          <input style={inp} type="text" placeholder="Marie" value={prenom} onChange={(e) => setField('prenom', e.target.value)} />
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Nom</label>
          <input style={inp} type="text" placeholder="Dupont" value={nom} onChange={(e) => setField('nom', e.target.value)} />
        </div>
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Téléphone</label>
        <input style={inp} type="tel" placeholder="06 12 34 56 78" value={telephone} onChange={(e) => setField('telephone', e.target.value)} />
      </div>
      <div style={fieldGroup}>
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="marie.dupont@email.fr" value={email} onChange={(e) => setField('email', e.target.value)} />
        <p style={hint}>Votre estimation sera envoyée à cette adresse</p>
      </div>
      <p style={mention}>
        En soumettant ce formulaire, vous acceptez d&apos;être contacté par Alex Lopez dans le cadre de votre projet immobilier. Vos données sont traitées conformément au RGPD.
      </p>
    </div>
  )
}

function canProceed(step: number, store: ReturnType<typeof useVendreStore>): boolean {
  if (step === 1) return !!store.type_bien && !!store.adresse.trim() && !!store.surface && !!store.nb_pieces
  if (step === 2) return !!store.etat && !!store.dpe
  if (step === 3) return !!store.delai
  if (step === 4) return !!store.prenom.trim() && !!store.nom.trim() && !!store.telephone.trim() && !!store.email.trim()
  return false
}

export default function VendrePage() {
  const store = useVendreStore()
  const { step, nextStep, prevStep } = store
  const pct = ((step - 1) / 3) * 100
  const valid = canProceed(step, store)

  return (
    <div style={page}>
      <header style={nav}>
        <div style={navInner}>
          <Link href="/" style={navBack}>
            <ChevronLeft size={16} /> Retour aux outils
          </Link>
          <a href="tel:+33613180168" style={navPhone}>
            <Phone size={14} color={brand} /> 06 13 18 01 68
          </a>
        </div>
      </header>

      <main style={main}>
        <div style={progressWrap}>
          <div style={progressHeader}>
            <span style={progressLabel}>🏠 Estimation vendeur</span>
            <span style={progressCount}>Étape {step} / 4</span>
          </div>
          <div style={progressBar}>
            <div style={progressFill(pct)} />
          </div>
          <div style={stepsRow}>
            {STEPS.map((st) => (
              <div key={st.n} style={stepDot(step === st.n, step > st.n)}>
                {step > st.n ? <Check size={12} /> : st.n}
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        <div style={navBtns}>
          {step > 1
            ? <button style={btnSecondary} onClick={prevStep}><ChevronLeft size={16} /> Précédent</button>
            : <div />}
          <button
            style={valid ? btnPrimaryActive : btnPrimaryDisabled}
            onClick={valid ? nextStep : undefined}
            disabled={!valid}
          >
            {step === 4 ? 'Obtenir mon estimation' : 'Continuer'} <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  )
}
