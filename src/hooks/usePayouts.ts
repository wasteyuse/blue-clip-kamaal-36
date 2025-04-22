
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Payout {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
  payment_method?: string;
  user_id: string;
}

export function usePayouts() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPayouts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('payouts')
          .select('*')
          .eq('user_id', user.id)
          .order('requested_at', { ascending: false });

        if (error) throw error;
        setPayouts(data || []);
      } catch (error) {
        console.error('Error fetching payouts:', error);
        toast.error('Failed to load payout history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayouts();

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
          console.log('Payouts channel update:', payload);
          switch (payload.eventType) {
            case 'INSERT':
              setPayouts(prev => [payload.new as Payout, ...prev]);
              break;
            case 'UPDATE':
              setPayouts(prev =>
                prev.map(payout =>
                  payout.id === payload.new.id ? payload.new as Payout : payout
                )
              );
              break;
            case 'DELETE':
              setPayouts(prev =>
                prev.filter(payout => payout.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(payoutsChannel);
    };
  }, [user]);

  return { payouts, isLoading };
}
