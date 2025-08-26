import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  total_xp: number;
  race_name: string;
  current_class_name: string;
}

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, level, total_xp, race_name, current_class_name')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-gold" />;
      case 2:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-card to-secondary/20 border border-border/50"
          >
            <div className="flex items-center gap-2 min-w-12">
              {getRankIcon(index + 1)}
              <Badge variant={getRankBadgeVariant(index + 1)}>
                #{index + 1}
              </Badge>
            </div>
            
            <div className="flex-1">
              <div className="font-medium">{entry.name}</div>
              <div className="text-sm text-muted-foreground">
                Level {entry.level} • {entry.total_xp.toLocaleString()} XP
              </div>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="outline" className="text-xs">
                {entry.race_name || 'Human'}
              </Badge>
              {entry.current_class_name && (
                <Badge variant="secondary" className="text-xs">
                  {entry.current_class_name}
                </Badge>
              )}
            </div>
          </div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No adventurers found yet. Be the first to start your journey!
          </div>
        )}
      </CardContent>
    </Card>
  );
};