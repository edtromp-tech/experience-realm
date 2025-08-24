import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Experience, EXPERIENCE_CATEGORIES } from "@/types/character";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

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

  // Prepare radar chart data - include all categories for consistent spider web
  const radarData = EXPERIENCE_CATEGORIES.map(category => {
    const xp = categoryXP[category] || 0;
    const normalizedValue = totalXP > 0 ? Math.round((xp / totalXP) * 100) : 0;
    
    return {
      category: category.replace(" & ", "\n& "), // Line break for better display
      xp: xp,
      value: normalizedValue,
      fullName: category
    };
  }).filter(item => item.xp > 0 || totalXP === 0); // Show all if no XP, only active if has XP

  // Sort categories by XP amount for the summary
  const sortedCategories = EXPERIENCE_CATEGORIES
    .filter(cat => categoryXP[cat] > 0)
    .sort((a, b) => (categoryXP[b] || 0) - (categoryXP[a] || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-card to-secondary/30 border-gold">
        <DialogHeader>
          <DialogTitle className="text-gold text-center">
            {title} Personality Web
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            {subtitle}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {radarData.length === 0 ? (
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

              {/* Spider Web Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeOpacity={0.3}
                    />
                    <PolarAngleAxis 
                      dataKey="category" 
                      tick={{ 
                        fontSize: 10, 
                        fill: "hsl(var(--foreground))",
                        textAnchor: 'middle'
                      }}
                      className="text-xs"
                    />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, Math.max(100, Math.max(...radarData.map(d => d.value)))]}
                      tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Radar
                      name="XP Distribution"
                      dataKey="value"
                      stroke="hsl(var(--gold))"
                      fill="hsl(var(--gold))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--gold))", strokeWidth: 2, r: 4 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 3 Categories Summary */}
              {sortedCategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sortedCategories.slice(0, 3).map((category, index) => (
                    <div key={category} className="p-4 rounded-lg bg-secondary/50 border text-center">
                      <Badge variant="secondary" className="mb-2">
                        #{index + 1}
                      </Badge>
                      <div className="font-semibold text-gold text-sm mb-1">
                        {category}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {categoryXP[category].toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((categoryXP[category] / totalXP) * 100).toFixed(1)}% of total XP
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Personality Insights */}
              <div className="p-4 rounded-lg bg-gradient-mystical/20 border-mystical/30">
                <h4 className="font-semibold text-gold mb-2 text-center">
                  🔮 Personality Insights
                </h4>
                <div className="text-sm text-center text-muted-foreground">
                  {sortedCategories.length > 0 && (
                    <p>
                      Your strongest trait is <span className="text-gold font-semibold">{sortedCategories[0]}</span>
                      {sortedCategories.length > 1 && (
                        <>, with developing skills in <span className="text-mystical font-semibold">{sortedCategories[1]}</span></>
                      )}
                      {sortedCategories.length > 2 && (
                        <> and <span className="text-emerald font-semibold">{sortedCategories[2]}</span></>
                      )}
                      . This makes you a well-rounded adventurer!
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};