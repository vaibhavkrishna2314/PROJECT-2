/*
  # Add location columns to food_listings table

  1. Changes
    - Add pickup_location column
    - Add latitude column
    - Add longitude column
    - Set default values for existing rows
    - Add NOT NULL constraints
*/

DO $$ 
BEGIN
  -- First add the columns as nullable
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_listings' AND column_name = 'pickup_location'
  ) THEN
    -- Add columns initially as nullable
    ALTER TABLE food_listings 
      ADD COLUMN pickup_location text,
      ADD COLUMN latitude numeric,
      ADD COLUMN longitude numeric;
    
    -- Set default values for existing rows
    UPDATE food_listings 
    SET 
      pickup_location = 'Not specified',
      latitude = 0,
      longitude = 0
    WHERE pickup_location IS NULL;
    
    -- Now make them NOT NULL
    ALTER TABLE food_listings 
      ALTER COLUMN pickup_location SET NOT NULL,
      ALTER COLUMN latitude SET NOT NULL,
      ALTER COLUMN longitude SET NOT NULL;
  END IF;
END $$;