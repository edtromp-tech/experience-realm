export interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  xpGained: number;
  date: Date;
  notes?: string;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  totalXP: number;
  currentClass: CharacterClass | null;
  race: CharacterRace | null;
  experiences: Experience[];
}

export interface CharacterClass {
  name: string;
  description: string;
  primarySkill: string;
  icon: string;
  color: string;
}

export interface CharacterRace {
  name: string;
  description: string;
  traits: string[];
  icon: string;
}

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    name: "Healer",
    description: "Master of restoration and wellness",
    primarySkill: "Health",
    icon: "❤️",
    color: "emerald"
  },
  {
    name: "Wizard",
    description: "Wielder of mystical arts and energy",
    primarySkill: "Energy Work",
    icon: "🔮",
    color: "mystical"
  },
  {
    name: "Warrior",
    description: "Strong and disciplined fighter",
    primarySkill: "Physical Training",
    icon: "⚔️",
    color: "gold"
  },
  {
    name: "Archer",
    description: "Precise and focused marksman",
    primarySkill: "Precision",
    icon: "🏹",
    color: "energy-blue"
  },
  {
    name: "Scholar",
    description: "Seeker of knowledge and wisdom",
    primarySkill: "Learning",
    icon: "📚",
    color: "mystical"
  },
  {
    name: "Artisan",
    description: "Creator of beautiful works",
    primarySkill: "Creativity",
    icon: "🎨",
    color: "gold"
  }
];

export const CHARACTER_RACES: CharacterRace[] = [
  {
    name: "Human",
    description: "Adaptable and versatile",
    traits: ["Balanced", "Quick Learner"],
    icon: "👤"
  },
  {
    name: "Elf",
    description: "Graceful and wise",
    traits: ["Mystical Affinity", "Long-lived"],
    icon: "🧝"
  },
  {
    name: "Dwarf",
    description: "Hardy and determined",
    traits: ["Resilient", "Crafty"],
    icon: "🧙"
  },
  {
    name: "Orc",
    description: "Strong and fierce",
    traits: ["Powerful", "Bold"],
    icon: "👹"
  }
];

export const EXPERIENCE_CATEGORIES = [
  "Health & Fitness",
  "Energy Work",
  "Physical Training",
  "Learning & Study",
  "Creativity",
  "Leadership",
  "Social Skills",
  "Technical Skills",
  "Spiritual Practice",
  "Adventure",
  "Custom"
];