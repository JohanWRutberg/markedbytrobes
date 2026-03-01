-- Update Category enum in production database
-- This adds the new category values that are in the schema

-- First, check existing enum values
DO $$
BEGIN
    -- Add new enum values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SPORTS_ROMANCE' AND enumtypid = 'Category'::regtype) THEN
        ALTER TYPE "Category" ADD VALUE 'SPORTS_ROMANCE';
    END IF;
END$$;
