/**
 * API adresse-infos — données officielles liées à une adresse
 *
 * Sources :
 * - Cadastre IGN (Apicarto) : parcelle, surface terrain
 * - DPE ADEME : classe énergétique A-G
 * - BDNB (Base de Données Nationale des Bâtiments) :
 *   année de construction, surface, type de chauffage, DPE estimé
 *   API publique : https://api.bdnb.io/doc
 */

import { NextRequest, NextResponse } from 'next/server'

/** Normalise une chaîne pour comparaison : minuscule + sans accents */
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

/** Vérifie que la commune IGN correspond à l'adresse */
function communeMatch(cadastreCommune: string, addressLabel: string): boolean {
  if (!cadastreCommune) return false
  return normalize(addressLabel).includes(normalize(cadastreCommune))
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat')
  const lng = req.nextUrl.searchParams.get('lng')
  const q   = req.nextUrl.searchParams.get('q') ?? ''

  const result: Record<string, unknown> = {}

  /* ─── 1. Cadastre IGN Apicarto ─── */
  if (lat && lng) {
    try {
      const url  = 'https://apicarto.ign.fr/api/cadastre/parcelle?lon=' + lng + '&lat=' + lat + '&_limit=1'
      const res  = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 3600 } })
      if (res.ok) {
        const data    = await res.json()
        const feature = data?.features?.[0]
        if (feature) {
          const props   = feature.properties
          const commune = props.nom_com ?? ''
          if (communeMatch(commune, q)) {
            result.parcelle = {
              id:      (props.section ?? '') + (props.numero ?? ''),
              commune,
              surface: props.contenance ? Math.round(props.contenance / 100) : null,
            }
          }
        }
      }
    } catch { /* ignore */ }
  }

  /* ─── 2. DPE ADEME ─── */
  if (q) {
    try {
      const url  = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?size=1&q=' + encodeURIComponent(q) + '&q_fields=adresse_ban&select=classe_consommation_energie,annee_construction_dpe,type_energie_principale_chauffage'
      const res  = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data   = await res.json()
        const hit    = data?.results?.[0]
        if (hit) {
          const lettre = hit.classe_consommation_energie
          if (lettre && /^[A-G]$/.test(lettre)) {
            result.dpe = {
              lettre,
              annee_construction: hit.annee_construction_dpe ?? null,
              chauffage:          hit.type_energie_principale_chauffage ?? null,
            }
          }
        }
      }
    } catch { /* ignore */ }
  }

  /* ─── 3. BDNB (Base de Données Nationale des Bâtiments) ─── */
  if (lat && lng) {
    try {
      /**
       * L'API BDNB publique est disponible sans clé via :
       * https://api.bdnb.io/api/v1/batiment_groupe?lat={lat}&lon={lon}&limit=3
       *
       * Elle retourne des données de groupes de bâtiments proches
       * incluant surface, année de construction, DPE estimé, type de chauffage.
       *
       * Note : une inscription gratuite peut être nécessaire pour certains endpoints.
       * En cas d'échec, on retourne null silencieusement.
       */
      const url  = 'https://api.bdnb.io/api/v1/batiment_groupe?lat=' + lat + '&lon=' + lng + '&limit=3&ordering=distance'
      const res  = await fetch(url, {
        headers: { Accept: 'application/json' },
        next:    { revalidate: 3600 },
      })

      if (res.ok) {
        const data    = await res.json()
        const batData = data?.data?.[0] ?? data?.results?.[0] ?? null

        if (batData) {
          result.bdnb = {
            annee_construction:     batData.annee_construction ?? null,
            surface_batiment:       batData.surface_habitable   ?? batData.surface ?? null,
            type_chauffage:         batData.type_chauffage       ?? null,
            dpe_classe:             batData.classe_dpe           ?? batData.etiquette_dpe ?? null,
            nb_logements:           batData.nb_logements         ?? null,
            hauteur_batiment:       batData.hauteur              ?? null,
          }
        }
      }
    } catch { /* BDNB optionnel — pas bloquant */ }
  }

  return NextResponse.json(result)
}
