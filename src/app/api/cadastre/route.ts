import { NextRequest, NextResponse } from 'next/server'

const IGN_URL = 'https://apicarto.ign.fr/api/cadastre/parcelle'

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat')
    const lng = req.nextUrl.searchParams.get('lng')
    if (!lat || !lng) return NextResponse.json({ surface: null })

    const url = IGN_URL + '?lon=' + lng + '&lat=' + lat + '&_limit=1'
    const res  = await fetch(url, { headers: { 'Accept': 'application/json' }, next: { revalidate: 3600 } })

    if (!res.ok) return NextResponse.json({ surface: null })

    const data = await res.json()
    const feature = data?.features?.[0]
    // contenance est en m2 * 100 (en ca) pour certaines versions, ou directement en m2
    const contenance = feature?.properties?.contenance
    const surface = contenance ? Math.round(contenance / 100) : null

    return NextResponse.json({ surface })
  } catch {
    return NextResponse.json({ surface: null })
  }
}
