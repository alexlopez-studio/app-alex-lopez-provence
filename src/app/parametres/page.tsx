import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CrmLayout from '@/components/crm/CrmLayout'
import type { CSSProperties } from 'react'

const fg   = '#0F172A'
const muted = '#64748B'
const pageWrap: CSSProperties  = { padding: '32px' }
const pageTitle: CSSProperties = { fontSize: '22px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px' }
const pageSub: CSSProperties   = { fontSize: '13px', fontWeight: 300, color: muted }

export default async function ParametresPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')
  return (
    <CrmLayout>
      <div style={pageWrap}>
        <h1 style={pageTitle}>Param\u00e8tres</h1>
        <p style={pageSub}>{'Configuration du compte et int\u00e9grations.'}</p>
      </div>
    </CrmLayout>
  )
}
