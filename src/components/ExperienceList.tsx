import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/character";
import { Calendar, Star, Scroll, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { EditExperienceForm } from "./EditExperienceForm";

interface ExperienceListProps {
  experiences: Experience[];
  onEditExperience?: (id: string, experience: { title: string; description: string; categories: string[]; xpGained: number; }) => void;
  onDeleteExperience?: (id: string) => void;
}

export const ExperienceList = ({ experiences, onEditExperience, onDeleteExperience }: ExperienceListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const sortedExperiences = [...experiences].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (experiences.length === 0) {
    return (
      <Card className="border-dashed border-muted">
        <CardContent className="text-center py-8">
          <Scroll className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Your adventure begins here...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first experience to start your RPG journey!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
        <Scroll className="h-5 w-5" />
        Experience Log ({experiences.length})
      </h3>
      
      {sortedExperiences.map((experience) => (
        <Card 
          key={experience.id} 
          className="bg-gradient-to-r from-card to-secondary/20 border-secondary hover:shadow-glow-mystical transition-all duration-300"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base text-foreground flex-1 pr-2">
                {experience.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {(onEditExperience || onDeleteExperience) && (
                  <div className="flex gap-1">
                    {onEditExperience && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <EditExperienceForm
                            experience={experience}
                            onEditExperience={(updatedExp) => {
                              onEditExperience(experience.id, updatedExp);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    {onDeleteExperience && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{experience.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDeleteExperience(experience.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                )}
                <Badge variant="secondary" className="bg-gradient-gold text-background">
                  <Star className="h-3 w-3 mr-1" />
                  {experience.xpGained} XP
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(experience.date), "MMM dd, yyyy")}
              <div className="flex gap-1">
                {(Array.isArray(experience.category) ? experience.category : [experience.category]).map((cat, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-foreground/80 mb-2">
              {experience.description}
            </p>
            {(Array.isArray(experience.category) ? experience.category : [experience.category]).length > 1 && (
              <div className="p-2 bg-secondary/30 rounded border-l-2 border-mystical">
                <p className="text-xs text-muted-foreground">
                  XP distributed: {Math.floor(experience.xpGained / (Array.isArray(experience.category) ? experience.category : [experience.category]).length)} XP per category
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};