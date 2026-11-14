-- ==========================================================
-- TripMate Database Schema for Supabase Postgres
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mcqqqmjfeqnowaauydpd/sql
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar text,
  home_city text,
  passport_expiry text,
  preferred_currency text default 'USD',
  travel_style text default 'comfort',
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile." 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile." 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 2. TRIPS TABLE
create table if not exists public.trips (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  origin text not null,
  destination text not null,
  country text not null,
  start_date text not null,
  end_date text not null,
  cover_image text,
  status text default 'upcoming',
  budget numeric default 1500,
  spent numeric default 0,
  currency text default 'USD',
  travel_style text default 'solo',
  companions_count integer default 1,
  notes text,
  itinerary jsonb default '[]'::jsonb,
  packing_list jsonb default '[]'::jsonb,
  expenses jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for trips
alter table public.trips enable row level security;

create policy "Users can manage their own trips." 
  on public.trips for all 
  using (auth.uid() = user_id);

-- 3. TICKETS TABLE
create table if not exists public.tickets (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  trip_id text references public.trips on delete set null,
  type text not null,
  provider text not null,
  booking_ref text not null,
  origin text not null,
  origin_code text,
  destination text not null,
  destination_code text,
  departure_date text not null,
  departure_time text not null,
  arrival_date text not null,
  arrival_time text not null,
  duration text,
  price numeric not null,
  currency text default 'USD',
  seat text,
  gate_or_platform text,
  travel_class text,
  passenger_name text,
  status text default 'confirmed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for tickets
alter table public.tickets enable row level security;

create policy "Users can manage their own tickets." 
  on public.tickets for all 
  using (auth.uid() = user_id);

-- 4. REMINDERS TABLE
create table if not exists public.reminders (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  trip_id text references public.trips on delete set null,
  trip_title text,
  title text not null,
  description text,
  date_time text not null,
  priority text default 'medium',
  category text default 'check-in',
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for reminders
alter table public.reminders enable row level security;

create policy "Users can manage their own reminders." 
  on public.reminders for all 
  using (auth.uid() = user_id);
