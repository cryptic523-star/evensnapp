-- ───────────────────────────────────────────────────────────
-- EventSnap initial schema
-- ───────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  plan text not null default 'free',           -- free | pro | agency
  credits_remaining integer not null default 50,
  credits_monthly_limit integer not null default 50,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  stripe_subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brand kits (one per workspace/business)
create table public.brand_kits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  business_name text,
  industry text,
  description text,
  tone_of_voice text,
  primary_color text default '#2563eb',
  color_name text,
  preferred_style text default 'promotional poster',
  default_content_type text default 'Instagram Post',
  negative_prompt text default 'text errors, blurry, low quality, watermark, generic stock photo style',
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Generated images
create table public.images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,        -- path within the 'generated-images' bucket
  public_url text,
  prompt text not null,
  event_type text,
  content_type text,
  business_name text,
  brand_color text,
  is_favourite boolean not null default false,
  status text not null default 'completed', -- pending | completed | failed
  created_at timestamptz not null default now()
);

-- Captions tied to an image
create table public.captions (
  id uuid primary key default uuid_generate_v4(),
  image_id uuid not null references public.images(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  instagram text,
  facebook text,
  linkedin text,
  hashtags text[] default '{}',
  created_at timestamptz not null default now()
);

-- Connected social accounts (tokens stored encrypted at rest via Supabase Vault in production)
create table public.social_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,            -- instagram | facebook | linkedin | tiktok | x | google_business
  provider_account_id text,
  display_name text,
  access_token text,                 -- store encrypted/secret-managed in production
  refresh_token text,
  expires_at timestamptz,
  connected_at timestamptz not null default now(),
  unique(user_id, provider)
);

-- Scheduled / published posts
create table public.publish_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_id uuid not null references public.images(id) on delete cascade,
  social_account_id uuid references public.social_accounts(id) on delete set null,
  caption text,
  status text not null default 'scheduled', -- scheduled | publishing | published | failed
  scheduled_for timestamptz,
  published_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ──────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.brand_kits enable row level security;
alter table public.images enable row level security;
alter table public.captions enable row level security;
alter table public.social_accounts enable row level security;
alter table public.publish_jobs enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own brand kit" on public.brand_kits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own images" on public.images for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own captions" on public.captions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own social accounts" on public.social_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own publish jobs" on public.publish_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile row on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for generated images + logos
insert into storage.buckets (id, name, public) values ('generated-images', 'generated-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true)
  on conflict (id) do nothing;

create policy "Users upload own generated images"
  on storage.objects for insert
  with check (bucket_id = 'generated-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users read own generated images"
  on storage.objects for select
  using (bucket_id = 'generated-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users manage own brand assets"
  on storage.objects for all
  using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
