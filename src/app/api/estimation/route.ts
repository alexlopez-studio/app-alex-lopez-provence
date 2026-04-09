/**
 * Route d'estimation immobilière basée sur les données DVF réelles
 *
 * Sources :
 * - DVF (Demandes de Valeurs Foncières) via l'API Cerema DVF+
 *   https://apidf-preprod.cerema.fr/dvf_opendata/geomutations/
 *   Données publiques des transactions immobilières françaises
 *
 * Logique :
 * 1. Récupérer les ventes DVF dans un rayon de 1km (même type, même surface ±30%)
 * 2. Calculer la médiane du prix au m²
 * 3. Appliquer des coefficients (état, DPE, équipements, délai)
 * 4. Produire une fourchette basse / médiane / haute
 */

import { NextRequest, NextResponse } from 'next/server'

const DVF_API = 'https://apidf-preprod.cerema.fr/dvf_opendata/geomutations/'

/* ─── Coefficients d’ajustement ─── */
const COEF_ETAT: Record<string, number> = {
  neuf:          1.20,
  tres_bon_etat: 1.08,
  bon_etat:      1.00,
  rafraichir:    0.93,
  travaux:       0.82,
}

const COEF_DPE: Record<string, number> = {
  A: 1.06, B: 1.04, C: 1.02, D: 1.00,
  E: 0.98, F: 0.95, G: 0.90, NC: 1.00,
}

function coefEquipements(equipements: string[]): number {
  let c = 1.0
  if (equipements.includes('Piscine'))             c *= 1.06
  if (equipements.includes('Vue exceptionnelle'))  c *= 1.07
  if (equipements.includes('Jardin'))              c *= 1.03
  if (equipements.includes('Garage'))              c *= 1.02
  if (equipements.includes('Terrasse'))            c *= 1.01
  return c
}

function coefDelai(delai: string): number {
  switch (delai) {
    case 'immediat': return 0.97   // vendeur pressé = légère décote
    case '1_3_mois': return 0.99
    case '3_6_mois': return 1.00
    case '6_mois':   return 1.01
    default:         return 1.00
  }
}

/* ─── Statistiques ─── */
function median(values: number[]): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const idx    = Math.floor((p / 100) * sorted.length)
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))]
}

