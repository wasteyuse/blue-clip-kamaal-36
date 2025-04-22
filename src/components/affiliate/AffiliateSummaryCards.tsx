
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart, DollarSign } from "lucide-react";

interface AffiliateSummaryCardsProps {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
}

export function AffiliateSummaryCards({ totalClicks, totalConversions, totalEarnings }: AffiliateSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <TrendingUp className="h-5 w-5" />
            <span>Total Clicks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-800">{totalClicks}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <BarChart className="h-5 w-5" />
            <span>Total Conversions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-800">{totalConversions}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <DollarSign className="h-5 w-5" />
            <span>Total Earnings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-800">₹{totalEarnings.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
