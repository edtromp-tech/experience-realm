import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExperiencePrompt {
  id: string;
  title: string;
  description: string;
  categories: string[];
  xp: number;
}

export const useExperiencePrompts = () => {
  const [prompts, setPrompts] = useState<ExperiencePrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('experience_prompts')
        .select('*')
        .order('title');

      if (error) {
        console.error('Error fetching experience prompts:', error);
        return;
      }

      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching experience prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchExperiencePrompts = (query: string): ExperiencePrompt[] => {
    if (!query.trim()) return prompts.slice(0, 5);
    
    const lowerQuery = query.toLowerCase();
    return prompts
      .filter(prompt => 
        prompt.title.toLowerCase().includes(lowerQuery) ||
        prompt.description.toLowerCase().includes(lowerQuery) ||
        prompt.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8);
  };

  return {
    prompts,
    loading,
    searchExperiencePrompts
  };
};