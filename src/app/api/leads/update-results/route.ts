import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Met à jour le champ `results` d'un lead avec les données DVF calculées.
 * Appelé depuis la page /resultats/[token] après le calcul d'estimation.
 */
export async function POST(req: NextRequest) {
  try {
    const { token, results } = await req.json()

    if (!token || !results) {
      return NextResponse.json({ error: 'token et results requis' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: false, reason: 'env non configuré' })
    }

    const svc = createClient(supabaseUrl, serviceKey)

    const { error } = await svc
      .from('leads')
      .update({ results })
      .eq('token', token)

    if (error) {
      console.error('[update-results]', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[update-results]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
