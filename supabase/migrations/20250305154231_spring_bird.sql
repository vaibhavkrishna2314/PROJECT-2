/*
  # Add notifications and reviews system

  1. New Tables
    - notifications
      - For system notifications (new listings, acceptances, etc.)
      - Includes RLS policies for user access
    - reviews
      - For user feedback and ratings
      - Includes RLS policies and constraints

  2. Functions and Triggers
    - Notification creation helper function
    - Triggers for new food listings
    - Triggers for accepted donations

  3. Security
    - RLS enabled for all tables
    - Appropriate policies for data access
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT notifications_type_check CHECK (type IN ('new_listing', 'accepted', 'pickup_reminder', 'feedback'))
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Policies for notifications
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

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES food_listings(id) ON DELETE CASCADE,
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- Enable RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for completed listings" ON reviews;

-- Policies for reviews
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

-- Create notification functions
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text
) RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (p_user_id, p_type, p_title, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for new listings
CREATE OR REPLACE FUNCTION notify_new_listing()
RETURNS trigger AS $$
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

-- Create trigger for new food listings
DROP TRIGGER IF EXISTS on_new_food_listing ON food_listings;
CREATE TRIGGER on_new_food_listing
  AFTER INSERT ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_listing();

-- Create trigger function for accepted listings
CREATE OR REPLACE FUNCTION notify_accepted_listing()
RETURNS trigger AS $$
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

-- Create trigger for accepted food listings
DROP TRIGGER IF EXISTS on_accepted_food_listing ON food_listings;
CREATE TRIGGER on_accepted_food_listing
  AFTER UPDATE ON food_listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_accepted_listing();