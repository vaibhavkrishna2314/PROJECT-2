/*
  # Reinitialize Authentication Policies

  1. Changes
    - Drop existing policies
    - Recreate policies with proper security checks
    - Update RLS settings
    - Add missing security policies

  2. Security
    - Enable RLS on all tables
    - Add proper authentication checks
    - Ensure data isolation between users
*/

-- Disable RLS temporarily to modify policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Restaurants can create listings" ON food_listings;
DROP POLICY IF EXISTS "Users can view available listings" ON food_listings;
DROP POLICY IF EXISTS "Restaurants can update own listings" ON food_listings;
DROP POLICY IF EXISTS "NGOs can update assigned listings" ON food_listings;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for completed listings" ON reviews;

-- Recreate policies for profiles table
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

-- Recreate policies for food_listings table
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
    AND expiry_date > CURRENT_TIMESTAMP
  );

CREATE POLICY "Users can view available listings"
  ON food_listings
  FOR SELECT
  TO authenticated
  USING (
    (status = 'available' AND expiry_date > CURRENT_TIMESTAMP)
    OR restaurant_id = auth.uid()
    OR ngo_id = auth.uid()
  );

CREATE POLICY "Restaurants can update own listings"
  ON food_listings
  FOR UPDATE
  TO authenticated
  USING (restaurant_id = auth.uid())
  WITH CHECK (restaurant_id = auth.uid());

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

-- Recreate policies for notifications table
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Recreate policies for reviews table
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for completed listings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM food_listings
      WHERE food_listings.id = listing_id
      AND food_listings.status = 'completed'
      AND (
        (food_listings.restaurant_id = auth.uid() AND reviewee_id = food_listings.ngo_id)
        OR
        (food_listings.ngo_id = auth.uid() AND reviewee_id = food_listings.restaurant_id)
      )
    )
  );

-- Re-enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled using the correct system catalog query
DO $$
BEGIN
  -- Check RLS status for each table using pg_class
  ASSERT EXISTS (
    SELECT 1 FROM pg_class
    WHERE relname = 'profiles'
    AND relrowsecurity = true
  ), 'RLS not enabled on profiles';

  ASSERT EXISTS (
    SELECT 1 FROM pg_class
    WHERE relname = 'food_listings'
    AND relrowsecurity = true
  ), 'RLS not enabled on food_listings';

  ASSERT EXISTS (
    SELECT 1 FROM pg_class
    WHERE relname = 'notifications'
    AND relrowsecurity = true
  ), 'RLS not enabled on notifications';

  ASSERT EXISTS (
    SELECT 1 FROM pg_class
    WHERE relname = 'reviews'
    AND relrowsecurity = true
  ), 'RLS not enabled on reviews';
END $$;