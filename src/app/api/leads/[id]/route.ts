import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body   = await req.json()

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const svc = createClient(url, key)
    const update: Record<string, string> = {}
    if (body.statut !== undefined) update.statut = body.statut
    if (body.notes  !== undefined) update.notes  = body.notes

    const { error } = await svc.from('leads').update(update).eq('id', id)
    if (error) {
      console.error('[PATCH /api/leads/[id]]', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[PATCH /api/leads/[id]]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
