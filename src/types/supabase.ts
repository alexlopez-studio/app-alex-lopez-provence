/**
 * Types générés pour Supabase
 * À régénérer avec : npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 * En attendant, types manuels pour démarrer
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          branding: Json
          plan: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          branding?: Json
          plan?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          branding?: Json
          plan?: string
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          tenant_id: string
          role: string
          full_name: string
          email: string
        }
        Insert: {
          id: string
          tenant_id: string
          role?: string
          full_name: string
          email: string
        }
        Update: {
          tenant_id?: string
          role?: string
          full_name?: string
          email?: string
        }
      }
      leads: {
        Row: {
          id: string
          tenant_id: string
          type: string
          prenom: string
          nom: string
          email: string
          telephone: string
          form_data: Json
          results: Json | null
          token: string
          statut: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          type: string
          prenom: string
          nom: string
          email: string
          telephone: string
          form_data: Json
          results?: Json | null
          token?: string
          statut?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          results?: Json | null
          statut?: string
          notes?: string | null
          updated_at?: string
        }
      }
      relances: {
        Row: {
          id: string
          lead_id: string
          tenant_id: string
          scheduled_at: string
          sent_at: string | null
          type: string
          statut: string
        }
        Insert: {
          id?: string
          lead_id: string
          tenant_id: string
          scheduled_at: string
          sent_at?: string | null
          type: string
          statut?: string
        }
        Update: {
          sent_at?: string | null
          statut?: string
        }
      }
    }
  }
}
