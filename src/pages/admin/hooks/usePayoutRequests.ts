
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PayoutRequest = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  requested_at: string;
  profiles: { name: string; email?: string } | null;
  wallets: { balance: number } | null;
};

export function usePayoutRequests(status: string = "pending") {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  async function fetchPayoutRequests() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("payout_requests")
        .select(`
          id,
          user_id,
          amount,
          status,
          requested_at,
          profiles:profiles(name)
        `)
        .eq("status", status)
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

  async function approveOrReject(payout: PayoutRequest, newStatus: "approved" | "rejected") {
    try {
      const { error: updateError } = await supabase
        .from("payout_requests")
        .update({ status: newStatus })
        .eq("id", payout.id);

      if (updateError) throw updateError;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { payoutRequests, isLoading, error, approveOrReject, fetchPayoutRequests };
}
