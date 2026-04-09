import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { env } from './env'

/**
 * Client Supabase côté navigateur (composants client)
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    env.supabase.url,
    env.supabase.anonKey
  )
}

/**
 * Client Supabase côté serveur (Server Components, Route Handlers)
 * Utilise le service role pour les opérations admin
 */
export function createSupabaseServerClient() {
  return createClient<Database>(
    env.supabase.url,
    env.supabase.serviceRoleKey ?? env.supabase.anonKey
  )
}
