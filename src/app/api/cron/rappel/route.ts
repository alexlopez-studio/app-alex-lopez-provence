import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url      = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key      = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.SUPERADMIN_EMAIL ?? 'alexlopezstudio@gmail.com'

  if (!url || !key || !resendKey) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  const svc   = createClient(url, key)
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(),  0,  0,  0).toISOString()
  const end   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

  const { data: relances } = await svc
    .from('relances')
    .select('*, leads(id, prenom, nom, telephone)')
    .eq('statut', 'planifiee')
    .gte('scheduled_at', start)
    .lte('scheduled_at', end)
    .order('scheduled_at', { ascending: true })

  if (!relances || relances.length === 0) {
    return NextResponse.json({ sent: false, reason: "Aucune tâche aujourd'hui" })
  }

  const TYPE_LBL: Record<string, string> = {
    appel: '📞 Appel',
    email: '✉️ Email',
    sms:   '💬 SMS',
    rdv:   '🤝 RDV',
  }

  const rows = (relances as Record<string, unknown>[]).map((r) => {
    const lead  = r.leads as Record<string, string> | null
    const name  = lead ? ((lead.prenom ?? '') + ' ' + (lead.nom ?? '')).trim() : 'Prospect'
    const heure = new Date(r.scheduled_at as string).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const type  = TYPE_LBL[r.type as string] ?? String(r.type)
    const titre = r.titre ? ` — ${r.titre}` : ''
    const tel   = lead?.telephone ? ` · ${lead.telephone}` : ''
    return `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#64748B">${heure}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-size:13px;font-weight:600;color:#0F172A">${type}${titre}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#0F172A"><strong>${name}</strong>${tel}</td>
    </tr>`
  }).join('')

  const dayLabel = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const count    = relances.length

  const html = `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0F172A">
    <div style="background:#0066FF;border-radius:14px;padding:22px 28px;margin-bottom:28px">
      <p style="color:#EFF6FF;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;margin:0 0 6px">Planning du jour — ${dayLabel}</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0;letter-spacing:-0.02em">${count} tâche${count > 1 ? 's' : ''} aujourd'hui</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden">
      <thead>
        <tr style="background:#F8FAFC">
          <th style="padding:10px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B;text-align:left">Heure</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B;text-align:left">Action</th>
          <th style="padding:10px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B;text-align:left">Prospect</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:12px;color:#94A3B8;margin-top:20px;text-align:center">Alex Lopez · Mandataire IAD Provence Verte &amp; Haut-Var</p>
  </div>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + resendKey },
    body: JSON.stringify({
      from: 'Alex Lopez CRM <crm@alexlopez-provence.fr>',
      to:   [adminEmail],
      subject: `📋 ${count} tâche${count > 1 ? 's' : ''} aujourd'hui — ${dayLabel}`,
      html,
    }),
  })

  return NextResponse.json({ sent: true, count })
}
