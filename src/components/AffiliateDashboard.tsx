
import React, { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AffiliateSummaryCards } from "./affiliate/AffiliateSummaryCards";
import { AffiliateList } from "./affiliate/AffiliateList";
import { EmptyAffiliateState } from "./affiliate/EmptyAffiliateState";

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

  return (
    <div className="space-y-6">
      {!affiliateData || affiliateData.length === 0 ? (
        <EmptyAffiliateState />
      ) : (
        <>
          <AffiliateSummaryCards
            totalClicks={getTotalClicks()}
            totalConversions={getTotalConversions()}
            totalEarnings={getTotalEarnings()}
          />
          <AffiliateList affiliateData={affiliateData} />
        </>
      )}
    </div>
  );
}
