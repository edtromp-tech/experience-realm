import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EXPERIENCE_CATEGORIES } from "@/types/character";
import { Plus, Sparkles } from "lucide-react";

interface AddExperienceFormProps {
  onAddExperience: (experience: {
    title: string;
    description: string;
    category: string;
    xpGained: number;
    notes?: string;
  }) => void;
  forceOpen?: boolean;
}

export const AddExperienceForm = ({ onAddExperience, forceOpen = false }: AddExperienceFormProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    xpGained: 10,
    notes: "",
    customCategory: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = formData.category === "Custom" ? formData.customCategory : formData.category;
    
    if (!formData.title || !formData.description || !category) return;

    onAddExperience({
      title: formData.title,
      description: formData.description,
      category,
      xpGained: formData.xpGained,
      notes: formData.notes || undefined
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      xpGained: 10,
      notes: "",
      customCategory: ""
    });
    setIsOpen(false);
  };

  if (!isOpen && !forceOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-gold text-background hover:shadow-glow-gold transition-all duration-300"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add New Experience
        <Sparkles className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="border-gold shadow-glow-gold bg-gradient-to-br from-card to-secondary/30">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Record Your Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Experience Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What did you accomplish?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your experience..."
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.category === "Custom" && (
            <div>
              <Label htmlFor="customCategory">Custom Category</Label>
              <Input
                id="customCategory"
                value={formData.customCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                placeholder="Enter custom category..."
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="xp">Experience Points</Label>
            <Input
              id="xp"
              type="number"
              min="1"
              max="1000"
              value={formData.xpGained}
              onChange={(e) => setFormData(prev => ({ ...prev, xpGained: parseInt(e.target.value) || 10 }))}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional thoughts or reflections..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-gradient-mystical hover:shadow-glow-mystical">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-muted"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};