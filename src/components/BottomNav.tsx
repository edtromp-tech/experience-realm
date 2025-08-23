import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddExperienceForm } from "@/components/AddExperienceForm";
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
}

export const BottomNav = ({ onAddExperience }: BottomNavProps) => {
  const { user, signOut } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddExperience = (experienceData: {
    title: string;
    description: string;
    categories: string[];
    xpGained: number;
  }) => {
    onAddExperience(experienceData);
    setShowAddForm(false);
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
            <PopoverContent className="w-64 mb-2" align="start">
              <div className="space-y-3">
                <div className="border-b border-border pb-3">
                  <p className="text-sm text-muted-foreground">Signed in as:</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
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