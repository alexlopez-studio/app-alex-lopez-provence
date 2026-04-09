/**
 * Variables d'environnement typées
 * Toutes les variables d'env de l'app passent par ici
 */

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  app: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    mainSiteUrl: process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? 'https://alexlopez-provence.fr',
    superAdminEmail: process.env.SUPERADMIN_EMAIL ?? 'alexlopezstudio@gmail.com',
  },
} as const
