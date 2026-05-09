create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  city text not null default 'Ho Chi Minh City',
  created_at timestamptz not null default now()
);

create table public.commute_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  home_label text not null,
  work_label text not null,
  primary_transport text not null check (primary_transport in ('motorbike', 'grab_be', 'bus', 'mixed')),
  vehicle_model text,
  salary_monthly_vnd integer,
  created_at timestamptz not null default now()
);

create table public.commute_transactions (
  id uuid primary key default gen_random_uuid(),
  commute_profile_id uuid not null references public.commute_profiles(id) on delete cascade,
  category text not null check (category in ('fuel', 'parking', 'ride_hailing', 'routine', 'maintenance')),
  merchant text not null,
  amount_vnd integer not null check (amount_vnd >= 0),
  source text not null default 'manual' check (source in ('sms', 'manual', 'mock')),
  occurred_at timestamptz not null default now(),
  raw_payload text
);

create table public.monthly_commute_summaries (
  id uuid primary key default gen_random_uuid(),
  commute_profile_id uuid not null references public.commute_profiles(id) on delete cascade,
  month date not null,
  direct_monthly_vnd integer not null default 0,
  amortized_monthly_vnd integer not null default 0,
  weather_monthly_vnd integer not null default 0,
  routine_monthly_vnd integer not null default 0,
  total_monthly_vnd integer not null default 0,
  created_at timestamptz not null default now(),
  unique (commute_profile_id, month)
);

alter table public.profiles enable row level security;
alter table public.commute_profiles enable row level security;
alter table public.commute_transactions enable row level security;
alter table public.monthly_commute_summaries enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "commute_profiles_select_own" on public.commute_profiles
  for select using (auth.uid() = user_id);

create policy "commute_profiles_insert_own" on public.commute_profiles
  for insert with check (auth.uid() = user_id);

create policy "commute_profiles_update_own" on public.commute_profiles
  for update using (auth.uid() = user_id);

create policy "commute_transactions_select_own" on public.commute_transactions
  for select using (
    exists (
      select 1
      from public.commute_profiles
      where commute_profiles.id = commute_transactions.commute_profile_id
        and commute_profiles.user_id = auth.uid()
    )
  );

create policy "monthly_summaries_select_own" on public.monthly_commute_summaries
  for select using (
    exists (
      select 1
      from public.commute_profiles
      where commute_profiles.id = monthly_commute_summaries.commute_profile_id
        and commute_profiles.user_id = auth.uid()
    )
  );

create index commute_profiles_user_id_idx on public.commute_profiles(user_id);
create index commute_transactions_profile_time_idx on public.commute_transactions(commute_profile_id, occurred_at desc);
create index monthly_summaries_profile_month_idx on public.monthly_commute_summaries(commute_profile_id, month desc);
