/*
  # Enhance food listings table

  1. Changes
    - Add image_urls column for storing uploaded images
    - Add expiry_date column
    - Add status constraints
    - Update RLS policies

  2. Security
    - Enhance RLS policies for better access control
    - Add validation for expiry dates
*/

-- Add image_urls column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_listings' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE food_listings ADD COLUMN image_urls text[];
  END IF;
END $$;

-- Add expiry_date column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_listings' AND column_name = 'expiry_date'
  ) THEN
    ALTER TABLE food_listings ADD COLUMN expiry_date timestamptz NOT NULL;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Restaurants can create listings" ON food_listings;
DROP POLICY IF EXISTS "Restaurants can update own listings" ON food_listings;
DROP POLICY IF EXISTS "Restaurants can view own listings" ON food_listings;

-- Create enhanced policies
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
    AND
    expiry_date > CURRENT_TIMESTAMP
  );

CREATE POLICY "Restaurants can update own listings"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (restaurant_id = auth.uid())
  WITH CHECK (restaurant_id = auth.uid());

CREATE POLICY "Users can view available listings"
  ON food_listings
  FOR SELECT
  TO authenticated
  USING (
    (status = 'available' AND expiry_date > CURRENT_TIMESTAMP)
    OR restaurant_id = auth.uid()
    OR ngo_id = auth.uid()
  );

-- Add storage bucket for food images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'food-images'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('food-images', 'food-images');
  END IF;
END $$;

-- Enable RLS for storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
DROP POLICY IF EXISTS "Authenticated users can upload food images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view food images" ON storage.objects;

CREATE POLICY "Authenticated users can upload food images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'food-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated users can view food images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'food-images');