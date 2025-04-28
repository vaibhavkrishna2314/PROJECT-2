/*
  # Add pickup instructions column
  
  1. Changes
    - Add pickup_instructions column to food_listings table
    - Add with a default value first, then make it NOT NULL
*/

DO $$ 
BEGIN
  -- First add the column as nullable
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_listings' AND column_name = 'pickup_instructions'
  ) THEN
    -- Add column initially as nullable
    ALTER TABLE food_listings ADD COLUMN pickup_instructions text;
    
    -- Set a default value for existing rows
    UPDATE food_listings SET pickup_instructions = 'Please contact for pickup instructions' WHERE pickup_instructions IS NULL;
    
    -- Now make it NOT NULL
    ALTER TABLE food_listings ALTER COLUMN pickup_instructions SET NOT NULL;
  END IF;
END $$;