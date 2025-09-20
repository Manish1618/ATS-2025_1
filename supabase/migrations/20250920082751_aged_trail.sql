/*
  # Create user tasks table

  1. New Tables
    - `user_tasks`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, not null)
      - `task_id` (uuid, references tasks, not null)
      - `completed_at` (timestamp with time zone, default now())
      - `tokens_earned` (integer, not null)
      - Unique constraint on (user_id, task_id)

  2. Security
    - Enable RLS on `user_tasks` table
    - Add policies for users to view and insert their own completed tasks
*/

CREATE TABLE IF NOT EXISTS public.user_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamp with time zone DEFAULT now() NOT NULL,
  tokens_earned integer NOT NULL,
  UNIQUE (user_id, task_id)
);

ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their completed tasks"
  ON public.user_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their completed tasks"
  ON public.user_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);