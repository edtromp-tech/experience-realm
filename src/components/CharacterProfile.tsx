import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Character } from "@/types/character";
import { CategoryXPBadges } from "./CategoryXPBadges";
import { PersonalityChart } from "./PersonalityChart";
import { useState } from "react";

interface CharacterProfileProps {
  character: Character;
  onViewAllExperiences?: () => void;
}

export const CharacterProfile = ({ character, onViewAllExperiences }: CharacterProfileProps) => {
  const [showPersonalityChart, setShowPersonalityChart] = useState(false);
  const [chartTitle, setChartTitle] = useState("");
  const [chartSubtitle, setChartSubtitle] = useState("");
  
  const levelProgress = (character.totalXP % 1000) / 10; // Progress to next level
  const nextLevelXP = Math.ceil(character.totalXP / 1000) * 1000;

  const handleShowChart = (title: string, subtitle: string) => {
    setChartTitle(title);
    setChartSubtitle(subtitle);
    setShowPersonalityChart(true);
  };

  return (
    <Card className="bg-gradient-mystical border-mystical shadow-glow-mystical">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-gold">
          {character.name}
        </CardTitle>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Level {character.level}
          </Badge>
          <div className="text-lg text-gold font-semibold">
            {character.totalXP.toLocaleString()} XP
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress to Level {character.level + 1}</span>
            <span>{nextLevelXP - character.totalXP} XP to go</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>

        {/* Category XP Badges */}
        <CategoryXPBadges 
          experiences={character.experiences} 
          onViewAllExperiences={onViewAllExperiences || (() => {})}
        />

        {/* Character Class & Race */}
        <div className="grid grid-cols-2 gap-4">
          {character.currentClass && (
            <div 
              className="text-center p-3 rounded-lg bg-secondary/50 border cursor-pointer hover:bg-secondary/70 transition-colors"
              onClick={() => handleShowChart(
                character.currentClass!.name, 
                `Class focus: ${character.currentClass!.primarySkill}`
              )}
            >
              <div className="text-2xl mb-1">{character.currentClass.icon}</div>
              <div className="font-semibold text-gold">{character.currentClass.name}</div>
              <div className="text-xs text-muted-foreground">
                {character.currentClass.description}
              </div>
            </div>
          )}
          
          {character.race && (
            <div 
              className="text-center p-3 rounded-lg bg-secondary/50 border cursor-pointer hover:bg-secondary/70 transition-colors"
              onClick={() => handleShowChart(
                character.race!.name, 
                `Traits: ${character.race!.traits.join(", ")}`
              )}
            >
              <div className="text-2xl mb-1">{character.race.icon}</div>
              <div className="font-semibold text-gold">{character.race.name}</div>
              <div className="text-xs text-muted-foreground">
                {character.race.traits.join(", ")}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-secondary/30">
            <div className="text-lg font-bold text-gold">{character.experiences.length}</div>
            <div className="text-xs text-muted-foreground">Experiences</div>
          </div>
          <div className="p-2 rounded bg-secondary/30">
            <div className="text-lg font-bold text-emerald">{character.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
          <div className="p-2 rounded bg-secondary/30">
            <div className="text-lg font-bold text-energy-blue">
              {Math.floor(character.totalXP / 100)}
            </div>
            <div className="text-xs text-muted-foreground">Milestones</div>
          </div>
        </div>
      </CardContent>
      
      <PersonalityChart
        open={showPersonalityChart}
        onOpenChange={setShowPersonalityChart}
        experiences={character.experiences}
        title={chartTitle}
        subtitle={chartSubtitle}
      />
    </Card>
  );
};