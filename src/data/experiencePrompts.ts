export interface ExperiencePrompt {
  title: string;
  description: string;
  categories: string[];
  xp: number;
}

export const EXPERIENCE_PROMPTS: ExperiencePrompt[] = [
  // Fitness & Health
  {
    title: "Completed a workout session",
    description: "Finished a full workout routine focusing on strength and endurance",
    categories: ["Health & Fitness"],
    xp: 25
  },
  {
    title: "Went for a morning run",
    description: "Started the day with an energizing run around the neighborhood",
    categories: ["Health & Fitness"],
    xp: 20
  },
  {
    title: "Tried a new healthy recipe",
    description: "Cooked a nutritious meal with fresh ingredients",
    categories: ["Health & Fitness", "Creative"],
    xp: 30
  },

  // Learning & Education
  {
    title: "Completed an online course",
    description: "Finished a comprehensive online course and gained new knowledge",
    categories: ["Learning & Education"],
    xp: 50
  },
  {
    title: "Read a book chapter",
    description: "Made progress on personal development through reading",
    categories: ["Learning & Education"],
    xp: 15
  },
  {
    title: "Learned a new programming concept",
    description: "Studied and understood a new technical concept or framework",
    categories: ["Learning & Education", "Professional"],
    xp: 35
  },

  // Professional
  {
    title: "Completed a work project",
    description: "Successfully delivered a project on time with quality results",
    categories: ["Professional"],
    xp: 40
  },
  {
    title: "Networking event",
    description: "Attended a professional networking event and made new connections",
    categories: ["Professional", "Social"],
    xp: 30
  },
  {
    title: "Gave a presentation",
    description: "Successfully presented ideas to colleagues or clients",
    categories: ["Professional"],
    xp: 35
  },

  // Creative
  {
    title: "Started a creative project",
    description: "Began working on a new artistic or creative endeavor",
    categories: ["Creative"],
    xp: 25
  },
  {
    title: "Wrote in a journal",
    description: "Reflected on thoughts and experiences through writing",
    categories: ["Creative", "Personal"],
    xp: 20
  },
  {
    title: "Learned to play a song",
    description: "Practiced and mastered a new piece of music",
    categories: ["Creative"],
    xp: 30
  },

  // Social
  {
    title: "Had dinner with friends",
    description: "Enjoyed quality time and conversation with good friends",
    categories: ["Social"],
    xp: 25
  },
  {
    title: "Helped someone in need",
    description: "Offered assistance and support to someone who needed it",
    categories: ["Social", "Personal"],
    xp: 30
  },
  {
    title: "Organized a social gathering",
    description: "Planned and hosted an event for friends or family",
    categories: ["Social"],
    xp: 35
  },

  // Personal
  {
    title: "Practiced meditation",
    description: "Spent time in mindfulness and self-reflection",
    categories: ["Personal"],
    xp: 20
  },
  {
    title: "Organized living space",
    description: "Decluttered and organized home or work environment",
    categories: ["Personal"],
    xp: 25
  },
  {
    title: "Tried something new",
    description: "Stepped out of comfort zone and experienced something different",
    categories: ["Personal"],
    xp: 30
  },

  // Adventure & Travel
  {
    title: "Explored a new place",
    description: "Visited and discovered a new location or neighborhood",
    categories: ["Adventure & Travel"],
    xp: 30
  },
  {
    title: "Went hiking",
    description: "Enjoyed nature and exercise on a hiking trail",
    categories: ["Adventure & Travel", "Health & Fitness"],
    xp: 35
  },
  {
    title: "Planned a trip",
    description: "Researched and organized an upcoming travel adventure",
    categories: ["Adventure & Travel"],
    xp: 25
  }
];

export const searchExperiencePrompts = (query: string): ExperiencePrompt[] => {
  if (!query.trim()) return EXPERIENCE_PROMPTS.slice(0, 5);
  
  const lowerQuery = query.toLowerCase();
  return EXPERIENCE_PROMPTS
    .filter(prompt => 
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
    )
    .slice(0, 8);
};