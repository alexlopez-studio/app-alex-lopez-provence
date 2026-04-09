import { NextRequest, NextResponse } from 'next/server'

/** Normalise une chaîne pour comparaison : minuscule + sans accents */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Vérifie que la commune du cadastre est cohérente avec l'adresse.
 * Ex : "Pontevès" doit être présent dans "56 Chemin des Aires 83670 Pontevès".
 * Evite les retours IGN incohérents (mauvais département, etc.)
 */
function communeMatch(cadastreCommune: string, addressLabel: string): boolean {
  if (!cadastreCommune) return false
  const normCommune = normalize(cadastreCommune)
  const normAddress = normalize(addressLabel)
  // On accepte si la commune IGN est contenue dans le libellé de l'adresse
  return normAddress.includes(normCommune)
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat')
  const lng = req.nextUrl.searchParams.get('lng')
  const q   = req.nextUrl.searchParams.get('q') ?? ''

  const result: Record<string, unknown> = {}

  // Parcelle IGN Apicarto
  if (lat && lng) {
    try {
      const url = 'https://apicarto.ign.fr/api/cadastre/parcelle?lon=' + lng + '&lat=' + lat + '&_limit=1'
      const res  = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 3600 } })
      if (res.ok) {
        const data    = await res.json()
        const feature = data?.features?.[0]
        if (feature) {
          const props   = feature.properties
          const commune = props.nom_com ?? ''
          /* Validation : la commune IGN doit correspondre à l'adresse */
          if (communeMatch(commune, q)) {
            result.parcelle = {
              id:      (props.section ?? '') + (props.numero ?? ''),
              commune,
              surface: props.contenance ? Math.round(props.contenance / 100) : null,
            }
          }
          /* Sinon on ignore silencieusement la parcelle */
        }
      }
    } catch { /* ignore */ }
  }

  // DPE ADEME
  if (q) {
    try {
      const url = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?size=1&q=' + encodeURIComponent(q) + '&q_fields=adresse_ban&select=classe_consommation_energie'
      const res  = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data   = await res.json()
        const lettre = data?.results?.[0]?.classe_consommation_energie
        if (lettre && /^[A-G]$/.test(lettre)) {
          result.dpe = { lettre }
        }
      }
    } catch { /* ignore */ }
  }

  return NextResponse.json(result)
}
