/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `username` (text, unique, not null)
      - `token_balance` (integer, default 100)
      - `level` (integer, default 1)
      - `experience_points` (integer, default 0)
      - `created_at` (timestamp with time zone, default now())
      - `avatar_url` (text, optional)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to view, update, and insert their own profile
*/

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  token_balance integer DEFAULT 100 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  experience_points integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  avatar_url text
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);