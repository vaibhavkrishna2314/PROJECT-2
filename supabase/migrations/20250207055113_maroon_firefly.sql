/*
  # Add image_urls column and storage configuration
  
  1. Changes
    - Add image_urls column to food_listings table
    - Create storage bucket for food images
    - Set up storage policies for image access
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

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'Food listing images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the bucket
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Allow public to read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');

CREATE POLICY "Allow users to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'food-images' AND (storage.foldername(name))[1] = auth.uid()::text);