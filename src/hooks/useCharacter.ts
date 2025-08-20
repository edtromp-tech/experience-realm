import { useState, useEffect } from "react";
import { Character, Experience, CHARACTER_CLASSES, CHARACTER_RACES } from "@/types/character";

const STORAGE_KEY = "rpg-character-data";

export const useCharacter = () => {
  const [character, setCharacter] = useState<Character>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      parsed.experiences = parsed.experiences.map((exp: any) => ({
        ...exp,
        date: new Date(exp.date)
      }));
      return parsed;
    }
    
    return {
      id: "1",
      name: "Adventurer",
      level: 1,
      totalXP: 0,
      currentClass: null,
      race: CHARACTER_RACES[0], // Default to Human
      experiences: []
    };
  });

  // Save to localStorage whenever character changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  }, [character]);

  const addExperience = (experienceData: {
    title: string;
    description: string;
    category: string;
    xpGained: number;
    notes?: string;
  }) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...experienceData,
      date: new Date()
    };

    setCharacter(prev => {
      const newTotalXP = prev.totalXP + experienceData.xpGained;
      const newLevel = Math.floor(newTotalXP / 1000) + 1;
      const newExperiences = [newExperience, ...prev.experiences];
      
      // Determine class based on experiences
      const categoryCount: Record<string, number> = {};
      newExperiences.forEach(exp => {
        categoryCount[exp.category] = (categoryCount[exp.category] || 0) + exp.xpGained;
      });

      // Find the category with the most XP
      const dominantCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      let newClass = prev.currentClass;
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
        newClass = CHARACTER_CLASSES.find(cls => cls.name === suggestedClassName) || prev.currentClass;
      }

      return {
        ...prev,
        experiences: newExperiences,
        totalXP: newTotalXP,
        level: newLevel,
        currentClass: newClass
      };
    });
  };

  const updateCharacterName = (name: string) => {
    setCharacter(prev => ({ ...prev, name }));
  };

  const setCharacterRace = (raceName: string) => {
    const race = CHARACTER_RACES.find(r => r.name === raceName);
    if (race) {
      setCharacter(prev => ({ ...prev, race }));
    }
  };

  return {
    character,
    addExperience,
    updateCharacterName,
    setCharacterRace
  };
};