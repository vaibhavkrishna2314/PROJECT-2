/*
  # Add food_type column to food_listings table

  1. Changes
    - Add food_type column to food_listings table
    - Set default value for existing rows
    - Add NOT NULL constraint
    - Add check constraint for valid food types
*/

DO $$ 
BEGIN
  -- First add the column as nullable
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'food_listings' AND column_name = 'food_type'
  ) THEN
    -- Add column initially as nullable
    ALTER TABLE food_listings ADD COLUMN food_type text;
    
    -- Set a default value for existing rows
    UPDATE food_listings SET food_type = 'Other' WHERE food_type IS NULL;
    
    -- Now make it NOT NULL and add the check constraint
    ALTER TABLE food_listings 
      ALTER COLUMN food_type SET NOT NULL,
      ADD CONSTRAINT food_type_check CHECK (
        food_type IN (
          'Prepared Meals',
          'Fruits & Vegetables',
          'Bakery',
          'Dairy',
          'Meat & Poultry',
          'Seafood',
          'Dry Goods',
          'Beverages',
          'Other'
        )
      );
  END IF;
END $$;