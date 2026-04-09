/**
 * Types TypeScript partagés — app-alex-lopez-provence
 */

// ─── Tenants ───────────────────────────────────────────────────────────────

export type Plan = 'free' | 'pro' | 'agency'

export interface TenantBranding {
  primaryColor?: string
  logo?: string
  phone?: string
  email?: string
  name?: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  branding: TenantBranding
  plan: Plan
  is_active: boolean
  created_at: string
}

// ─── Utilisateurs ──────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'member'

export interface Profile {
  id: string
  tenant_id: string
  role: UserRole
  full_name: string
  email: string
}

// ─── Leads ─────────────────────────────────────────────────────────────────

export type LeadType = 'vendre' | 'acheter' | 'audit'
export type LeadStatut = 'nouveau' | 'contacte' | 'rdv' | 'signe' | 'perdu'

export interface Lead {
  id: string
  tenant_id: string
  type: LeadType
  prenom: string
  nom: string
  email: string
  telephone: string
  form_data: VendreFormData | AcheterFormData | AuditFormData
  results: EstimationResult | AuditResult | null
  token: string
  statut: LeadStatut
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Formulaires ───────────────────────────────────────────────────────────

export type TypeBien = 'appartement' | 'maison' | 'terrain' | 'autre'
export type EtatGeneral = 'a_renover' | 'bon_etat' | 'tres_bon_etat' | 'neuf'
export type DPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'NC'
export type DelaiVente = 'urgent' | '3_6_mois' | '6_mois_plus'

export interface VendreFormData {
  // Étape 1 — Le bien
  type_bien: TypeBien
  adresse: string
  latitude?: number
  longitude?: number
  surface: number
  nb_pieces: number
  etage?: number
  nb_etages?: number
  annee_construction?: number
  // Étape 2 — État
  etat: EtatGeneral
  garage: boolean
  parking: boolean
  cave: boolean
  exterieur: 'aucun' | 'balcon' | 'terrasse' | 'jardin'
  surface_exterieur?: number
  cuisine_equipee: boolean
  double_vitrage: boolean
  dpe: DPE
  // Étape 3 — Contexte
  delai: DelaiVente
  occupe: boolean
  deja_estime: boolean
  prix_souhaite?: number
  // Étape 4 — Coordonnées
  prenom: string
  nom: string
  telephone: string
  email: string
}

export interface AcheterFormData {
  // Étape 1 — Le projet
  type_bien: TypeBien
  communes: string[]
  budget_max: number
  surface_min: number
  nb_pieces_min: number
  // Étape 2 — Critères
  rdc_ok: boolean
  parking_indispensable: boolean
  exterieur_indispensable: boolean
  dpe_souhaite: DPE[]
  travaux_ok: boolean
  // Étape 3 — Financement
  apport: number
  accord_bancaire: boolean
  primo_accedant: boolean
  // Étape 4 — Coordonnées
  prenom: string
  nom: string
  telephone: string
  email: string
}

export interface AuditFormData {
  // Étape 1 — Le bien
  adresse: string
  type_bien: TypeBien
  surface: number
  // Étape 2 — Points de contrôle
  etat_toiture: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_facade: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_menuiseries: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_plomberie: 'bon' | 'moyen' | 'mauvais' | 'nc'
  etat_electricite: 'bon' | 'moyen' | 'mauvais' | 'nc'
  humidite: boolean
  isolation_murs: 'bonne' | 'partielle' | 'absente' | 'nc'
  isolation_combles: 'bonne' | 'partielle' | 'absente' | 'nc'
  isolation_fenetres: 'double_vitrage' | 'simple_vitrage' | 'nc'
  type_chauffage: 'gaz' | 'electrique' | 'fioul' | 'pac' | 'bois' | 'autre'
  age_chauffage?: number
  dpe: DPE
  // Étape 3 — Situation
  qualite: 'proprietaire' | 'acheteur_potentiel'
  objectif: 'vente' | 'achat' | 'renovation' | 'energie'
  // Étape 4 — Coordonnées
  prenom: string
  nom: string
  telephone: string
  email: string
}

// ─── Résultats ─────────────────────────────────────────────────────────────

export interface EstimationResult {
  fourchette_basse: number
  fourchette_haute: number
  valeur_mediane: number
  prix_m2_median: number
  nb_transactions: number
  rayon_km: number
  indice_confiance: 'faible' | 'moyen' | 'eleve'
  commentaire_ia?: string
  generated_at: string
}

export interface AuditResult {
  score_global: number // 0-100
  score_structure: number
  score_energie: number
  score_confort: number
  points_forts: string[]
  points_attention: string[]
  recommandations: string[]
  budget_travaux_estime?: { min: number; max: number }
  generated_at: string
}

// ─── Relances ──────────────────────────────────────────────────────────────

export type RelanceType = 'email' | 'sms' | 'appel'
export type RelanceStatut = 'planifiee' | 'envoyee' | 'echec'

export interface Relance {
  id: string
  lead_id: string
  tenant_id: string
  scheduled_at: string
  sent_at: string | null
  type: RelanceType
  statut: RelanceStatut
}
