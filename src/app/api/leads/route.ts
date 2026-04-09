import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, nom, email, telephone, adresse, type_bien, surface, etat, delai, token, type } = body

    /* — 1. Log en développement — */
    if (process.env.NODE_ENV === 'development') {
      console.log('[API /leads] Nouveau lead:', { prenom, nom, email, token })
    }

    /* — 2. Sauvegarde Supabase (optionnel — ajouté après config Supabase) — */
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
    const tenantId     = process.env.DEFAULT_TENANT_ID

    if (supabaseUrl && supabaseKey && tenantId) {
      const res = await fetch(supabaseUrl + '/rest/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          type: type ?? 'vendre',
          prenom: prenom ?? '',
          nom: nom ?? '',
          email: email ?? '',
          telephone: telephone ?? '',
          token: token,
          form_data: { adresse, type_bien, surface, etat, delai },
          statut: 'nouveau',
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('[API /leads] Supabase error:', err)
      }
    }

    /* — 3. Email via Resend (optionnel — ajouté après config clé) — */
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey && email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + resendKey },
        body: JSON.stringify({
          from: 'Alex Lopez <estimation@alexlopez-provence.fr>',
          to: [email],
          subject: 'Votre estimation immobilière - Alex Lopez',
          html: '<h2>Bonjour ' + (prenom ?? '') + ' !</h2><p>Votre estimation a bien été générée. Retrouvez vos résultats sur la page sécurisée qui vient de s\'ouvrir.</p><p>Pour affiner cette estimation avec une visite gratuite, appelez-moi au <strong>06 13 18 01 68</strong>.</p><p>Alex Lopez<br>Mandataire IAD · Provence Verte</p>',
        }),
      }).catch(() => null)
    }

    return NextResponse.json({ success: true, token })
  } catch (e) {
    console.error('[API /leads]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
