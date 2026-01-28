-- Migration: Add checkout customization fields to profiles table
-- Run this in your Supabase SQL Editor

-- Add checkout customization fields for influencers
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS checkout_title TEXT,
ADD COLUMN IF NOT EXISTS checkout_description TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.checkout_title IS 'Custom checkout title for influencer coupon page';
COMMENT ON COLUMN profiles.checkout_description IS 'Custom checkout description for influencer coupon page';
