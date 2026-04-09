import { NextRequest, NextResponse } from 'next/server'

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
          const props = feature.properties
          result.parcelle = {
            id:        (props.section ?? '') + (props.numero ?? ''),
            commune:   props.nom_com ?? '',
            surface:   props.contenance ? Math.round(props.contenance / 100) : null,
          }
        }
      }
    } catch { /* ignore */ }
  }

  // DPE ADEME (adresses fr uniquement)
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
