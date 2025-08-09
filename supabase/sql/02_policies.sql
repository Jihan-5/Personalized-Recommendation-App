-- Policies for 'items' table
alter table public.items enable row level security;

create policy "Allow public read access to items" on public.items
  for select using (true);

create policy "Allow admin full access to items" on public.items
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');


-- Policies for 'user_events' table
alter table public.user_events enable row level security;

create policy "Allow users to insert their own events" on public.user_events
  for insert with check (auth.uid() = user_id);

create policy "Allow service roles to access all events" on public.user_events
  for all using (auth.role() = 'service_role');


-- Policies for 'follows' table
alter table public.follows enable row level security;

create policy "Allow users to manage their own follows" on public.follows
  for all using (auth.uid() = user_id);

create policy "Allow service roles to access all follows" on public.follows
  for all using (auth.role() = 'service_role');

-- Policies for admin tables (restricted)
alter table public.ab_experiments enable row level security;
create policy "Allow service roles to access experiment data" on public.ab_experiments
  for all using (auth.role() = 'service_role');

alter table public.fraud_signals enable row level security;
create policy "Allow service roles to access fraud data" on public.fraud_signals
  for all using (auth.role() = 'service_role');