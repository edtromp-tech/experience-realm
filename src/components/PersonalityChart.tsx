import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Experience, CHARACTER_RACES } from "@/types/character";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

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
  // Calculate XP per category first
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

  // Map categories to races (same logic as useCharacter)
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

  // Calculate XP per race
  const raceXP: Record<string, number> = {};
  
  // Initialize all races to 0
  CHARACTER_RACES.forEach(race => {
    raceXP[race.name] = 0;
  });

  // Add XP to races based on category mapping
  Object.entries(categoryXP).forEach(([category, xp]) => {
    const raceName = raceMapping[category];
    if (raceName && raceXP[raceName] !== undefined) {
      raceXP[raceName] += xp;
    } else {
      // Unmapped categories contribute to Human (balanced/versatile)
      raceXP["Human"] += xp;
    }
  });

  // Prepare radar chart data for races
  const radarData = CHARACTER_RACES.map(race => {
    const xp = raceXP[race.name];
    const normalizedValue = totalXP > 0 ? Math.round((xp / totalXP) * 100) : 0;
    
    return {
      race: race.name,
      xp: xp,
      value: normalizedValue,
      icon: race.icon,
      traits: race.traits.join(", ")
    };
  }).filter(item => item.xp > 0 || totalXP === 0);

  // Sort races by XP amount for the summary
  const sortedRaces = CHARACTER_RACES
    .filter(race => raceXP[race.name] > 0)
    .sort((a, b) => raceXP[b.name] - raceXP[a.name]);

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
                      dataKey="race" 
                      tick={{ 
                        fontSize: 12, 
                        fill: "hsl(var(--foreground))",
                        textAnchor: 'middle'
                      }}
                      className="text-sm font-medium"
                    />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, Math.max(100, Math.max(...radarData.map(d => d.value)))]}
                      tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Radar
                      name="Race Alignment"
                      dataKey="value"
                      stroke="hsl(var(--gold))"
                      fill="hsl(var(--gold))"
                      fillOpacity={0.2}
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--gold))", strokeWidth: 2, r: 5 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 3 Races Summary */}
              {sortedRaces.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sortedRaces.slice(0, 3).map((race, index) => (
                    <div key={race.name} className="p-4 rounded-lg bg-secondary/50 border text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl">{race.icon}</span>
                        <Badge variant="secondary">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="font-semibold text-gold text-sm mb-1">
                        {race.name}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {raceXP[race.name].toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {((raceXP[race.name] / totalXP) * 100).toFixed(1)}% alignment
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {race.traits.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Personality Insights */}
              <div className="p-4 rounded-lg bg-gradient-mystical/20 border-mystical/30">
                <h4 className="font-semibold text-gold mb-2 text-center">
                  🔮 Racial Alignment
                </h4>
                <div className="text-sm text-center text-muted-foreground">
                  {sortedRaces.length > 0 && (
                    <p>
                      You align most closely with the <span className="text-gold font-semibold">{sortedRaces[0].name}</span> race
                      {sortedRaces.length > 1 && (
                        <>, with traits of <span className="text-mystical font-semibold">{sortedRaces[1].name}</span></>
                      )}
                      {sortedRaces.length > 2 && (
                        <> and hints of <span className="text-emerald font-semibold">{sortedRaces[2].name}</span></>
                      )}
                      . Your experiences shape your character's heritage!
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