/*
  # Add deadline and participation cap to tasks

  1. Changes
    - Add `deadline` column to tasks table (optional timestamp)
    - Add `participation_cap` column to tasks table (optional integer)
    - These fields support time-based and participation-limited tasks

  2. Notes
    - Deadline is optional - tasks without deadlines run indefinitely
    - Participation cap is optional - tasks without caps have unlimited participation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'deadline'
  ) THEN
    ALTER TABLE tasks ADD COLUMN deadline timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'participation_cap'
  ) THEN
    ALTER TABLE tasks ADD COLUMN participation_cap integer;
  END IF;
END $$;