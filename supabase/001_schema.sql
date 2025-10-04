create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text check (gender in ('male','female','other')),
  birth_date date,
  death_date date,
  place_of_birth text,
  place_of_residence text,
  lineage text,
  notes text,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references family_members(id) on delete cascade,
  to_id uuid not null references family_members(id) on delete cascade,
  relation_type text check (relation_type in ('parent','child','spouse','sibling')) not null,
  created_at timestamptz default now()
);

alter table family_members enable row level security;
alter table relationships enable row level security;

drop policy if exists "family_members_auth" on family_members;
drop policy if exists "relationships_auth" on relationships;
drop policy if exists "photos_public_read" on storage.objects;
drop policy if exists "photos_authenticated_write" on storage.objects;
drop policy if exists "photos_authenticated_update" on storage.objects;

create policy "family_members_auth"
  on family_members for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "relationships_auth"
  on relationships for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "photos_public_read"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "photos_authenticated_write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');

create policy "photos_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');
