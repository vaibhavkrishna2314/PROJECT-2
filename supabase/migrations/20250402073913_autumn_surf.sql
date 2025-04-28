/*
  # Add profile creation policy
  
  1. Changes
    - Add new policy to allow authenticated users to create their own profile
    
  2. Security
    - Only allows users to create a profile with their own auth.uid()
    - Ensures profile creation during registration process
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- Create policy for profile creation
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can only create a profile with their own ID
    auth.uid() = id
    AND
    -- Role must be either restaurant or ngo
    role IN ('restaurant', 'ngo')
  );