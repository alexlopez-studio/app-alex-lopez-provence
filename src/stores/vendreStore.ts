import { create } from 'zustand'

export interface ChatMessage {
  id: string
  from: 'al' | 'user'
  text: string
  timestamp: string
}

export interface VendreAnswers {
  adresse?: string
  type_bien?: string
  sous_type?: string
  surface?: number
  surface_terrain?: number
  nb_pieces?: number
  etat?: string
  travaux?: string[]
  equipements?: string[]
  sous_sol?: string
  proprietaire?: string
  situation_juridique?: string
  delai?: string
  prenom?: string
  nom?: string
  telephone?: string
  email?: string
}

export type QuestionId =
  | 'adresse'
  | 'type_bien'
  | 'sous_type_maison'
  | 'surface'
  | 'surface_terrain'
  | 'nb_pieces'
  | 'etat'
  | 'travaux'
  | 'equipements'
  | 'sous_sol'
  | 'proprietaire'
  | 'situation_juridique'
  | 'delai'
  | 'coordonnees'
  | 'done'

interface VendreState {
  messages: ChatMessage[]
  currentQuestion: QuestionId
  answers: VendreAnswers
  progress: number
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void
  setAnswer: (key: keyof VendreAnswers, value: VendreAnswers[keyof VendreAnswers]) => void
  setQuestion: (q: QuestionId) => void
  setProgress: (p: number) => void
  reset: () => void
}

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    from: 'al',
    text: `Bonjour ! 👋 Je suis Alex Lopez, votre conseiller immobilier. Je vais vous aider à estimer la valeur de votre bien en quelques minutes.\n\nCommençons par l'adresse de votre bien s'il vous plaît !`,
    timestamp: now(),
  },
]

const initial = {
  messages: INITIAL_MESSAGES,
  currentQuestion: 'adresse' as QuestionId,
  answers: {} as VendreAnswers,
  progress: 0,
}

export const useVendreStore = create<VendreState>((set) => ({
  ...initial,
  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: Date.now().toString() }],
    })),
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  setQuestion: (q) => set({ currentQuestion: q }),
  setProgress: (p) => set({ progress: p }),
  reset: () => set(initial),
}))
