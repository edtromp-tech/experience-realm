import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RaceDistribution {
  race: string;
  count: number;
  percentage: number;
}

interface ClassDistribution {
  class: string;
  count: number;
  percentage: number;
}

interface TopRace {
  race: string;
  count: number;
  totalXP: number;
  avgLevel: number;
  percentage: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--gold))', 'hsl(var(--mystical))'];

export const RaceClassDistribution = () => {
  const [raceDistribution, setRaceDistribution] = useState<RaceDistribution[]>([]);
  const [classDistribution, setClassDistribution] = useState<ClassDistribution[]>([]);
  const [topRace, setTopRace] = useState<TopRace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      // Fetch race distribution
      const { data: raceData, error: raceError } = await supabase
        .from('characters')
        .select('race_name, total_xp, level');

      if (raceError) {
        console.error('Error fetching race data:', raceError);
        return;
      }

      // Process race distribution
      const raceMap = new Map<string, { count: number; totalXP: number; totalLevel: number }>();
      
      raceData?.forEach(char => {
        const race = char.race_name || 'Human';
        const existing = raceMap.get(race) || { count: 0, totalXP: 0, totalLevel: 0 };
        raceMap.set(race, {
          count: existing.count + 1,
          totalXP: existing.totalXP + char.total_xp,
          totalLevel: existing.totalLevel + char.level
        });
      });

      const totalCharacters = raceData?.length || 0;
      const raceStats = Array.from(raceMap.entries()).map(([race, stats]) => ({
        race,
        count: stats.count,
        percentage: totalCharacters > 0 ? Math.round((stats.count / totalCharacters) * 100) : 0,
        totalXP: stats.totalXP,
        avgLevel: stats.count > 0 ? Math.round(stats.totalLevel / stats.count) : 0
      }));

      setRaceDistribution(raceStats.sort((a, b) => b.count - a.count));

      // Find top race
      if (raceStats.length > 0) {
        const top = raceStats.reduce((prev, current) => 
          prev.count > current.count ? prev : current
        );
        setTopRace({
          race: top.race,
          count: top.count,
          totalXP: top.totalXP,
          avgLevel: top.avgLevel,
          percentage: top.percentage
        });
      }

      // Fetch class distribution
      const { data: classData, error: classError } = await supabase
        .from('characters')
        .select('current_class_name')
        .not('current_class_name', 'is', null);

      if (classError) {
        console.error('Error fetching class data:', classError);
        return;
      }

      // Process class distribution
      const classMap = new Map<string, number>();
      
      classData?.forEach(char => {
        if (char.current_class_name) {
          const existing = classMap.get(char.current_class_name) || 0;
          classMap.set(char.current_class_name, existing + 1);
        }
      });

      const totalClasses = classData?.length || 0;
      const classStats = Array.from(classMap.entries()).map(([className, count]) => ({
        class: className,
        count,
        percentage: totalClasses > 0 ? Math.round((count / totalClasses) * 100) : 0
      }));

      setClassDistribution(classStats.sort((a, b) => b.count - a.count));

    } catch (error) {
      console.error('Error fetching distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">Loading statistics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Race Card */}
      {topRace && (
        <Card className="border-gold shadow-glow-gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <Zap className="h-5 w-5" />
              Most Popular Race
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{topRace.race}</div>
                <div className="text-muted-foreground">
                  {topRace.count} adventurers ({topRace.percentage}%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Avg Level</div>
                <div className="text-lg font-semibold">{topRace.avgLevel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Race Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Race Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {raceDistribution.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={raceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ race, percentage }) => `${race} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {raceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {raceDistribution.map((race, index) => (
                    <div key={race.race} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{race.race}</span>
                      </div>
                      <Badge variant="outline">
                        {race.count} ({race.percentage}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No race data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classDistribution.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={classDistribution.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="class" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-2">
                  {classDistribution.map((classItem) => (
                    <div key={classItem.class} className="flex items-center justify-between">
                      <span className="text-sm">{classItem.class}</span>
                      <Badge variant="secondary">
                        {classItem.count} ({classItem.percentage}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No class data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};