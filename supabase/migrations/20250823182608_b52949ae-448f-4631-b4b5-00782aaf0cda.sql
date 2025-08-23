-- Add race_locked column to characters table
ALTER TABLE public.characters 
ADD COLUMN race_locked boolean NOT NULL DEFAULT false;