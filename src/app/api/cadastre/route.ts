import { NextRequest, NextResponse } from 'next/server'

const IGN_URL = 'https://apicarto.ign.fr/api/cadastre/parcelle'

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat')
  const lng = req.nextUrl.searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat et lng requis' }, { status: 400 })
  }

  try {
    const url = IGN_URL + '?lon=' + lng + '&lat=' + lat + '&_limit=1'
    const res  = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      return NextResponse.json({ surface: null })
    }

    const data = await res.json()
    const feature = data?.features?.[0]

    if (!feature) {
      return NextResponse.json({ surface: null })
    }

    // contenance est en m² dans l'API Cadastre IGN
    const surface = feature.properties?.contenance ?? null

    return NextResponse.json({ surface })
  } catch {
    // En cas d'erreur (timeout, CORS, etc.), on retourne null sans bloquer
    return NextResponse.json({ surface: null })
  }
}
