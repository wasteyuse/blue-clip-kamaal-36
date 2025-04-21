
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
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  async function fetchPayoutRequests() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

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
        setPayouts(payoutsWithWallets);
      } else {
        setPayouts([]);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load payout requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPayoutRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { payouts, isLoading, fetchPayoutRequests };
}

