import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lead_id, titre, type, scheduled_at } = body

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const tid = process.env.DEFAULT_TENANT_ID

    if (!url || !key || !tid) {
      console.error('[POST /api/relances] Missing env vars')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const svc = createClient(url, key)
    const { data, error } = await svc
      .from('relances')
      .insert([{
        lead_id,
        tenant_id: tid,
        titre:       titre ?? null,
        type:        type  ?? 'appel',
        scheduled_at,
        statut: 'planifiee',
      }])
      .select()
      .single()

    if (error) {
      console.error('[POST /api/relances] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (e) {
    console.error('[POST /api/relances]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
