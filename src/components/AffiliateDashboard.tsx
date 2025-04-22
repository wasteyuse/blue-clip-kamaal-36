
import React, { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link, BarChart, TrendingUp, DollarSign } from "lucide-react";
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

export function AffiliateDashboard() {
  const { user } = useAuth();

  const { data: affiliateData, isLoading, error, refetch } = useQuery({
    queryKey: ['affiliateSubmissions', user?.id],
    queryFn: async () => {
      console.log("Fetching affiliate data for user:", user?.id);
      const { data, error } = await supabase
        .from('submissions')
        .select('id, content_url, affiliate_link, affiliate_clicks, affiliate_conversions, earnings, asset_used, created_at')
        .eq('user_id', user?.id)
        .eq('type', 'product')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching affiliate data:", error);
        throw error;
      }
      console.log("Affiliate data received:", data);
      return data as AffiliateSubmission[];
    },
    enabled: !!user
  });

  // Set up real-time listener for affiliate updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('affiliate-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${user.id} AND type=eq.product`
        },
        (payload) => {
          console.log('Affiliate data updated:', payload);
          refetch();
          
          if (payload.eventType === 'UPDATE') {
            const newData = payload.new as any;
            if (newData.affiliate_conversions > (payload.old as any).affiliate_conversions) {
              toast.success('New affiliate conversion! 🎉');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied to clipboard');
  };

  const getTotalEarnings = () => {
    if (!affiliateData) return 0;
    return affiliateData.reduce((sum, item) => sum + (item.earnings || 0), 0);
  };

  const getTotalClicks = () => {
    if (!affiliateData) return 0;
    return affiliateData.reduce((sum, item) => sum + (item.affiliate_clicks || 0), 0);
  };

  const getTotalConversions = () => {
    if (!affiliateData) return 0;
    return affiliateData.reduce((sum, item) => sum + (item.affiliate_conversions || 0), 0);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin mr-2">
        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <span>Loading affiliate data...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
      <p className="font-semibold">Error loading affiliate data</p>
      <p className="text-sm mt-1">{error.message}</p>
      <p className="text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
    </div>
  );

  if (!user) return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
      <p className="font-semibold">Please log in</p>
      <p className="text-sm mt-1">You need to be logged in to view your affiliate dashboard.</p>
    </div>
  );

  // Summary cards for total stats
  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <TrendingUp className="h-5 w-5" />
            <span>Total Clicks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-800">{getTotalClicks()}</p>
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
          <p className="text-3xl font-bold text-green-800">{getTotalConversions()}</p>
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
          <p className="text-3xl font-bold text-purple-800">₹{getTotalEarnings().toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {!affiliateData || affiliateData.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 text-center">
          <div className="inline-flex mx-auto mb-4 p-3 rounded-full bg-blue-100">
            <Link className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-blue-800 mb-2">No Active Affiliate Promotions</h3>
          <p className="text-blue-700 mb-4">You don't have any approved affiliate promotions yet.</p>
          <Button variant="outline" className="bg-white" onClick={() => window.location.href = '/dashboard/submit'}>
            Create Content to Earn
          </Button>
        </div>
      ) : (
        <>
          <SummaryCards />
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
        </>
      )}
    </div>
  );
}
