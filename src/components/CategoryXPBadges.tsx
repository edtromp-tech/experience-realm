import { Badge } from "@/components/ui/badge";
import { Experience } from "@/types/character";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExperienceList } from "./ExperienceList";

interface CategoryXPBadgesProps {
  experiences: Experience[];
  onViewAllExperiences: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Health & Fitness": "🏃",
  "Energy Work": "⚡",
  "Physical Training": "💪",
  "Learning & Study": "📚",
  "Creativity": "🎨",
  "Leadership": "👑",
  "Social Skills": "🤝",
  "Technical Skills": "⚙️",
  "Spiritual Practice": "🧘",
  "Adventure": "🗺️",
  "Custom": "⭐"
};

export const CategoryXPBadges = ({ experiences, onViewAllExperiences }: CategoryXPBadgesProps) => {
  // Calculate XP per category
  const categoryXP = experiences.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.xpGained;
    return acc;
  }, {} as Record<string, number>);

  // Filter out categories with no XP
  const categoriesWithXP = Object.entries(categoryXP)
    .filter(([, xp]) => xp > 0)
    .sort(([, a], [, b]) => b - a); // Sort by XP descending

  const getCategoryExperiences = (category: string) => {
    return experiences.filter(exp => exp.category === category);
  };

  return (
    <div className="space-y-3">
      {/* Total XP - clickable to view all */}
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={onViewAllExperiences}
            >
              Total: {experiences.reduce((sum, exp) => sum + exp.xpGained, 0).toLocaleString()} XP
            </Badge>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Experiences</DialogTitle>
            </DialogHeader>
            <ExperienceList experiences={experiences} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap justify-center gap-2">
        {categoriesWithXP.map(([category, xp]) => (
          <Dialog key={category}>
            <DialogTrigger asChild>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary/30 transition-colors px-3 py-1 text-sm"
              >
                <span className="mr-1">{CATEGORY_EMOJIS[category] || "⭐"}</span>
                {xp.toLocaleString()} XP
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{CATEGORY_EMOJIS[category] || "⭐"}</span>
                  {category} Experiences
                </DialogTitle>
              </DialogHeader>
              <ExperienceList experiences={getCategoryExperiences(category)} />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};