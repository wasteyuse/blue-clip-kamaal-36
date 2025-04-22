
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoutHistory } from "@/components/PayoutHistory";
import { PayoutRequestForm } from "@/components/PayoutRequestForm";
import { PayoutMethods } from "@/components/PayoutMethods";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PayoutsPage() {
  const { user } = useAuth();
  const [payoutsData, setPayoutsData] = useState<any[]>([]);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
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

  useEffect(() => {
    if (!user) return;

    const fetchPayouts = async () => {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) {
        toast.error('Failed to load payout history');
        return;
      }
      setPayoutsData(data || []);
    };

    fetchPayouts();

    // Real-time subscription
    const payoutsChannel = supabase
      .channel('payouts')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payouts', 
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setPayoutsData(prev => [payload.new as any, ...prev]);
              break;
            case 'UPDATE':
              setPayoutsData(prev => 
                prev.map(payout => 
                  payout.id === payload.new.id ? payload.new : payout
                )
              );
              break;
            case 'DELETE':
              setPayoutsData(prev => 
                prev.filter(payout => payout.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(payoutsChannel);
    };
  }, [user]);

  if (isProfileLoading) return <div>Loading...</div>;

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
            <PayoutHistory payouts={payoutsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
