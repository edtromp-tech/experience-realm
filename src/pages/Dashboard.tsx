import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <div className="animate-pulse text-gold text-xl mb-4">Loading...</div>
          <div className="text-muted-foreground">Gathering community data...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Character
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <DashboardComponent />
        
        {/* Bottom padding for navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Dashboard;