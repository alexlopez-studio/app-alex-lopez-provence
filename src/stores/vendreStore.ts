import { create } from 'zustand'

export type TypeBien = 'appartement' | 'maison' | 'terrain' | 'autre'
export type EtatGeneral = 'a_renover' | 'bon_etat' | 'tres_bon_etat' | 'neuf'
export type DPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'NC'
export type DelaiVente = 'urgent' | '3_6_mois' | '6_mois_plus'
export type Exterieur = 'aucun' | 'balcon' | 'terrasse' | 'jardin'

export interface VendreState {
  // Navigation
  step: number
  // Étape 1 — Le bien
  type_bien: TypeBien | ''
  adresse: string
  surface: string
  nb_pieces: string
  etage: string
  nb_etages: string
  annee_construction: string
  // Étape 2 — État
  etat: EtatGeneral | ''
  garage: boolean
  parking: boolean
  cave: boolean
  exterieur: Exterieur
  surface_exterieur: string
  cuisine_equipee: boolean
  double_vitrage: boolean
  dpe: DPE | ''
  // Étape 3 — Contexte
  delai: DelaiVente | ''
  occupe: boolean
  deja_estime: boolean
  prix_souhaite: string
  // Étape 4 — Coordonnées
  prenom: string
  nom: string
  telephone: string
  email: string
  // Actions
  setField: <K extends keyof VendreState>(key: K, value: VendreState[K]) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const initialState = {
  step: 1,
  type_bien: '' as const,
  adresse: '',
  surface: '',
  nb_pieces: '',
  etage: '',
  nb_etages: '',
  annee_construction: '',
  etat: '' as const,
  garage: false,
  parking: false,
  cave: false,
  exterieur: 'aucun' as const,
  surface_exterieur: '',
  cuisine_equipee: false,
  double_vitrage: false,
  dpe: '' as const,
  delai: '' as const,
  occupe: false,
  deja_estime: false,
  prix_souhaite: '',
  prenom: '',
  nom: '',
  telephone: '',
  email: '',
}

export const useVendreStore = create<VendreState>((set) => ({
  ...initialState,
  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () => set(initialState),
}))
