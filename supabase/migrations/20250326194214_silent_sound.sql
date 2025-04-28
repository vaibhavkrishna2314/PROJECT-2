/*
  # Fix profiles table schema and constraints

  1. Changes
    - Remove email column from profiles table as it's already in auth.users
    - Set default values for existing NULL fields
    - Add NOT NULL constraints after ensuring data consistency
    - Update column constraints safely

  2. Notes
    - Handles existing NULL values before adding constraints
    - Uses safe defaults for required fields
    - Maintains data integrity during migration
*/

-- Remove email column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles DROP COLUMN email;
  END IF;
END $$;

-- Update NULL values with defaults before adding constraints
UPDATE profiles 
SET 
  name = COALESCE(name, 'Unnamed User'),
  address = COALESCE(address, 'Address pending'),
  phone = COALESCE(phone, 'Phone pending'),
  contact_person = COALESCE(contact_person, 'Contact pending'),
  operating_hours = COALESCE(operating_hours, 'Hours pending'),
  pickup_instructions = COALESCE(pickup_instructions, 'Instructions pending')
WHERE 
  name IS NULL 
  OR address IS NULL 
  OR phone IS NULL 
  OR contact_person IS NULL 
  OR operating_hours IS NULL 
  OR pickup_instructions IS NULL;

-- Now safely add NOT NULL constraints
ALTER TABLE profiles
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN address SET NOT NULL,
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN contact_person SET NOT NULL,
  ALTER COLUMN operating_hours SET NOT NULL,
  ALTER COLUMN pickup_instructions SET NOT NULL;