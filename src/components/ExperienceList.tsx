import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/types/character";
import { Calendar, Star, Scroll } from "lucide-react";
import { format } from "date-fns";

interface ExperienceListProps {
  experiences: Experience[];
}

export const ExperienceList = ({ experiences }: ExperienceListProps) => {
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
              <CardTitle className="text-base text-foreground">
                {experience.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-gold text-background">
                  <Star className="h-3 w-3 mr-1" />
                  {experience.xpGained} XP
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(experience.date), "MMM dd, yyyy")}
              <Badge variant="outline" className="text-xs">
                {experience.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-foreground/80 mb-2">
              {experience.description}
            </p>
            {experience.notes && (
              <div className="p-2 bg-secondary/30 rounded border-l-2 border-mystical">
                <p className="text-xs text-muted-foreground italic">
                  "{experience.notes}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};