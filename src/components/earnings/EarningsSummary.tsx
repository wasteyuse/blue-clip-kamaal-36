
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, EyeIcon } from "lucide-react";

interface EarningsSummaryProps {
  stats: {
    totalViews: number;
    totalEarnings: number;
    pendingEarnings: number;
    totalPaidOut: number;
    progress: {
      currentPayout: number;
      minPayout: number;
      maxPayout: number;
    };
  };
}

export function EarningsSummary({ stats }: EarningsSummaryProps) {
  // Calculate progress percentage for the payout threshold
  const progressPercentage = Math.min(
    100,
    ((stats.progress.currentPayout - stats.progress.minPayout) /
      (stats.progress.maxPayout - stats.progress.minPayout)) *
      100
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.totalEarnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime earnings from all sources
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.pendingEarnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Available for payout
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <EyeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Total views across all content
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payout Threshold</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            Min: ₹{stats.progress.minPayout} | Max: ₹{stats.progress.maxPayout}
          </span>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Current balance: ₹{stats.progress.currentPayout.toFixed(2)}</span>
            <span>
              {stats.progress.currentPayout >= stats.progress.minPayout
                ? "Eligible for payout"
                : `₹${(stats.progress.minPayout - stats.progress.currentPayout).toFixed(2)} more to reach minimum payout`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
