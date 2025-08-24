import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Experience, EXPERIENCE_CATEGORIES } from "@/types/character";

interface PersonalityChartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experiences: Experience[];
  title: string;
  subtitle: string;
}

export const PersonalityChart = ({ 
  open, 
  onOpenChange, 
  experiences, 
  title, 
  subtitle 
}: PersonalityChartProps) => {
  // Calculate XP per category
  const categoryXP: Record<string, number> = {};
  let totalXP = 0;

  experiences.forEach(exp => {
    const categories = Array.isArray(exp.category) ? exp.category : [exp.category];
    const xpPerCategory = Math.floor(exp.xpGained / categories.length);
    
    categories.forEach(cat => {
      categoryXP[cat] = (categoryXP[cat] || 0) + xpPerCategory;
      totalXP += xpPerCategory;
    });
  });

  // Sort categories by XP amount
  const sortedCategories = EXPERIENCE_CATEGORIES
    .filter(cat => categoryXP[cat] > 0)
    .sort((a, b) => (categoryXP[b] || 0) - (categoryXP[a] || 0));

  const getPercentage = (xp: number) => totalXP > 0 ? (xp / totalXP) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-card to-secondary/30 border-gold">
        <DialogHeader>
          <DialogTitle className="text-gold text-center">
            {title} Personality Chart
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            {subtitle}
          </p>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No experiences yet. Start your adventure!
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold mb-1">
                  {totalXP.toLocaleString()} XP
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Experience Points
                </div>
              </div>

              {sortedCategories.map((category) => {
                const xp = categoryXP[category];
                const percentage = getPercentage(xp);
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gold font-semibold">
                          {xp.toLocaleString()} XP
                        </span>
                        <span className="text-muted-foreground">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </div>
                );
              })}

              {/* Top 3 Categories Summary */}
              <div className="mt-6 p-4 rounded-lg bg-secondary/50 border">
                <h4 className="font-semibold text-gold mb-2 text-center">
                  Your Top Strengths
                </h4>
                <div className="space-y-1">
                  {sortedCategories.slice(0, 3).map((category, index) => (
                    <div key={category} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 text-xs flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="flex-1">{category}</span>
                      <span className="text-gold font-semibold">
                        {categoryXP[category].toLocaleString()} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};