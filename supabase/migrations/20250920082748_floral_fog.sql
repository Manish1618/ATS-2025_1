/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, not null)
      - `description` (text, not null)
      - `token_reward` (integer, not null)
      - `difficulty` (text, not null)
      - `category` (text, not null)
      - `requirements` (text array, optional)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for anyone to view tasks
*/

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  token_reward integer NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  requirements text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (true);