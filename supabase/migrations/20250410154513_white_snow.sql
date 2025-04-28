/*
  # Initialize Fresh Database Schema
  
  1. New Tables
    - profiles (for user profiles)
    - food_listings (for food donation listings)
    - notifications (for system notifications)
    - reviews (for user feedback)
    
  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies
    - Add necessary constraints
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS food_listings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('restaurant', 'ngo')),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  contact_person text NOT NULL,
  operating_hours text NOT NULL,
  pickup_instructions text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create food_listings table
CREATE TABLE food_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES profiles(id) NOT NULL,
  ngo_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  food_type text NOT NULL CHECK (
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
  ),
  description text NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  expiry_date timestamptz NOT NULL,
  pickup_location text NOT NULL,
  pickup_instructions text NOT NULL,
  storage_instructions text,
  allergens text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'completed', 'cancelled')),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  image_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_listing', 'accepted', 'pickup_reminder', 'feedback')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
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

-- Food Listings Policies
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

-- Notifications Policies
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

-- Reviews Policies
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

-- Create storage bucket for food images
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'Food listing images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Storage policies
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

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION notify_new_listing()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_name text;
BEGIN
  -- Get restaurant name
  SELECT name INTO restaurant_name
  FROM profiles
  WHERE id = NEW.restaurant_id;

  -- Notify NGOs
  INSERT INTO notifications (user_id, type, title, message)
  SELECT 
    p.id,
    'new_listing',
    'New Food Available',
    COALESCE(restaurant_name, 'A restaurant') || ' has listed ' || NEW.quantity || ' ' || NEW.unit || ' of ' || NEW.name
  FROM profiles p
  WHERE p.role = 'ngo'
  AND p.id != NEW.restaurant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION notify_accepted_listing()
RETURNS TRIGGER AS $$
DECLARE
  ngo_name text;
BEGIN
  IF NEW.status = 'pending' AND OLD.status = 'available' THEN
    -- Get NGO name
    SELECT name INTO ngo_name
    FROM profiles
    WHERE id = NEW.ngo_id;

    -- Notify restaurant
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      NEW.restaurant_id,
      'accepted',
      'Donation Accepted',
      COALESCE(ngo_name, 'An NGO') || ' has accepted your donation of ' || NEW.quantity || ' ' || NEW.unit || ' of ' || NEW.name
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_food_listings_updated_at
  BEFORE UPDATE ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_new_food_listing
  AFTER INSERT ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_listing();

CREATE TRIGGER on_accepted_food_listing
  AFTER UPDATE ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_accepted_listing();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();