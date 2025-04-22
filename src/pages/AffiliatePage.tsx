
import React from 'react';
import { AffiliateDashboard } from "@/components/AffiliateDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react"; 

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link className="h-6 w-6 text-blue-500" />
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Affiliate Program Overview</CardTitle>
          <CardDescription>
            Share unique affiliate links and earn commission on every successful conversion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">1</div>
              </div>
              <div>
                <h3 className="font-medium">Create Content</h3>
                <p className="text-sm text-gray-600">Submit content using our product assets to receive your unique affiliate link.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</div>
              </div>
              <div>
                <h3 className="font-medium">Share Your Link</h3>
                <p className="text-sm text-gray-600">Share your affiliate link with your audience through your content.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">3</div>
              </div>
              <div>
                <h3 className="font-medium">Earn Commission</h3>
                <p className="text-sm text-gray-600">Earn a commission for every successful conversion through your affiliate link.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AffiliateDashboard />
    </div>
  );
}
