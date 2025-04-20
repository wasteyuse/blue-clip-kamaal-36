
import React from 'react';
import { AffiliateDashboard } from "@/components/AffiliateDashboard";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Link } from "lucide-react"; 

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link className="h-6 w-6 text-blue-500" />
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <CardDescription className="text-base">
            View all your affiliate promotions, track performance metrics, and copy your unique affiliate links to share with your audience.
          </CardDescription>
        </CardContent>
      </Card>
      
      <AffiliateDashboard />
    </div>
  );
}
