'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { CSSProperties } from 'react'
import { Phone, Download, CheckCircle, TrendingUp, Home, Calendar, ArrowRight } from 'lucide-react'
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

/* ─── Styles ─── */
const pageStyle: CSSProperties    = { minHeight: '100vh', backgroundColor: surface, fontFamily: 'var(--font-inter), system-ui, sans-serif' }
const navStyle: CSSProperties     = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '14px 20px' }
const navInner: CSSProperties     = { maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeft: CSSProperties      = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarSt: CSSProperties     = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }
const navName: CSSProperties      = { fontSize: '14px', fontWeight: 700, color: fg }
const navSub: CSSProperties       = { fontSize: '11px', color: muted }
const phoneSt: CSSProperties      = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: fg, textDecoration: 'none' }
const wrap: CSSProperties         = { maxWidth: '760px', margin: '0 auto', padding: '32px 20px 60px' }

/* Bandeau succès */
const successBand: CSSProperties  = { backgroundColor: success + '18', border: '1px solid ' + success + '40', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }
const successText: CSSProperties  = { fontSize: '14px', fontWeight: 600, color: success }
const successSub: CSSProperties   = { fontSize: '12px', fontWeight: 400, color: success + 'cc' }

/* Card principale — estimation */
const mainCard: CSSProperties     = { backgroundColor: white, borderRadius: '20px', border: '1px solid ' + border, padding: '32px', marginBottom: '20px' }
const eyebrow: CSSProperties      = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: brand, marginBottom: '6px' } as CSSProperties
const priceRange: CSSProperties   = { fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px' }
const priceSub: CSSProperties     = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '28px' }
const priceRow: CSSProperties     = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }
const priceBox: CSSProperties     = { backgroundColor: surface, borderRadius: '12px', padding: '16px', textAlign: 'center' } as CSSProperties
const priceBoxLabel: CSSProperties = { fontSize: '10px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '6px' } as CSSProperties
const priceBoxVal: CSSProperties  = { fontSize: '18px', fontWeight: 800, color: fg }
const dividerSt: CSSProperties    = { height: '1px', backgroundColor: border, margin: '24px 0' }
const detailGrid: CSSProperties   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const detailItem: CSSProperties   = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: surface, borderRadius: '10px' }
const detailLabel: CSSProperties  = { fontSize: '12px', fontWeight: 500, color: muted }
const detailVal: CSSProperties    = { fontSize: '13px', fontWeight: 600, color: fg }

/* Cards secondaires */
const cardsRow: CSSProperties     = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }
const smallCard: CSSProperties    = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px' }
const smallCardTitle: CSSProperties = { fontSize: '13px', fontWeight: 700, color: fg, marginBottom: '8px' }
const smallCardText: CSSProperties = { fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6 }

