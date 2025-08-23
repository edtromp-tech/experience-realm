import { useState, useEffect } from "react";
import { Character, Experience, CHARACTER_CLASSES, CHARACTER_RACES } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useCharacter = () => {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character>({
    id: "1",
    name: "Adventurer",
    level: 1,
    totalXP: 0,
    currentClass: null,
    race: CHARACTER_RACES[0],
    raceLocked: false,
    experiences: []
  });
  const [loading, setLoading] = useState(true);

  // Load character data from Supabase
  useEffect(() => {
    const loadCharacter = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's character
        const { data: characters, error: charError } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (charError && charError.code !== 'PGRST116') {
          console.error('Error loading character:', charError);
          setLoading(false);
          return;
        }

        // Get experiences for the character
        let experiences: Experience[] = [];
        if (characters) {
          const { data: experiencesData, error: expError } = await supabase
            .from('experiences')
            .select('*')
            .eq('character_id', characters.id)
            .order('date', { ascending: false });

          if (expError) {
            console.error('Error loading experiences:', expError);
          } else {
            experiences = experiencesData.map(exp => ({
              id: exp.id,
              title: exp.title,
              description: exp.description,
              category: exp.category,
              xpGained: exp.xp_gained,
              date: new Date(exp.date)
            }));
          }
        }

        if (characters) {
          // Find class and race objects
          const currentClass = characters.current_class_name
            ? CHARACTER_CLASSES.find(cls => cls.name === characters.current_class_name) || null
            : null;
          
          const race = characters.race_name
            ? CHARACTER_RACES.find(r => r.name === characters.race_name) || CHARACTER_RACES[0]
            : CHARACTER_RACES[0];

          setCharacter({
            id: characters.id,
            name: characters.name,
            level: characters.level,
            totalXP: characters.total_xp,
            currentClass,
            race,
            raceLocked: characters.race_locked || false,
            experiences
          });
        } else {
          // Create new character for user
          await createNewCharacter();
        }
      } catch (error) {
        console.error('Error in loadCharacter:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [user]);

  const createNewCharacter = async () => {
    if (!user) return;

    try {
      const { data: newCharacter, error } = await supabase
        .from('characters')
        .insert([{
          user_id: user.id,
          name: 'Adventurer',
          level: 1,
          total_xp: 0,
          current_class_name: null,
          race_name: 'Human'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating character:', error);
        return;
      }

      setCharacter({
        id: newCharacter.id,
        name: newCharacter.name,
        level: newCharacter.level,
        totalXP: newCharacter.total_xp,
        currentClass: null,
        race: CHARACTER_RACES[0],
        raceLocked: false,
        experiences: []
      });
    } catch (error) {
      console.error('Error in createNewCharacter:', error);
    }
  };

  const addExperience = async (experienceData: {
    title: string;
    description: string;
    categories: string[];
    xpGained: number;
  }) => {
    if (!user) return;

    try {
      // Add experience to database
      const { data: newExp, error } = await supabase
        .from('experiences')
        .insert([{
          character_id: character.id,
          title: experienceData.title,
          description: experienceData.description,
          category: experienceData.categories,
          xp_gained: experienceData.xpGained
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding experience:', error);
        return;
      }

      const newExperience: Experience = {
        id: newExp.id,
        title: newExp.title,
        description: newExp.description,
        category: newExp.category,
        xpGained: newExp.xp_gained,
        date: new Date(newExp.date)
      };

      // Calculate XP per category and update character stats
      const xpPerCategory = Math.floor(experienceData.xpGained / experienceData.categories.length);
      const totalXpToAdd = xpPerCategory * experienceData.categories.length;
      
      const newTotalXP = character.totalXP + totalXpToAdd;
      const newLevel = Math.floor(newTotalXP / 1000) + 1;
      const newExperiences = [newExperience, ...character.experiences];
      
      // Determine class based on experiences
      const categoryCount: Record<string, number> = {};
      newExperiences.forEach(exp => {
        const categories = Array.isArray(exp.category) ? exp.category : [exp.category];
        categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + Math.floor(exp.xpGained / categories.length);
        });
      });

      // Find the category with the most XP
      const dominantCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      let newClass = character.currentClass;
      let newRace = character.race;
      
      if (dominantCategory) {
        // Map categories to classes
        const classMapping: Record<string, string> = {
          "Health & Fitness": "Druid",
          "Energy Work": "Monk",
          "Physical Training": "Barbarian",
          "Learning & Study": "Wizard",
          "Creativity": "Bard",
          "Leadership": "Paladin",
          "Social Skills": "Bard",
          "Technical Skills": "Wizard",
          "Spiritual Practice": "Cleric",
          "Adventure": "Ranger"
        };

        const suggestedClassName = classMapping[dominantCategory] || "Fighter";
        newClass = CHARACTER_CLASSES.find(cls => cls.name === suggestedClassName) || character.currentClass;

        // Map categories to races based on experience focus
        const raceMapping: Record<string, string> = {
          "Physical Training": "Orc",
          "Technical Skills": "Dwarf",
          "Creativity": "Dwarf",
          "Energy Work": "Elf",
          "Spiritual Practice": "Elf",
          "Leadership": "Dragonborn",
          "Adventure": "Halfling",
          "Social Skills": "Drow",
          "Learning & Study": "Gnome"
        };

        // Only auto-assign race if they don't have much experience yet (under 2000 XP) or if current race is Human
        // AND if race is not locked
        const shouldAutoAssignRace = !character.raceLocked && (newTotalXP < 2000 || character.race?.name === "Human");
        if (shouldAutoAssignRace) {
          const suggestedRaceName = raceMapping[dominantCategory] || "Human";
          const suggestedRace = CHARACTER_RACES.find(race => race.name === suggestedRaceName);
          if (suggestedRace) {
            newRace = suggestedRace;
          }
        }
      }

      const updatedCharacter = {
        ...character,
        experiences: newExperiences,
        totalXP: newTotalXP,
        level: newLevel,
        currentClass: newClass,
        race: newRace
      };

      // Update character in database
      await supabase
        .from('characters')
        .update({
          total_xp: newTotalXP,
          level: newLevel,
          current_class_name: newClass?.name || null,
          race_name: newRace?.name || 'Human'
        })
        .eq('id', character.id);

      setCharacter(updatedCharacter);
    } catch (error) {
      console.error('Error in addExperience:', error);
    }
  };

  const updateCharacterName = async (name: string) => {
    if (!user) return;

    try {
      await supabase
        .from('characters')
        .update({ name })
        .eq('id', character.id);

      setCharacter(prev => ({ ...prev, name }));
    } catch (error) {
      console.error('Error updating character name:', error);
    }
  };

  const setCharacterRace = async (raceName: string) => {
    if (!user) return;

    const race = CHARACTER_RACES.find(r => r.name === raceName);
    if (race) {
      try {
        await supabase
          .from('characters')
          .update({ race_name: raceName })
          .eq('id', character.id);

        setCharacter(prev => ({ ...prev, race }));
      } catch (error) {
        console.error('Error updating character race:', error);
      }
    }
  };

  const toggleRaceLock = async () => {
    if (!user) return;

    try {
      const newLockState = !character.raceLocked;
      await supabase
        .from('characters')
        .update({ race_locked: newLockState })
        .eq('id', character.id);

      setCharacter(prev => ({ ...prev, raceLocked: newLockState }));
    } catch (error) {
      console.error('Error toggling race lock:', error);
    }
  };

  return {
    character,
    addExperience,
    updateCharacterName,
    setCharacterRace,
    toggleRaceLock,
    loading
  };
};