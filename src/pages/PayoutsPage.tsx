
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoutHistory } from "@/components/PayoutHistory";
import { PayoutRequestForm } from "@/components/PayoutRequestForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function PayoutsPage() {
  const { user } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_earnings, total_views')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) return <div>Loading...</div>;

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
        <PayoutRequestForm 
          availableAmount={profileData?.total_earnings || 0} 
          onSuccess={() => {}} 
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Payout History</h2>
        <PayoutHistory payouts={[]} />
      </div>
    </div>
  );
}
