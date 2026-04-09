'use client'

import { useVendreStore } from '@/stores/vendreStore'
import type { CSSProperties } from 'react'
import { Phone, ChevronLeft, ChevronRight, Check, Home } from 'lucide-react'
import Link from 'next/link'

/* ─── Tokens ─── */
const t = {
  brand: '#0066FF', brandHover: '#0052CC', brandLight: '#EFF6FF',
  fg: '#0F172A', muted: '#64748B', border: '#E2E8F0',
  surface: '#F8FAFC', success: '#10B981', white: '#ffffff', error: '#EF4444',
}

/* ─── Styles ─── */
const s: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: t.surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' },
  nav: { position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: t.white, borderBottom: `1px solid ${t.border}` },
  navInner: { maxWidth: '75rem', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBack: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: t.muted, textDecoration: 'none' },
  navPhone: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: t.fg, textDecoration: 'none' },
  main: { maxWidth: '600px', margin: '0 auto', padding: '100px 24px 60px' },
  /* Progress */
  progressWrap: { marginBottom: '40px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  progressLabel: { fontSize: '12px', fontWeight: 600, color: t.muted, textTransform: 'uppercase' as const, letterSpacing: '0.14em' },
  progressCount: { fontSize: '12px', fontWeight: 600, color: t.muted },
  progressBar: { height: '4px', backgroundColor: t.border, borderRadius: '999px', overflow: 'hidden' },
  progressFill: (pct: number): CSSProperties => ({ height: '100%', width: `${pct}%`, backgroundColor: t.brand, borderRadius: '999px', transition: 'width 0.4s ease' }),
  steps: { display: 'flex', gap: '8px', marginTop: '16px' },
  stepDot: (active: boolean, done: boolean): CSSProperties => ({
    width: '28px', height: '28px', borderRadius: '999px', border: `2px solid ${done || active ? t.brand : t.border}`,
    backgroundColor: done ? t.brand : active ? t.brandLight : t.white,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700,
    color: done ? t.white : active ? t.brand : t.muted,
    transition: 'all 0.2s ease',
  }),
  /* Card */
  card: { backgroundColor: t.white, borderRadius: '20px', border: `1px solid ${t.border}`, padding: '36px', marginBottom: '20px' },
  cardEyebrow: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.18em', color: t.brand, marginBottom: '8px' },
  cardTitle: { fontSize: '22px', fontWeight: 900, color: t.fg, letterSpacing: '-0.02em', marginBottom: '6px' },
  cardSub: { fontSize: '14px', fontWeight: 300, color: t.muted, marginBottom: '32px', lineHeight: 1.6 },
  /* Form */
  fieldGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: t.fg, marginBottom: '8px' },
  input: { width: '100%', fontSize: '14px', fontWeight: 400, color: t.fg, backgroundColor: t.white, border: `1.5px solid ${t.border}`, borderRadius: '10px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s ease' },
  select: { width: '100%', fontSize: '14px', fontWeight: 400, color: t.fg, backgroundColor: t.white, border: `1.5px solid ${t.border}`, borderRadius: '10px', padding: '12px 14px', outline: 'none', boxSizing: 'border-box' as const, appearance: 'none' as const, cursor: 'pointer' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  /* Options visuelles */
  optGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  optGridSm: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  opt: (active: boolean): CSSProperties => ({
    border: `2px solid ${active ? t.brand : t.border}`,
    backgroundColor: active ? t.brandLight : t.white,
    borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 600,
    color: active ? t.brand : t.fg,
    textAlign: 'center' as const, transition: 'all 0.15s ease',
  }),
  /* Toggle checkbox */
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', border: `1.5px solid ${t.border}`, marginBottom: '10px', cursor: 'pointer' },
  toggleLabel: { fontSize: '13px', fontWeight: 500, color: t.fg },
  toggle: (on: boolean): CSSProperties => ({
    width: '40px', height: '22px', borderRadius: '999px',
    backgroundColor: on ? t.brand : t.border,
    position: 'relative' as const, transition: 'background-color 0.2s ease', flexShrink: 0,
  }),
  toggleThumb: (on: boolean): CSSProperties => ({
    position: 'absolute' as const, top: '3px',
    left: on ? '21px' : '3px',
    width: '16px', height: '16px', borderRadius: '999px',
    backgroundColor: t.white, transition: 'left 0.2s ease',
  }),
  /* Navigation */
  navBtns: { display: 'flex', gap: '12px', justifyContent: 'space-between' },
  btnSecondary: { display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 24px', borderRadius: '999px', border: `1.5px solid ${t.border}`, backgroundColor: t.white, fontSize: '14px', fontWeight: 600, color: t.fg, cursor: 'pointer' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '6px', padding: '13px 28px', borderRadius: '999px', backgroundColor: t.brand, fontSize: '14px', fontWeight: 600, color: t.white, cursor: 'pointer', border: 'none', marginLeft: 'auto' },
  /* Hint */
  hint: { fontSize: '11px', fontWeight: 400, color: t.muted, marginTop: '6px' },
  /* Récap étape 4 */
  mention: { fontSize: '12px', fontWeight: 300, color: t.muted, lineHeight: 1.6, marginBottom: '24px' },
}

const STEPS = [
  { n: 1, label: 'Le bien' },
  { n: 2, label: 'État' },
  { n: 3, label: 'Contexte' },
  { n: 4, label: 'Contact' },
]

/* ─────────────────────────────────────────────────────────────
   Composants d'étapes
───────────────────────────────────────────────────────────── */

function Step1() {
  const { type_bien, adresse, surface, nb_pieces, etage, annee_construction, setField } = useVendreStore()
  return (
    <div>
      <p style={s.cardEyebrow}>Étape 1 sur 4</p>
      <h1 style={s.cardTitle}>Votre bien</h1>
      <p style={s.cardSub}>Renseignez les informations principales de votre bien immobilier.</p>

      {/* Type de bien */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Type de bien</label>
        <div style={s.optGrid}>
          {([['appartement', '🏢 Appartement'], ['maison', '🏠 Maison'], ['terrain', '🌿 Terrain'], ['autre', '🏗️ Autre']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={s.opt(type_bien === v)} onClick={() => setField('type_bien', v as never)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Adresse */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Adresse du bien</label>
        <input style={s.input} type="text" placeholder="12 rue de la Paix, Cotignac" value={adresse} onChange={(e) => setField('adresse', e.target.value)} />
        <p style={s.hint}>Adresse complète pour une estimation précise</p>
      </div>

      {/* Surface + Pièces */}
      <div style={s.row}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Surface habitable (m²)</label>
          <input style={s.input} type="number" placeholder="85" value={surface} onChange={(e) => setField('surface', e.target.value)} min="1" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Nombre de pièces</label>
          <input style={s.input} type="number" placeholder="4" value={nb_pieces} onChange={(e) => setField('nb_pieces', e.target.value)} min="1" />
        </div>
      </div>

      {/* Étage + Année */}
      <div style={s.row}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Étage (optionnel)</label>
          <input style={s.input} type="number" placeholder="2" value={etage} onChange={(e) => setField('etage', e.target.value)} min="0" />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Année de construction</label>
          <input style={s.input} type="number" placeholder="1985" value={annee_construction} onChange={(e) => setField('annee_construction', e.target.value)} min="1800" max="2025" />
        </div>
      </div>
    </div>
  )
}

function Step2() {
  const { etat, garage, parking, cave, exterieur, cuisine_equipee, double_vitrage, dpe, setField } = useVendreStore()
  return (
    <div>
      <p style={s.cardEyebrow}>Étape 2 sur 4</p>
      <h1 style={s.cardTitle}>État &amp; prestations</h1>
      <p style={s.cardSub}>Ces critères impactent directement la valeur estimée de votre bien.</p>

      {/* État général */}
      <div style={s.fieldGroup}>
        <label style={s.label}>État général</label>
        <div style={s.optGrid}>
          {([['a_renover', '🔨 À rénover'], ['bon_etat', '👍 Bon état'], ['tres_bon_etat', '✨ Très bon état'], ['neuf', '🏆 Neuf']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={s.opt(etat === v)} onClick={() => setField('etat', v as never)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Annexes */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Annexes</label>
        {[['garage', '🚗 Garage', garage], ['parking', '🅿️ Parking', parking], ['cave', '📦 Cave', cave]].map(([key, label, val]) => (
          <div key={key as string} style={s.toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={s.toggleLabel}>{label as string}</span>
            <div style={s.toggle(val as boolean)}>
              <div style={s.toggleThumb(val as boolean)} />
            </div>
          </div>
        ))}
      </div>

      {/* Extérieur */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Extérieur</label>
        <div style={s.optGridSm}>
          {([['aucun', 'Aucun'], ['balcon', '🌿 Balcon'], ['terrasse', '☀️ Terrasse'], ['jardin', '🌳 Jardin']] as [string, string][]).map(([v, l]) => (
            <button key={v} style={s.opt(exterieur === v)} onClick={() => setField('exterieur', v as never)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Équipements */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Équipements</label>
        {[['cuisine_equipee', '🍳 Cuisine équipée', cuisine_equipee], ['double_vitrage', '🪟 Double vitrage', double_vitrage]].map(([key, label, val]) => (
          <div key={key as string} style={s.toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={s.toggleLabel}>{label as string}</span>
            <div style={s.toggle(val as boolean)}>
              <div style={s.toggleThumb(val as boolean)} />
            </div>
          </div>
        ))}
      </div>

      {/* DPE */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Diagnostic de Performance Énergétique (DPE)</label>
        <div style={s.optGridSm}>
          {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NC'] as string[]).map((v) => (
            <button key={v} style={s.opt(dpe === v)} onClick={() => setField('dpe', v as never)}>{v === 'NC' ? '?' : v}</button>
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
      <p style={s.cardEyebrow}>Étape 3 sur 4</p>
      <h1 style={s.cardTitle}>Contexte de vente</h1>
      <p style={s.cardSub}>Quelques questions sur votre projet pour affiner l&apos;estimation.</p>

      {/* Délai */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Délai de vente souhaité</label>
        <div style=...s.optGrid, gridTemplateColumns: '1fr'>
          {([['urgent', '🔥 Urgent — moins de 3 mois'], ['3_6_mois', '📅 3 à 6 mois'], ['6_mois_plus', '🗓️ Plus de 6 mois']] as [string, string][]).map(([v, l]) => (
            <button key={v} style=...s.opt(delai === v), textAlign: 'left' as const onClick={() => setField('delai', v as never)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Occupation + Déjà estimé */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Informations complémentaires</label>
        {[['occupe', '🔑 Bien actuellement occupé', occupe], ['deja_estime', '📋 Déjà estimé par un professionnel', deja_estime]].map(([key, label, val]) => (
          <div key={key as string} style={s.toggleRow} onClick={() => setField(key as never, !val as never)}>
            <span style={s.toggleLabel}>{label as string}</span>
            <div style={s.toggle(val as boolean)}>
              <div style={s.toggleThumb(val as boolean)} />
            </div>
          </div>
        ))}
      </div>

      {/* Prix souhaité */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Prix de vente espéré (optionnel)</label>
        <input style={s.input} type="number" placeholder="250000" value={prix_souhaite} onChange={(e) => setField('prix_souhaite', e.target.value)} min="0" />
        <p style={s.hint}>En euros — laissez vide si vous n&apos;avez pas d&apos;idée précise</p>
      </div>
    </div>
  )
}

function Step4() {
  const { prenom, nom, telephone, email, setField } = useVendreStore()
  return (
    <div>
      <p style={s.cardEyebrow}>Étape 4 sur 4</p>
      <h1 style={s.cardTitle}>Vos coordonnées</h1>
      <p style={s.cardSub}>Pour recevoir votre estimation personnalisée par email et accéder aux résultats.</p>

      <div style={s.row}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Prénom</label>
          <input style={s.input} type="text" placeholder="Marie" value={prenom} onChange={(e) => setField('prenom', e.target.value)} />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Nom</label>
          <input style={s.input} type="text" placeholder="Dupont" value={nom} onChange={(e) => setField('nom', e.target.value)} />
        </div>
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Téléphone</label>
        <input style={s.input} type="tel" placeholder="06 12 34 56 78" value={telephone} onChange={(e) => setField('telephone', e.target.value)} />
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="marie.dupont@email.fr" value={email} onChange={(e) => setField('email', e.target.value)} />
        <p style={s.hint}>Votre estimation sera envoyée à cette adresse</p>
      </div>

      <p style={s.mention}>
        En soumettant ce formulaire, vous acceptez d&apos;être contacté par Alex Lopez dans le cadre de votre projet immobilier. Vos données sont traitées conformément au RGPD et ne seront jamais revendues.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Validation par étape
───────────────────────────────────────────────────────────── */
function canProceed(step: number, store: ReturnType<typeof useVendreStore>): boolean {
  if (step === 1) return !!store.type_bien && !!store.adresse.trim() && !!store.surface && !!store.nb_pieces
  if (step === 2) return !!store.etat && !!store.dpe
  if (step === 3) return !!store.delai
  if (step === 4) return !!store.prenom.trim() && !!store.nom.trim() && !!store.telephone.trim() && !!store.email.trim()
  return false
}

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
export default function VendrePage() {
  const store = useVendreStore()
  const { step, nextStep, prevStep } = store
  const progress = ((step - 1) / 3) * 100
  const valid = canProceed(step, store)

  return (
    <div style={s.page}>
      {/* Navbar */}
      <header style={s.nav}>
        <div style={s.navInner}>
          <Link href="/" style={s.navBack}>
            <ChevronLeft size={16} />
            Retour aux outils
          </Link>
          <a href="tel:+33613180168" style={s.navPhone}>
            <Phone size={14} color={t.brand} />
            06 13 18 01 68
          </a>
        </div>
      </header>

      <main style={s.main}>
        {/* Barre de progression */}
        <div style={s.progressWrap}>
          <div style={s.progressHeader}>
            <span style={s.progressLabel}>
              <Home size={12} style=marginRight: '5px', display: 'inline' />
              Estimation vendeur
            </span>
            <span style={s.progressCount}>Étape {step} / 4</span>
          </div>
          <div style={s.progressBar}>
            <div style={s.progressFill(progress)} />
          </div>
          <div style={s.steps}>
            {STEPS.map((st) => (
              <div key={st.n} style={s.stepDot(step === st.n, step > st.n)}>
                {step > st.n ? <Check size={12} /> : st.n}
              </div>
            ))}
          </div>
        </div>

        {/* Carte formulaire */}
        <div style={s.card}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* Boutons navigation */}
        <div style={s.navBtns}>
          {step > 1 ? (
            <button style={s.btnSecondary} onClick={prevStep}>
              <ChevronLeft size={16} /> Précédent
            </button>
          ) : <div />}
          <button
            style=
              ...s.btnPrimary,
              backgroundColor: valid ? t.brand : t.border,
              cursor: valid ? 'pointer' : 'not-allowed',
            
            onClick={valid ? nextStep : undefined}
            disabled={!valid}
          >
            {step === 4 ? 'Obtenir mon estimation' : 'Continuer'}
            <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  )
}
