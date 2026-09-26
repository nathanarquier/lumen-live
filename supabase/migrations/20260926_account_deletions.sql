-- account_deletions: backs the 30-day scheduled-delete / restore flow in
-- index.html and the daily purge cron in api/purge-deleted-accounts.js.
-- Safe to re-run: table creation is guarded, policies are dropped and
-- recreated so this can be pasted into the Supabase SQL editor more than once.

create table if not exists public.account_deletions (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now()
);

alter table public.account_deletions enable row level security;

-- Client (anon/authenticated role, via supabaseClient) needs to insert its own
-- row (confirmDeleteAccount), read its own row (checkPendingDeletion on
-- login), and delete its own row (restore flow). The purge cron uses the
-- service-role key, which bypasses RLS entirely, so it needs no policy here.

drop policy if exists "Users can view own deletion request" on public.account_deletions;
create policy "Users can view own deletion request"
  on public.account_deletions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can schedule own deletion" on public.account_deletions;
create policy "Users can schedule own deletion"
  on public.account_deletions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can cancel own deletion (restore)" on public.account_deletions;
create policy "Users can cancel own deletion (restore)"
  on public.account_deletions for delete
  using (auth.uid() = user_id);
