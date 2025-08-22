import { CharacterProfile } from "@/components/CharacterProfile";
import { ExperienceList } from "@/components/ExperienceList";
import { BottomNav } from "@/components/BottomNav";
import { useCharacter } from "@/hooks/useCharacter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHARACTER_RACES } from "@/types/character";
import { useState, useEffect } from "react";
import { Edit3, Crown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { character, addExperience, updateCharacterName, setCharacterRace, loading: characterLoading } = useCharacter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(character.name);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update temp name when character name changes
  useEffect(() => {
    setTempName(character.name);
  }, [character.name]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Show loading while checking authentication or loading character
  if (authLoading || characterLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-gold" />
            <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Loading...
            </h1>
          </div>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleAddExperience = (experienceData: {
    title: string;
    description: string;
    category: string;
    xpGained: number;
    notes?: string;
  }) => {
    addExperience(experienceData);
    toast({
      title: "Experience Gained! ✨",
      description: `You earned ${experienceData.xpGained} XP for "${experienceData.title}"`,
      duration: 3000,
    });
  };

  const handleNameUpdate = () => {
    if (tempName.trim()) {
      updateCharacterName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-8 w-8 text-gold" />
          <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Life RPG Tracker
          </h1>
        </div>
        <p className="text-muted-foreground">Level up your real life experiences</p>
      </div>

      {/* Character Name Editor */}
      <div className="max-w-md mx-auto mb-6">
        {isEditingName ? (
          <div className="flex gap-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Character name..."
              className="text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
            />
            <Button onClick={handleNameUpdate} size="sm" className="bg-gradient-mystical">
              Save
            </Button>
            <Button 
              onClick={() => {
                setIsEditingName(false);
                setTempName(character.name);
              }} 
              variant="outline" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold text-gold">{character.name}</span>
            <Button
              onClick={() => setIsEditingName(true)}
              variant="ghost"
              size="sm"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Race Selector */}
      <div className="max-w-md mx-auto mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gold">Choose Your Race</label>
          <Select
            value={character.race?.name || ""}
            onValueChange={(value) => setCharacterRace(value)}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Select a race" />
            </SelectTrigger>
            <SelectContent>
              {CHARACTER_RACES.map((race) => (
                <SelectItem key={race.name} value={race.name}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{race.icon}</span>
                    <div>
                      <div className="font-medium">{race.name}</div>
                      <div className="text-xs text-muted-foreground">{race.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Character Profile */}
      <div className="max-w-md mx-auto">
        <CharacterProfile 
          character={character} 
          onViewAllExperiences={() => {}} 
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav onAddExperience={handleAddExperience} />
    </div>
  );
};

export default Index;
