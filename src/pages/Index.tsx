import { CharacterProfile } from "@/components/CharacterProfile";
import { ExperienceList } from "@/components/ExperienceList";
import { BottomNav } from "@/components/BottomNav";
import { useCharacter } from "@/hooks/useCharacter";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Crown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { character, addExperience, updateCharacterName, setCharacterRace, toggleRaceLock, loading: characterLoading } = useCharacter();
  const { toast } = useToast();
  const navigate = useNavigate();


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
    categories: string[];
    xpGained: number;
  }) => {
    addExperience(experienceData);
    const categoryText = experienceData.categories.length > 1 
      ? `${experienceData.categories.length} categories` 
      : experienceData.categories[0];
    toast({
      title: "Experience Gained! ✨",
      description: `You earned ${experienceData.xpGained} XP in ${categoryText} for "${experienceData.title}"`,
      duration: 3000,
    });
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


      {/* Character Profile */}
      <div className="max-w-md mx-auto">
        <CharacterProfile 
          character={character} 
          onViewAllExperiences={() => {}} 
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        onAddExperience={handleAddExperience} 
        character={character}
        updateCharacterName={updateCharacterName}
        setCharacterRace={setCharacterRace}
        toggleRaceLock={toggleRaceLock}
      />
    </div>
  );
};

export default Index;