/* ─── Type DVF mutation ─── */
interface DvfMutation {
  valeur_fonciere: number
  surface_reelle_bati: number
  type_local: string
  date_mutation: string
  code_postal: string
  numero_voie: string
  voie: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      lat, lng,
      surface, surface_terrain,
      type_bien = 'maison',
      etat = 'bon_etat',
      dpe = 'D',
      equipements = [],
      delai = '3_6_mois',
    } = body

    if (!lat || !lng || !surface) {
      return NextResponse.json({ error: 'lat, lng et surface requis' }, { status: 400 })
    }

    /* 1. Mapper type_bien vers type_local DVF */
    const typeLocalDvf = type_bien === 'appartement' ? 'Appartement' : 'Maison'

    /* 2. Date minimale : 3 ans en arrière */
    const dateMin = new Date()
    dateMin.setFullYear(dateMin.getFullYear() - 3)
    const dateMinStr = dateMin.toISOString().split('T')[0]

    /* 3. Appel API DVF Cerema (rayon 1500m) */
    const dvfUrl = DVF_API
      + '?lat=' + lat
      + '&lon=' + lng
      + '&rayon=1500'
      + '&date_mutation_min=' + dateMinStr
      + '&nature_mutation=Vente'
      + '&in_type_local=' + typeLocalDvf
      + '&ordering=-date_mutation'
      + '&limit=100'

    let mutations: DvfMutation[] = []
    let source: 'dvf' | 'fallback' = 'dvf'
    let rayon = 1500

    try {
      const dvfRes = await fetch(dvfUrl, { next: { revalidate: 86400 } })
      if (dvfRes.ok) {
        const dvfData = await dvfRes.json()
        mutations = dvfData.results ?? dvfData.features?.map((f: Record<string, unknown>) => f.properties) ?? []
      }
    } catch { /* DVF API indisponible */ }

    /* 4. Si moins de 5 transactions dans 1.5km, élargir à 5km */
    if (mutations.length < 5) {
      rayon = 5000
      const dvfUrl2 = DVF_API
        + '?lat=' + lat + '&lon=' + lng
        + '&rayon=5000'
        + '&date_mutation_min=' + dateMinStr
        + '&nature_mutation=Vente'
        + '&in_type_local=' + typeLocalDvf
        + '&ordering=-date_mutation&limit=100'

      try {
        const dvfRes2 = await fetch(dvfUrl2, { next: { revalidate: 86400 } })
        if (dvfRes2.ok) {
          const dvfData2 = await dvfRes2.json()
          mutations = dvfData2.results ?? dvfData2.features?.map((f: Record<string, unknown>) => f.properties) ?? []
        }
      } catch { /* ignore */ }
    }

    /* 5. Si toujours pas de données DVF — fallback sur base statique Provence Verte */
    if (mutations.length < 3) {
      source = 'fallback'
      const baseM2: Record<string, number> = {
        maison: 3200, appartement: 2800, terrain: 120, commerce: 1800, immeuble: 2200, autre: 2500
      }
      const prixM2Base = baseM2[type_bien] ?? 2800
      return buildResponse(surface, prixM2Base, etat, dpe, equipements, delai, 0, source, rayon)
    }

    /* 6. Calculer les prix au m² */
    const surfMin = surface * 0.65
    const surfMax = surface * 1.45

    const prixM2List = mutations
      .filter((m) => {
        const s = m.surface_reelle_bati
        return s && s >= surfMin && s <= surfMax && m.valeur_fonciere > 0
      })
      .map((m) => m.valeur_fonciere / m.surface_reelle_bati)
      .filter((p) => p > 500 && p < 20000) // éliminer les valeurs aberrantes

    if (prixM2List.length < 2) {
      source = 'fallback'
      const baseM2: Record<string, number> = { maison: 3200, appartement: 2800, terrain: 120, autre: 2500 }
      return buildResponse(surface, baseM2[type_bien] ?? 2800, etat, dpe, equipements, delai, 0, source, rayon)
    }

    /* 7. Prix médian brut DVF */
    const prixM2Brut = median(prixM2List)

    return buildResponse(surface, prixM2Brut, etat, dpe, equipements, delai, prixM2List.length, source, rayon)

  } catch (e) {
    console.error('[API /estimation]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

function buildResponse(
  surface: number,
  prixM2Brut: number,
  etat: string,
  dpe: string,
  equipements: string[],
  delai: string,
  nbTransactions: number,
  source: string,
  rayon: number
) {
  /* Appliquer les coefficients */
  const coef = (COEF_ETAT[etat] ?? 1.0)
             * (COEF_DPE[dpe]  ?? 1.0)
             * coefEquipements(equipements)
             * coefDelai(delai)

  const prixM2Ajuste = prixM2Brut * coef

  /* Fourchette ±7% */
  const median_val = Math.round(prixM2Ajuste * surface / 1000) * 1000
  const bas        = Math.round(median_val * 0.93 / 1000) * 1000
  const haut       = Math.round(median_val * 1.07 / 1000) * 1000

  /* Indice de confiance */
  let confiance = 40
  if (source === 'dvf') {
    if (nbTransactions >= 20) confiance = 85
    else if (nbTransactions >= 10) confiance = 75
    else if (nbTransactions >= 5)  confiance = 65
    else confiance = 55
  }

  return NextResponse.json({
    fourchette_basse:  bas,
    fourchette_haute:  haut,
    valeur_mediane:    median_val,
    prix_m2_median:    Math.round(prixM2AjustE),
    prix_m2_brut_dvf:  Math.round(prixM2Brut),
    nb_transactions:   nbTransactions,
    rayon_km:          rayon / 1000,
    source,
    confiance,
    generated_at:      new Date().toISOString(),
  })
}
