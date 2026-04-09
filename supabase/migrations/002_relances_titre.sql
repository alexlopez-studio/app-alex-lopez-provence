-- Migration 002 — Ajout colonne titre aux relances
ALTER TABLE public.relances ADD COLUMN IF NOT EXISTS titre text;
