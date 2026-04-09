import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en euros
 */
export function formatPrix(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(montant)
}

/**
 * Formate un prix au m²
 */
export function formatPrixM2(montant: number): string {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(montant)} €/m²`
}

/**
 * Génère un token UUID simple côté client
 */
export function generateToken(): string {
  return crypto.randomUUID()
}
