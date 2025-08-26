-- Create experience_prompts table
CREATE TABLE public.experience_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  xp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.experience_prompts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (all users can view prompts)
CREATE POLICY "Experience prompts are publicly readable" 
ON public.experience_prompts 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_experience_prompts_updated_at
BEFORE UPDATE ON public.experience_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing experience prompts data
INSERT INTO public.experience_prompts (title, description, categories, xp) VALUES
-- Fitness & Health
('Completed a workout session', 'Finished a full workout routine focusing on strength and endurance', ARRAY['Health & Fitness'], 25),
('Went for a morning run', 'Started the day with an energizing run around the neighborhood', ARRAY['Health & Fitness'], 20),
('Tried a new healthy recipe', 'Cooked a nutritious meal with fresh ingredients', ARRAY['Health & Fitness', 'Creative'], 30),

-- Learning & Education
('Completed an online course', 'Finished a comprehensive online course and gained new knowledge', ARRAY['Learning & Education'], 50),
('Read a book chapter', 'Made progress on personal development through reading', ARRAY['Learning & Education'], 15),
('Learned a new programming concept', 'Studied and understood a new technical concept or framework', ARRAY['Learning & Education', 'Professional'], 35),

-- Professional
('Completed a work project', 'Successfully delivered a project on time with quality results', ARRAY['Professional'], 40),
('Networking event', 'Attended a professional networking event and made new connections', ARRAY['Professional', 'Social'], 30),
('Gave a presentation', 'Successfully presented ideas to colleagues or clients', ARRAY['Professional'], 35),

-- Creative
('Started a creative project', 'Began working on a new artistic or creative endeavor', ARRAY['Creative'], 25),
('Wrote in a journal', 'Reflected on thoughts and experiences through writing', ARRAY['Creative', 'Personal'], 20),
('Learned to play a song', 'Practiced and mastered a new piece of music', ARRAY['Creative'], 30),

-- Social
('Had dinner with friends', 'Enjoyed quality time and conversation with good friends', ARRAY['Social'], 25),
('Helped someone in need', 'Offered assistance and support to someone who needed it', ARRAY['Social', 'Personal'], 30),
('Organized a social gathering', 'Planned and hosted an event for friends or family', ARRAY['Social'], 35),

-- Personal
('Practiced meditation', 'Spent time in mindfulness and self-reflection', ARRAY['Personal'], 20),
('Organized living space', 'Decluttered and organized home or work environment', ARRAY['Personal'], 25),
('Tried something new', 'Stepped out of comfort zone and experienced something different', ARRAY['Personal'], 30),

-- Adventure & Travel
('Explored a new place', 'Visited and discovered a new location or neighborhood', ARRAY['Adventure & Travel'], 30),
('Went hiking', 'Enjoyed nature and exercise on a hiking trail', ARRAY['Adventure & Travel', 'Health & Fitness'], 35),
('Planned a trip', 'Researched and organized an upcoming travel adventure', ARRAY['Adventure & Travel'], 25);