alter policy "profiles_select_own" on public.profiles
  using ((select auth.uid()) = id);

alter policy "profiles_update_own" on public.profiles
  using ((select auth.uid()) = id);

alter policy "commute_profiles_select_own" on public.commute_profiles
  using ((select auth.uid()) = user_id);

alter policy "commute_profiles_insert_own" on public.commute_profiles
  with check ((select auth.uid()) = user_id);

alter policy "commute_profiles_update_own" on public.commute_profiles
  using ((select auth.uid()) = user_id);

alter policy "commute_transactions_select_own" on public.commute_transactions
  using (
    exists (
      select 1
      from public.commute_profiles
      where commute_profiles.id = commute_transactions.commute_profile_id
        and commute_profiles.user_id = (select auth.uid())
    )
  );

alter policy "monthly_summaries_select_own" on public.monthly_commute_summaries
  using (
    exists (
      select 1
      from public.commute_profiles
      where commute_profiles.id = monthly_commute_summaries.commute_profile_id
        and commute_profiles.user_id = (select auth.uid())
    )
  );

do $$
begin
  if exists (
    select 1
    from pg_proc
    join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
    where pg_namespace.nspname = 'public'
      and pg_proc.proname = 'rls_auto_enable'
      and pg_get_function_identity_arguments(pg_proc.oid) = ''
  ) then
    revoke execute on function public.rls_auto_enable() from anon;
    revoke execute on function public.rls_auto_enable() from authenticated;
    revoke execute on function public.rls_auto_enable() from public;
  end if;
end $$;
