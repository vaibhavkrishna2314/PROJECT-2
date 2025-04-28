/*
  # Food Rescue Platform Schema

  1. New Tables
    - `food_listings`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references profiles)
      - `ngo_id` (uuid, references profiles, nullable)
      - `name` (text)
      - `description` (text)
      - `quantity` (numeric)
      - `unit` (text)
      - `expiry_date` (timestamptz)
      - `storage_instructions` (text)
      - `allergens` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Profile Updates
    - Add new columns to profiles table:
      - `contact_person` (text)
      - `operating_hours` (text)
      - `pickup_instructions` (text)

  3. Security
    - Enable RLS on food_listings
    - Add policies for CRUD operations
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'contact_person'
  ) THEN
    ALTER TABLE profiles 
      ADD COLUMN contact_person text,
      ADD COLUMN operating_hours text,
      ADD COLUMN pickup_instructions text;
  END IF;
END $$;

-- Create food_listings table
CREATE TABLE IF NOT EXISTS food_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES profiles(id) NOT NULL,
  ngo_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  expiry_date timestamptz NOT NULL,
  storage_instructions text,
  allergens text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;

-- Policies for food_listings

-- Restaurants can create listings
CREATE POLICY "Restaurants can create listings"
  ON food_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'restaurant'
    )
  );

-- Restaurants can view their own listings
CREATE POLICY "Restaurants can view own listings"
  ON food_listings
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'ngo'
    )
  );

-- Restaurants can update their own listings
CREATE POLICY "Restaurants can update own listings"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (restaurant_id = auth.uid())
  WITH CHECK (restaurant_id = auth.uid());

-- NGOs can update listings assigned to them
CREATE POLICY "NGOs can update assigned listings"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (
    ngo_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'ngo'
    )
  )
  WITH CHECK (
    ngo_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'ngo'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_food_listings_updated_at
  BEFORE UPDATE
  ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();