
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";

export function EarningsChart() {
  const { stats, isLoading } = useDashboardData();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] bg-gray-100 animate-pulse rounded-md" />
      </Card>
    );
  }

  // Prepare data for the chart
  const data = [
    {
      name: "View Earnings",
      value: stats.viewEarnings,
      fill: "#10b981", // Green
    },
    {
      name: "Affiliate",
      value: stats.affiliateEarnings,
      fill: "#3b82f6", // Blue
    },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Earnings Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value}`, "Amount"]}
                labelFormatter={() => ""}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
