
-- Chopti Supabase Schema v3
-- Run in Supabase SQL Editor

-- Enable RLS
-- Profiles extends auth.users
create table public.profiles (
  id uuid primary references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  diet text default 'any' check (diet in ('any','high_protein','vegan','keto','low_carb')),
  budget_weekly integer default 20000,
  allergies text[] default '{}',
  plan_tier text default 'free' check (plan_tier in ('free','pro','family')),
  onboarding_completed boolean default false,
  onboarding_steps jsonb default '[false,false,false,false,false]'::jsonb,
  created_at timestamp with time zone default now()
);

-- Meals catalog
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tag text,
  time_minutes integer,
  kcal integer,
  color text,
  emoji text,
  image_url text,
  ingredients jsonb, -- [{name, qty, category, pantry}]
  steps jsonb, -- [{title, detail, time, tip, equipment}]
  nutrition jsonb, -- {protein, carbs, fat, fiber}
  created_at timestamp with time zone default now()
);

-- Weekly plans
create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_start date not null,
  days jsonb not null, -- {"mon": [{"meal_id":"...", "servings":2, "prepped":false, "custom_image":null}]}
  budget_total integer,
  shopping_generated boolean default false,
  created_at timestamp with time zone default now(),
  unique(user_id, week_start)
);

-- Pantry
create table public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text,
  qty text,
  expiry date,
  in_stock boolean default true,
  created_at timestamp with time zone default now()
);

-- Shopping lists
create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.meal_plans(id) on delete cascade,
  items jsonb not null, -- aggregated
  total_cost integer,
  exported_whatsapp boolean default false,
  created_at timestamp with time zone default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('shopping_ready','expiry_warning','prep_reminder','plan_generated','payment')),
  title text not null,
  body text,
  read boolean default false,
  action_url text,
  created_at timestamp with time zone default now()
);

-- Subscriptions / Paystack
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_tier text not null,
  paystack_reference text,
  amount integer,
  status text default 'active' check (status in ('active','cancelled','past_due')),
  current_period_end date,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.meal_plans enable row level security;
alter table public.pantry_items enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users own plans" on public.meal_plans for all using (auth.uid() = user_id);
create policy "Users own pantry" on public.pantry_items for all using (auth.uid() = user_id);
create policy "Users own shopping" on public.shopping_lists for all using (auth.uid() = user_id);
create policy "Users own notifs" on public.notifications for all using (auth.uid() = user_id);
create policy "Users own subs" on public.subscriptions for all using (auth.uid() = user_id);

-- Meals are public readable
alter table public.meals enable row level security;
create policy "Meals public read" on public.meals for select using (true);

-- Function to handle new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed meals
insert into public.meals (slug, name, tag, time_minutes, kcal, color, emoji, ingredients, steps) values
('jollof-chicken','Jollof Rice & Chicken','HIGH PROTEIN',45,650,'#FF6B35','🍛','[{"name":"Long grain rice","qty":"400g","category":"Grains"},{"name":"Chicken thighs","qty":"600g","category":"Proteins"}]'::jsonb,'[{"title":"Bloom palm oil","detail":"Heat on LOW 2 mins until aromatic...","time":"3m","tip":"Do not bleach"}]'::jsonb),
('ewa-agoyin','Ewa Agoyin & Plantain','VEGAN',30,480,'#7C3AED','🫘','[]'::jsonb,'[]'::jsonb),
('amala-ewedu','Amala & Ewedu + Gbegiri','FIBER RICH',40,520,'#059669','🍲','[]'::jsonb,'[]'::jsonb);
