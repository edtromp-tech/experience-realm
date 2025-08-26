import { Leaderboard } from './Leaderboard';
import { RaceClassDistribution } from './RaceClassDistribution';

export const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gold">Community Dashboard</h1>
        <p className="text-muted-foreground">
          Discover how adventurers across the realm are progressing on their journeys
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <Leaderboard />
        </div>
        <div className="xl:col-span-2">
          <RaceClassDistribution />
        </div>
      </div>
    </div>
  );
};