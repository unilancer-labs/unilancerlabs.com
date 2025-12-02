/*
  # Add University Field to Freelancer Applications

  1. Changes
    - Add university column to freelancer_applications table
    - Make phone field required for new applications
*/

-- Add university column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'freelancer_applications' 
    AND column_name = 'university'
  ) THEN
    ALTER TABLE freelancer_applications ADD COLUMN university text;
  END IF;
END $$;
