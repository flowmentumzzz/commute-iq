-- Fix two onboarding-blocking constraints:
--
-- 1. public.profiles has RLS enabled but only SELECT and UPDATE policies.
--    The auth callback's upsert was silently rejected, so no profile row was
--    created on first sign-in. Then onboarding's insert into commute_profiles
--    failed the FK constraint commute_profiles_user_id_fkey -> profiles(id).
--
-- 2. The commute_profiles.primary_transport CHECK constraint did not include
--    'bike_walk', but the customer onboarding step ships that option as
--    "🚲 Xe đạp / Đi bộ". Once #1 was fixed, picking that option would have
--    raised a CHECK violation. Keeping 'mixed' for backward compatibility.

-- 1. Allow a signed-in user to insert their own profile row.
create policy "profiles_insert_own" on public.profiles
  for insert
  with check ((select auth.uid()) = id);

-- 2. Replace the primary_transport CHECK constraint. Use a dynamic drop so
--    the migration is robust to whatever name Postgres gave the inline
--    constraint when the table was created.
do $$
declare
  c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.commute_profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%primary_transport%'
  loop
    execute format('alter table public.commute_profiles drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.commute_profiles
  add constraint commute_profiles_primary_transport_check
  check (primary_transport in ('motorbike', 'grab_be', 'bus', 'bike_walk', 'mixed'));
