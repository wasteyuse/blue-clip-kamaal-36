
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, BarChart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface AffiliateSubmission {
  id: string;
  content_url: string | null;
  affiliate_link: string | null;
  affiliate_clicks: number | null;
  affiliate_conversions: number | null;
  earnings: number | null;
  asset_used: string | null;
  created_at: string;
}

interface AffiliateListProps {
  affiliateData: AffiliateSubmission[];
}

export function AffiliateList({ affiliateData }: AffiliateListProps) {
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {affiliateData.map((item) => (
        <Card key={item.id} className="overflow-hidden border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              <span>Asset: {item.asset_used || 'Unknown'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Clicks</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <p className="text-xl font-semibold">{item.affiliate_clicks || 0}</p>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Conversions</p>
                <p className="text-xl font-semibold">{item.affiliate_conversions || 0}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Earnings</p>
                <p className="text-xl font-semibold">₹{(item.earnings || 0).toFixed(2)}</p>
              </div>
            </div>
            {item.affiliate_link && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Your Affiliate Link:</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {item.affiliate_link}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => item.affiliate_link && copyToClipboard(item.affiliate_link)}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {item.content_url && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Your Content:</p>
                <a 
                  href={item.content_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline text-sm block mt-1 break-all"
                >
                  {item.content_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
