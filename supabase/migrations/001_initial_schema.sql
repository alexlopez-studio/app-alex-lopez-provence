-- ============================================================
-- Migration 001 — Schéma initial
-- app-alex-lopez-provence
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Tenants ───────────────────────────────────────────────
create table public.tenants (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  branding    jsonb not null default '{}',
  plan        text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── Profiles (conseillers) ────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  role        text not null default 'admin' check (role in ('super_admin', 'admin', 'member')),
  full_name   text not null,
  email       text not null
);

-- ─── Leads ─────────────────────────────────────────────────
create table public.leads (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  type        text not null check (type in ('vendre', 'acheter', 'audit')),
  prenom      text not null,
  nom         text not null,
  email       text not null,
  telephone   text not null,
  form_data   jsonb not null default '{}',
  results     jsonb,
  token       uuid not null unique default uuid_generate_v4(),
  statut      text not null default 'nouveau'
                check (statut in ('nouveau', 'contacte', 'rdv', 'signe', 'perdu')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

-- ─── Relances ──────────────────────────────────────────────
create table public.relances (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid not null references public.leads(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id) on delete cascade,
  scheduled_at  timestamptz not null,
  sent_at       timestamptz,
  type          text not null check (type in ('email', 'sms', 'appel')),
  statut        text not null default 'planifiee'
                  check (statut in ('planifiee', 'envoyee', 'echec'))
);

-- ─── Row Level Security ────────────────────────────────────

alter table public.tenants   enable row level security;
alter table public.profiles  enable row level security;
alter table public.leads     enable row level security;
alter table public.relances  enable row level security;

-- Tenants : chaque conseiller voit uniquement son tenant
create policy "Voir son propre tenant" on public.tenants
  for select using (
    id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Profiles : voir et modifier son propre profil
create policy "Voir son profil" on public.profiles
  for select using (id = auth.uid());

create policy "Modifier son profil" on public.profiles
  for update using (id = auth.uid());

-- Leads : isolés par tenant
create policy "Voir les leads de son tenant" on public.leads
  for select using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "Créer un lead" on public.leads
  for insert with check (true); -- public : le prospect peut créer un lead

create policy "Modifier un lead de son tenant" on public.leads
  for update using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- Relances : isolées par tenant
create policy "Voir les relances de son tenant" on public.relances
  for select using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "Gérer les relances de son tenant" on public.relances
  for all using (
    tenant_id = (select tenant_id from public.profiles where id = auth.uid())
  );

-- ─── Tenant initial (Alexandre) ───────────────────────────
insert into public.tenants (name, slug, branding, plan)
values (
  'Alex Lopez · Mandataire IAD',
  'alex-lopez',
  '{"primaryColor": "#0066FF", "phone": "06 13 18 01 68", "email": "alexlopezstudio@gmail.com", "name": "Alex Lopez"}',
  'pro'
);
