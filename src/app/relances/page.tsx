import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import CrmLayout from '@/components/crm/CrmLayout'
import RelancesClient from '@/components/crm/RelancesClient'
import type { RelanceItem } from '@/components/crm/RelancesClient'

export default async function RelancesPage() {
  const cookieStore = await cookies()
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const svc = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: raw } = await svc
    .from('relances')
    .select('id, titre, type, scheduled_at, statut, leads(id, prenom, nom, telephone)')
    .order('scheduled_at', { ascending: true })
    .limit(200)

  const relances: RelanceItem[] = (raw ?? []) as RelanceItem[]

  return (
    <CrmLayout>
      <RelancesClient relances={relances} />
    </CrmLayout>
  )
}
