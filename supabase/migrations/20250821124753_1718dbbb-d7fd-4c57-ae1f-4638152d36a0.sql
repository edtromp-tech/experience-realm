-- Create characters table to store user character data
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Adventurer',
  level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_class_name TEXT,
  race_name TEXT DEFAULT 'Human',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table to store character experiences
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  xp_gained INTEGER NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for characters table
CREATE POLICY "Users can view their own characters" 
ON public.characters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" 
ON public.characters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" 
ON public.characters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" 
ON public.characters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for experiences table
CREATE POLICY "Users can view experiences for their characters" 
ON public.experiences 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = experiences.character_id 
    AND characters.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create experiences for their characters" 
ON public.experiences 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = experiences.character_id 
    AND characters.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update experiences for their characters" 
ON public.experiences 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = experiences.character_id 
    AND characters.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete experiences for their characters" 
ON public.experiences 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = experiences.character_id 
    AND characters.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();