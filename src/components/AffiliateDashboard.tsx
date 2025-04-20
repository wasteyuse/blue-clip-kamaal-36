
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface AffiliateSubmission {
  id: string;
  content_url: string | null;
  affiliate_link: string | null;
  affiliate_clicks: number | null;
  affiliate_conversions: number | null;
  earnings: number | null;
  asset_used: string | null;
}

export function AffiliateDashboard() {
  const { user } = useAuth();

  const { data: affiliateData, isLoading } = useQuery({
    queryKey: ['affiliateSubmissions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, content_url, affiliate_link, affiliate_clicks, affiliate_conversions, earnings, asset_used')
        .eq('user_id', user?.id)
        .eq('type', 'product')
        .eq('status', 'approved');

      if (error) throw error;
      return data as AffiliateSubmission[];
    },
    enabled: !!user
  });

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied to clipboard');
  };

  if (isLoading) return <div>Loading affiliate data...</div>;

  return (
    <div className="space-y-6">
      {affiliateData && affiliateData.length === 0 ? (
        <p className="text-muted-foreground">You have no active affiliate promotions yet.</p>
      ) : (
        affiliateData?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>Asset: {item.asset_used || 'Unknown'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-xl font-semibold">{item.affiliate_clicks || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-xl font-semibold">{item.affiliate_conversions || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Earnings</p>
                  <p className="text-xl font-semibold">₹{(item.earnings || 0).toFixed(2)}</p>
                </div>
              </div>
              {item.affiliate_link && (
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex-grow bg-muted p-2 rounded text-sm truncate">
                    {item.affiliate_link}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={() => item.affiliate_link && copyToClipboard(item.affiliate_link)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {item.content_url && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Content Link</p>
                  <a 
                    href={item.content_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    {item.content_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
