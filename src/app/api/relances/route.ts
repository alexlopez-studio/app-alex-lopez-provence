import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lead_id, titre, type, scheduled_at } = body

    if (!lead_id || !scheduled_at) {
      return NextResponse.json({ error: 'lead_id et scheduled_at requis' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('[POST /api/relances] Missing Supabase env vars')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const svc = createClient(url, key)

    // Dériver le tenant_id depuis le lead — plus besoin de DEFAULT_TENANT_ID
    const { data: lead, error: leadErr } = await svc
      .from('leads')
      .select('tenant_id')
      .eq('id', lead_id)
      .single()

    if (leadErr || !lead) {
      console.error('[POST /api/relances] Lead introuvable:', leadErr)
      return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
    }

    const { data, error } = await svc
      .from('relances')
      .insert([{
        lead_id,
        tenant_id:    lead.tenant_id,
        titre:        titre ?? null,
        type:         type  ?? 'appel',
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
