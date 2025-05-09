
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoutHistory } from "@/components/PayoutHistory";
import { PayoutRequestForm } from "@/components/PayoutRequestForm";
import { PayoutMethods } from "@/components/PayoutMethods";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePayouts } from "@/hooks/usePayouts";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayoutsPage() {
  const { user } = useAuth();
  const { payouts, isLoading: isPayoutsLoading } = usePayouts();

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('total_earnings, total_views')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isProfileLoading || isPayoutsLoading) {
    return <PayoutsLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payouts</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Views: {profileData?.total_views || 0}</p>
            <p>Total Earnings: ₹{profileData?.total_earnings?.toFixed(2) || '0.00'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Request Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <PayoutRequestForm 
              availableAmount={profileData?.total_earnings || 0} 
              onSuccess={() => {}} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payout Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <PayoutMethods />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <PayoutHistory payouts={payouts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PayoutsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-40 mb-6" />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  );
}
