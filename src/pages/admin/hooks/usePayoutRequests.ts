
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PayoutRequest = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  requested_at: string;
  profiles: { 
    name: string; 
    email?: string;
    created_at?: string;
  } | null;
  wallets: { balance: number } | null;
  reject_reason?: string;
};

export function usePayoutRequests() {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  async function fetchPayoutRequests() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("payouts")
        .select(`
          id,
          user_id,
          amount,
          status,
          requested_at,
          reject_reason,
          profiles:profiles(name, email, created_at)
        `)
        .order("requested_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const payoutsWithWallets = await Promise.all(
          data.map(async (payout: any) => {
            const { data: walletData, error: walletError } = await supabase
              .from("wallets")
              .select("balance")
              .eq("user_id", payout.user_id)
              .maybeSingle();

            let wallets: { balance: number } | null = null;
            if (!walletError) {
              if (walletData && typeof walletData.balance === "number") {
                wallets = { balance: Number(walletData.balance) };
              } else {
                wallets = { balance: 0 };
              }
            }
            return { ...payout, wallets };
          })
        );
        setPayoutRequests(payoutsWithWallets);
      } else {
        setPayoutRequests([]);
      }
    } catch (e) {
      const error = e as Error;
      setError(error);
      toast({
        title: "Error",
        description: "Failed to load payout requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function approveOrReject(payout: PayoutRequest, newStatus: "approved" | "rejected", reason?: string) {
    try {
      const updateData: any = { status: newStatus };
      
      // Add rejection reason if provided
      if (newStatus === 'rejected' && reason) {
        updateData.reject_reason = reason;
      }
      
      const { error: updateError } = await supabase
        .from("payouts")
        .update(updateData)
        .eq("id", payout.id);

      if (updateError) throw updateError;

      // If approved and we have wallet data, deduct from wallet balance
      if (newStatus === 'approved' && payout.wallets) {
        // Create a completed transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: payout.user_id,
            amount: payout.amount,
            type: 'payout',
            status: 'completed',
            source: `Payout ID: ${payout.id}`
          });
          
        if (transactionError) {
          console.error('Error creating transaction record:', transactionError);
        }
      }
      
      // Refresh the list after updating
      await fetchPayoutRequests();
      
      return true;
    } catch (e) {
      const error = e as Error;
      toast({
        title: "Error",
        description: `Failed to ${newStatus} payout: ${error.message}`,
        variant: "destructive",
      });
      throw e;
    }
  }

  useEffect(() => {
    fetchPayoutRequests();
    
    // Set up real-time listener for payout changes
    const payoutsChannel = supabase
      .channel('payout-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payouts'
        },
        (payload) => {
          console.log('Payout change received:', payload);
          fetchPayoutRequests();
          
          // Show toast notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            toast({
              title: `Payout ${payload.new.status}`,
              description: `Payout request of ₹${payload.new.amount} has been ${payload.new.status}`,
              variant: payload.new.status === 'rejected' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(payoutsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { payoutRequests, isLoading, error, approveOrReject, fetchPayoutRequests };
}
