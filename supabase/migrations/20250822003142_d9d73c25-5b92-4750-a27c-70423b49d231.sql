-- Update experiences table to support multiple categories
ALTER TABLE experiences 
ALTER COLUMN category TYPE text[] USING ARRAY[category];

-- Update the column to be not null with a default empty array
ALTER TABLE experiences 
ALTER COLUMN category SET DEFAULT '{}';

-- Create an index for better performance on category searches
CREATE INDEX idx_experiences_categories ON experiences USING GIN(category);

-- Update existing single category entries to array format (if any exist)
-- This is handled by the USING clause above, but we ensure consistency
UPDATE experiences 
SET category = ARRAY[category]::text[] 
WHERE array_length(category, 1) IS NULL AND category IS NOT NULL;