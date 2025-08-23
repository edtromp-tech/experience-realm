import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EXPERIENCE_CATEGORIES } from "@/types/character";
import { searchExperiencePrompts, ExperiencePrompt } from "@/data/experiencePrompts";
import { Plus, Sparkles, X } from "lucide-react";

interface AddExperienceFormProps {
  onAddExperience: (experience: {
    title: string;
    description: string;
    categories: string[];
    xpGained: number;
  }) => void;
  forceOpen?: boolean;
}

export const AddExperienceForm = ({ onAddExperience, forceOpen = false }: AddExperienceFormProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    xpGained: 20
  });
  const [titleQuery, setTitleQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ExperiencePrompt[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions when title changes
  useEffect(() => {
    if (titleQuery.trim()) {
      setSuggestions(searchExperiencePrompts(titleQuery));
      setShowSuggestions(true);
    } else {
      setSuggestions(searchExperiencePrompts("").slice(0, 3));
      setShowSuggestions(titleQuery.length > 0);
    }
  }, [titleQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.categories.length === 0) return;

    onAddExperience({
      title: formData.title,
      description: formData.description,
      categories: formData.categories,
      xpGained: formData.xpGained
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      categories: [],
      xpGained: 20
    });
    setTitleQuery("");
    setNewCategory("");
    setShowSuggestions(false);
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: ExperiencePrompt) => {
    setFormData({
      title: suggestion.title,
      description: suggestion.description,
      categories: [...suggestion.categories],
      xpGained: suggestion.xp
    });
    setTitleQuery(suggestion.title);
    setShowSuggestions(false);
  };

  const addCategory = (category: string) => {
    if (!formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };
/*
  if (!isOpen) {
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
*/
{isOpen && (

    <Card className="border-gold shadow-glow-gold bg-gradient-to-br from-card to-secondary/30">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Record Your Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="title">Experience Title</Label>
            <Input
              ref={inputRef}
              id="title"
              value={titleQuery}
              onChange={(e) => {
                setTitleQuery(e.target.value);
                setFormData(prev => ({ ...prev, title: e.target.value }));
              }}
              placeholder="Start typing to see suggestions..."
              required
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
                <CardContent className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium text-sm">{suggestion.title}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                      <div className="flex gap-1 mt-1">
                        {suggestion.categories.map((cat, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        <Badge variant="secondary" className="text-xs">{suggestion.xp} XP</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
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
            <Label>Categories</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category, index) => (
                  <Badge key={index} variant="default" className="bg-mystical">
                    {category}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeCategory(category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {EXPERIENCE_CATEGORIES.filter(cat => !formData.categories.includes(cat)).map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCategory(category)}
                    className="text-xs h-7"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddNewCategory} size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="xp">Total Experience Points</Label>
            <Input
              id="xp"
              type="number"
              min="0"
              max="100"
              value={formData.xpGained}
              onChange={(e) => setFormData(prev => ({ ...prev, xpGained: parseInt(e.target.value) || 20 }))}
            />
            {formData.categories.length > 1 && (
              <p className="text-xs text-muted-foreground mt-1">
                {Math.floor(formData.xpGained / formData.categories.length)} XP per category
              </p>
            )}
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
};
