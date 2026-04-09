# app-alex-lopez-provence

Application SaaS immobilier — formulaires multi-étapes, estimation DVF, mini-CRM, export PDF.

## Stack

- **Next.js 15** App Router (React 19)
- **Tailwind CSS v4**
- **shadcn/ui**
- **Supabase** (Auth + PostgreSQL + RLS)
- **Resend** (emails magic link + relances)
- **@react-pdf/renderer** (export PDF)
- **Zustand** (state management formulaires)
- **React Hook Form + Zod** (validation)

## Démarrage

```bash
npm install
cp .env.example .env.local
# Renseigner les variables dans .env.local
npm run dev
```

## Branches

- `preview` — branche de travail (tout le développement)
- `main` — production (merge sur demande explicite)

## Structure

```
src/
├── app/          # Routes Next.js App Router
├── components/   # Composants React
├── lib/          # Clients (Supabase, DVF, Resend…)
├── stores/       # Zustand stores (formulaires multi-étapes)
├── types/        # Types TypeScript partagés
└── styles/       # globals.css + design tokens
supabase/
└── migrations/   # Schéma SQL
```

## Repo

`alexlopez-studio/app-alex-lopez-provence` · Branche : `preview`
