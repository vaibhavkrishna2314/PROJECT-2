/*
  # Add missing profile columns
  
  1. Changes
    - Add contact_person column to profiles table
    - Add operating_hours column to profiles table
    - Add pickup_instructions column to profiles table
  
  2. Notes
    - Add columns as nullable first
    - Set default values for existing rows
    - Make columns NOT NULL
*/

DO $$ 
BEGIN
  -- First add the columns as nullable if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'contact_person'
  ) THEN
    -- Add columns initially as nullable
    ALTER TABLE profiles ADD COLUMN contact_person text;
    ALTER TABLE profiles ADD COLUMN operating_hours text;
    ALTER TABLE profiles ADD COLUMN pickup_instructions text;
    
    -- Set default values for existing rows
    UPDATE profiles SET 
      contact_person = name,
      operating_hours = '9 AM - 5 PM',
      pickup_instructions = 'Please contact for pickup instructions'
    WHERE contact_person IS NULL;
    
    -- Now make them NOT NULL
    ALTER TABLE profiles 
      ALTER COLUMN contact_person SET NOT NULL,
      ALTER COLUMN operating_hours SET NOT NULL,
      ALTER COLUMN pickup_instructions SET NOT NULL;
  END IF;
END $$;