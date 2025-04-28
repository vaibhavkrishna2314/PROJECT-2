/*
  # Fix Authentication Policies and Profile Creation

  1. Changes
    - Drop and recreate handle_new_user trigger function
    - Ensure proper RLS policies for profile creation
    - Add proper error handling in trigger function
    
  2. Security
    - Maintain RLS policies
    - Ensure proper data validation
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Validate required metadata
  IF new.raw_user_meta_data->>'role' IS NULL THEN
    RAISE EXCEPTION 'role is required in user_metadata';
  END IF;

  IF new.raw_user_meta_data->>'role' NOT IN ('restaurant', 'ngo') THEN
    RAISE EXCEPTION 'role must be either restaurant or ngo';
  END IF;

  -- Insert into profiles with minimal required data
  -- Other fields will be updated by the user later
  INSERT INTO public.profiles (
    id,
    role,
    name,
    address,
    phone,
    contact_person,
    operating_hours,
    pickup_instructions
  ) VALUES (
    new.id,
    new.raw_user_meta_data->>'role',
    COALESCE(new.raw_user_meta_data->>'name', 'Unnamed User'),
    'Address pending',
    'Phone pending',
    'Contact pending',
    'Hours pending',
    'Instructions pending'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate policies with proper checks
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role IN ('restaurant', 'ngo')
  );

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);