/* CTA */
const ctaCard: CSSProperties      = { backgroundColor: brandLight, borderRadius: '20px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }
const ctaTitle: CSSProperties     = { fontSize: '18px', fontWeight: 800, color: fg, marginBottom: '6px', letterSpacing: '-0.02em' }
const ctaSub: CSSProperties       = { fontSize: '13px', fontWeight: 300, color: muted }
const ctaBtn: CSSProperties       = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: brand, color: white, fontSize: '13px', fontWeight: 600, padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', flexShrink: 0 }

/* Confiance */
const confidBar: CSSProperties    = { marginBottom: '28px' }
const confidLabel: CSSProperties  = { fontSize: '12px', fontWeight: 600, color: fg, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }
const confidTrack: CSSProperties  = { height: '8px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden' }
const confidFill: CSSProperties   = { height: '100%', borderRadius: '999px', backgroundColor: success, transition: 'width 1s ease' }

/* ─── Helpers format ─── */
function formatEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

/* ─── Types ─── */
interface LeadData {
  prenom?: string
  adresse?: string
  type_bien?: string
  surface?: number
  nb_pieces?: number
  etat?: string
  delai?: string
  equipements?: string[]
}

/* ─── Calcul estimation (MVP — sans DVF) ─── */
function computeEstimation(data: LeadData): { bas: number; median: number; haut: number; confiance: number; prixM2: number } {
  const surface = data.surface ?? 100
  /* Prix médian Provence Verte par type */
  const baseM2: Record<string, number> = { appartement: 2800, maison: 3200, terrain: 120, commerce: 1800, immeuble: 2200, autre: 2500 }
  let prixM2 = baseM2[data.type_bien ?? 'maison'] ?? 2800
  /* Coefficients état */
  const etatCoef: Record<string, number> = { neuf: 1.2, tres_bon_etat: 1.08, bon_etat: 1.0, rafraichir: 0.92, travaux: 0.82 }
  prixM2 *= etatCoef[data.etat ?? 'bon_etat'] ?? 1.0
  /* Équipements bonus */
  const eq = data.equipements ?? []
  if (eq.includes('Piscine'))         prixM2 *= 1.05
  if (eq.includes('Vue exceptionnelle')) prixM2 *= 1.07
  if (eq.includes('Jardin'))          prixM2 *= 1.03
  /* Fourchette */
  const median = Math.round(prixM2 * surface / 1000) * 1000
  const bas    = Math.round(median * 0.93 / 1000) * 1000
  const haut   = Math.round(median * 1.07 / 1000) * 1000
  /* Indice de confiance basé sur la complétude */
  const fields = [data.adresse, data.type_bien, data.surface, data.nb_pieces, data.etat]
  const confiance = Math.round((fields.filter(Boolean).length / fields.length) * 75 + 15)
  return { bas, median, haut, confiance, prixM2: Math.round(prixM2) }
}

/* ─── Labels ─── */
const ETAT_LABELS: Record<string, string> = { neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état', rafraichir: 'À rafraîchir', travaux: 'Travaux importants' }
const BIEN_LABELS: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', immeuble: 'Immeuble', autre: 'Autre' }
const DELAI_LABELS: Record<string, string> = { immediat: 'Immédiat', '1_3_mois': '1 – 3 mois', '3_6_mois': '3 – 6 mois', '6_mois': '+6 mois', pas_decide: 'Pas décidé' }

/* ─── Composant principal ─── */
export default function ResultatsPage() {
  const { token } = useParams() as { token: string }
  const [data, setData] = useState<LeadData>({})
  const [prenom, setPrenom] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    /* Récupère les données depuis l'API ou le store Zustand via localStorage */
    try {
      const raw = localStorage.getItem('vendre-store')
      if (raw) {
        const parsed = JSON.parse(raw)
        const state = parsed?.state ?? parsed
        setData(state?.answers ?? {})
        setPrenom(state?.answers?.prenom ?? '')
      }
    } catch { /* ignore */ }
    setLoaded(true)
  }, [token])

  if (!loaded) {
    const loadingWrap: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }
    const loadingText: CSSProperties = { fontSize: '16px', fontWeight: 500, color: muted }
    return <div style={pageStyle}><div style={loadingWrap}><p style={loadingText}>Préparation de votre estimation...</p></div></div>
  }

  const est = computeEstimation(data)

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <header style={navStyle}>
        <div style={navInner}>
          <div style={navLeft}>
            <div style={avatarSt}>AL</div>
            <div>
              <div style={navName}>Alex Lopez</div>
              <div style={navSub}>Mandataire IAD · Provence Verte</div>
            </div>
          </div>
          <a href="tel:+33613180168" style={phoneSt}>
            <Phone size={13} color={brand} />
            06 13 18 01 68
          </a>
        </div>
      </header>

      <main style={wrap}>
        {/* Bandeau confirmation */}
        <div style={successBand}>
          <CheckCircle size={22} color={success} />
          <div>
            <div style={successText}>Estimation générée avec succès</div>
            <div style={successSub}>{prenom ? 'Bonjour ' + prenom + ' !' : ''} Un email de confirmation vous a été envoyé.</div>
          </div>
        </div>

        {/* Card estimation principale */}
        <div style={mainCard}>
          <p style={eyebrow}>🏠 Votre estimation</p>
          <p style={priceRange}>{formatEur(est.bas)} — {formatEur(est.haut)}</p>
          <p style={priceSub}>Fourchette estimée basée sur le marché local de Provence Verte</p>

          {/* 3 colonnes prix */}
          <div style={priceRow}>
            <div style={priceBox}>
              <div style={priceBoxLabel}>Estimation basse</div>
              <div style=...priceBoxVal, color: muted>{formatEur(est.bas)}</div>
            </div>
            <div style=...priceBox, backgroundColor: brandLight, border: '2px solid ' + brand>
              <div style=...priceBoxLabel, color: brand>Valeur estimée</div>
              <div style=...priceBoxVal, color: brand>{formatEur(est.median)}</div>
            </div>
            <div style={priceBox}>
              <div style={priceBoxLabel}>Estimation haute</div>
              <div style=...priceBoxVal, color: muted>{formatEur(est.haut)}</div>
            </div>
          </div>

          {/* Prix au m² */}
          <div style=...surface, backgroundColor: surface, borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'>
            <span style=fontSize: '13px', fontWeight: 500, color: muted>Prix au m² estimé</span>
            <span style=fontSize: '15px', fontWeight: 800, color: fg>{est.prixM2.toLocaleString('fr-FR')} €/m²</span>
          </div>

          {/* Indice de confiance */}
          <div style={confidBar}>
            <div style={confidLabel}>
              <span>Indice de fiabilité</span>
              <span style=color: success>{est.confiance}%</span>
            </div>
            <div style={confidTrack}>
              <div style=...confidFill, width: est.confiance + '%' />
            </div>
          </div>

          <div style={dividerSt} />

          {/* Détails du bien */}
          <p style=fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.14em'>Récapitulatif du bien</p>
          <div style={detailGrid}>
            {data.adresse && (
              <div style=...detailItem, gridColumn: '1 / -1'>
                <Home size={14} color={brand} />
                <div>
                  <div style={detailLabel}>Adresse</div>
                  <div style={detailVal}>{data.adresse}</div>
                </div>
              </div>
            )}
            {data.type_bien && (
              <div style={detailItem}>
                <div>
                  <div style={detailLabel}>Type de bien</div>
                  <div style={detailVal}>{BIEN_LABELS[data.type_bien] ?? data.type_bien}</div>
                </div>
              </div>
            )}
            {data.surface && (
              <div style={detailItem}>
                <div>
                  <div style={detailLabel}>Surface</div>
                  <div style={detailVal}>{data.surface} m²</div>
                </div>
              </div>
            )}
            {data.nb_pieces && (
              <div style={detailItem}>
                <div>
                  <div style={detailLabel}>Pièces</div>
                  <div style={detailVal}>{data.nb_pieces} pièce{Number(data.nb_pieces) > 1 ? 's' : ''}</div>
                </div>
              </div>
            )}
            {data.etat && (
              <div style={detailItem}>
                <div>
                  <div style={detailLabel}>État général</div>
                  <div style={detailVal}>{ETAT_LABELS[data.etat] ?? data.etat}</div>
                </div>
              </div>
            )}
            {data.delai && (
              <div style={detailItem}>
                <Calendar size={14} color={brand} />
                <div>
                  <div style={detailLabel}>Délai souhaité</div>
                  <div style={detailVal}>{DELAI_LABELS[data.delai] ?? data.delai}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards conseils */}
        <div style={cardsRow}>
          <div style={smallCard}>
            <div style=display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'>
              <TrendingUp size={16} color={brand} />
              <span style={smallCardTitle}>Conseil du marché</span>
            </div>
            <p style={smallCardText}>Le marché immobilier en Provence Verte est actif. Les biens bien présentés se vendent en 60 à 90 jours en moyenne.</p>
          </div>
          <div style={smallCard}>
            <div style=display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'>
              <CheckCircle size={16} color={success} />
              <span style={smallCardTitle}>Prochaine étape</span>
            </div>
            <p style={smallCardText}>Une estimation précise nécessite une visite du bien. Alex Lopez se déplace gratuitement pour affiner cette fourchette.</p>
          </div>
        </div>

        {/* CTA contact */}
        <div style={ctaCard}>
          <div>
            <div style={ctaTitle}>Affiner cette estimation ?</div>
            <div style={ctaSub}>Alex Lopez se déplace gratuitement · Sans engagement · Sous 48h</div>
          </div>
          <a href="tel:+33613180168" style={ctaBtn}>
            <Phone size={14} />
            06 13 18 01 68
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Bouton nouvelle estimation */}
        <div style=textAlign: 'center', marginTop: '24px'>
          <Link href="/vendre" style=fontSize: '13px', fontWeight: 500, color: muted, textDecoration: 'none'>
            Faire une nouvelle estimation
          </Link>
        </div>
      </main>
    </div>
  )
}
