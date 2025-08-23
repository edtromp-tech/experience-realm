import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, BarChart3, User, LogOut, Edit3, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddExperienceForm } from "@/components/AddExperienceForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHARACTER_RACES, Character } from "@/types/character";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface BottomNavProps {
  onAddExperience: (experience: {
    title: string;
    description: string;
    categories: string[];
    xpGained: number;
  }) => void;
  character: Character;
  updateCharacterName: (name: string) => void;
  setCharacterRace: (race: string) => void;
  toggleRaceLock: () => void;
}

export const BottomNav = ({ onAddExperience, character, updateCharacterName, setCharacterRace, toggleRaceLock }: BottomNavProps) => {
  const { user, signOut } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(character.name);

  const handleAddExperience = (experienceData: {
    title: string;
    description: string;
    categories: string[];
    xpGained: number;
  }) => {
    onAddExperience(experienceData);
    setShowAddForm(false);
  };

  const handleNameUpdate = () => {
    if (tempName.trim()) {
      updateCharacterName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Account Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
                <User className="h-5 w-5" />
                <span className="text-xs">Account</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mb-2" align="start">
              <div className="space-y-4">
                {/* User Info */}
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Signed in as:</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>

                {/* Character Name Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">Character Name</label>
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Character name..."
                        onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                        className="flex-1"
                      />
                      <Button onClick={handleNameUpdate} size="sm" className="bg-gradient-mystical">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gold">{character.name}</span>
                      <Button
                        onClick={() => {
                          setIsEditingName(true);
                          setTempName(character.name);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Race Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gold">Character Race</label>
                    <Button
                      onClick={toggleRaceLock}
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${character.raceLocked ? 'text-gold' : 'text-muted-foreground'}`}
                      title={character.raceLocked ? 'Race is locked - click to unlock' : 'Race can change automatically - click to lock'}
                    >
                      {character.raceLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Select
                    value={character.race?.name || ""}
                    onValueChange={(value) => setCharacterRace(value)}
                    disabled={character.raceLocked}
                  >
                    <SelectTrigger className={`bg-secondary/50 ${character.raceLocked ? 'opacity-60' : ''}`}>
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
                  {character.raceLocked && (
                    <p className="text-xs text-muted-foreground">Race is locked and won't change with new experiences</p>
                  )}
                </div>

                {/* Sign Out */}
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Add Experience Button */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-gold text-background hover:shadow-glow-gold transition-all duration-300 rounded-full h-14 w-14 p-0"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <AddExperienceForm onAddExperience={handleAddExperience} />
            </DialogContent>
          </Dialog>

          {/* Dashboard Button */}
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 opacity-50" disabled>
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-20" />
    </>
  );
};