export interface Experience {
  id: string;
  title: string;
  description: string;
  category: string[];
  xpGained: number;
  date: Date;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  totalXP: number;
  currentClass: CharacterClass | null;
  race: CharacterRace | null;
  raceLocked: boolean;
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
    name: "Barbarian",
    description: "Raw strength and primal fury",
    primarySkill: "Physical Training",
    icon: "🪓",
    color: "gold"
  },
  {
    name: "Bard",
    description: "Jack-of-all-trades and master of inspiration",
    primarySkill: "Social Skills",
    icon: "🎵",
    color: "mystical"
  },
  {
    name: "Cleric",
    description: "Divine magic through spirituality and philosophy",
    primarySkill: "Spiritual Practice",
    icon: "✨",
    color: "emerald"
  },
  {
    name: "Druid",
    description: "Nature's balance of strength, magic, and healing",
    primarySkill: "Health & Fitness",
    icon: "🌿",
    color: "emerald"
  },
  {
    name: "Fighter",
    description: "Master of weapons and combat techniques",
    primarySkill: "Physical Training",
    icon: "⚔️",
    color: "gold"
  },
  {
    name: "Monk",
    description: "Martial arts, energy work, and inner balance",
    primarySkill: "Energy Work",
    icon: "👊",
    color: "energy-blue"
  },
  {
    name: "Paladin",
    description: "Holy warrior combining healing and spirituality",
    primarySkill: "Spiritual Practice",
    icon: "🛡️",
    color: "emerald"
  },
  {
    name: "Ranger",
    description: "Stealthy marksman with bow and guns",
    primarySkill: "Adventure",
    icon: "🏹",
    color: "energy-blue"
  },
  {
    name: "Rogue",
    description: "Master of stealth, theft, and deception",
    primarySkill: "Social Skills",
    icon: "🗡️",
    color: "mystical"
  },
  {
    name: "Sorcerer",
    description: "Innate magical power and raw energy",
    primarySkill: "Energy Work",
    icon: "⚡",
    color: "mystical"
  },
  {
    name: "Warlock",
    description: "Magic through pacts and animal companions",
    primarySkill: "Energy Work",
    icon: "🔮",
    color: "mystical"
  },
  {
    name: "Wizard",
    description: "Learned magic through study and philosophy",
    primarySkill: "Learning & Study",
    icon: "📚",
    color: "mystical"
  }
];

export const CHARACTER_RACES: CharacterRace[] = [
  {
    name: "Human",
    description: "Adaptable and versatile",
    traits: ["Balanced", "Quick Learner", "Versatile"],
    icon: "👤"
  },
  {
    name: "Elf",
    description: "Graceful and wise",
    traits: ["Mystical Affinity", "Long-lived", "Graceful"],
    icon: "🧝"
  },
  {
    name: "Dwarf",
    description: "Hardy and determined",
    traits: ["Resilient", "Crafty", "Master Crafter"],
    icon: "⛏️"
  },
  {
    name: "Orc",
    description: "Strong and fierce",
    traits: ["Powerful", "Bold", "Intimidating"],
    icon: "👹"
  },
  {
    name: "Dragonborn",
    description: "Noble and powerful",
    traits: ["Dragon Heritage", "Elemental Breath", "Proud"],
    icon: "🐉"
  },
  {
    name: "Gnome",
    description: "Small but clever",
    traits: ["Ingenious", "Curious", "Tinker"],
    icon: "🧚"
  },
  {
    name: "Drow",
    description: "Dark and mysterious",
    traits: ["Shadow Magic", "Cunning", "Stealthy"],
    icon: "🕸️"
  },
  {
    name: "Halfling",
    description: "Small and lucky",
    traits: ["Lucky", "Brave", "Nimble"],
    icon: "🍃"
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