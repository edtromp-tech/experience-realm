-- Update RLS policies for characters table to allow public leaderboard access
-- Users can view basic public info of all characters for leaderboard
CREATE POLICY "Characters basic info is publicly viewable for leaderboard" 
ON public.characters 
FOR SELECT 
USING (true);

-- Drop the restrictive policy and replace with more granular ones
DROP POLICY "Users can view their own characters" ON public.characters;

-- Re-create policy for full character access (own characters only)
CREATE POLICY "Users can view their full character details" 
ON public.characters 
FOR SELECT 
USING (auth.uid() = user_id);