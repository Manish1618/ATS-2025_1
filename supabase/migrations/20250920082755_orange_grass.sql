/*
  # Create rewards table

  1. New Tables
    - `rewards`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, not null)
      - `description` (text, not null)
      - `token_cost` (integer, not null)
      - `category` (text, not null)
      - `rarity` (text, not null)
      - `image_url` (text, optional)
      - `is_available` (boolean, default true)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `rewards` table
    - Add policy for anyone to view rewards
*/

CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  token_cost integer NOT NULL,
  category text NOT NULL,
  rarity text NOT NULL,
  image_url text,
  is_available boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards"
  ON public.rewards
  FOR SELECT
  TO authenticated
  USING (true);