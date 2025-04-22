
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface PayoutMethod {
  id: string;
  user_id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

export function usePayoutMethods() {
  const { user } = useAuth();

  const { data: payoutMethods, refetch } = useQuery({
    queryKey: ['payoutMethods', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('payouts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'template') as { data: any[] | null, error: any };

      if (error) {
        console.error("Error fetching payout methods:", error);
        throw error;
      }

      const methods: PayoutMethod[] = [];
      if (data && data.length > 0) {
        const uniqueMethods = new Map<string, PayoutMethod>();
        
        data.forEach(payout => {
          if (payout.payment_method) {
            const [type, details] = payout.payment_method.split(': ');
            if (type && details) {
              const methodKey = `${type}:${details}`;
              if (!uniqueMethods.has(methodKey)) {
                uniqueMethods.set(methodKey, {
                  id: payout.id,
                  user_id: payout.user_id || '',
                  method_type: type as 'UPI' | 'BANK',
                  details: details,
                  is_default: uniqueMethods.size === 0
                });
              }
            }
          }
        });
        
        return Array.from(uniqueMethods.values());
      }
      
      return methods;
    },
    enabled: !!user
  });

  const addPayoutMethod = async (methodType: 'UPI' | 'BANK', details: string) => {
    try {
      const { error } = await supabase
        .from("payouts")
        .insert([{ 
          user_id: user?.id,
          amount: 0,
          status: "template",
          payment_method: `${methodType}: ${details}`
        }] as any);

      if (error) throw error;
      
      toast.success('Payout method added successfully');
      refetch();
    } catch (error) {
      console.error('Error adding payout method:', error);
      toast.error('Failed to add payout method');
    }
  };

  const setDefaultMethod = async (methodId: string) => {
    try {
      const selectedMethod = payoutMethods?.find(m => m.id === methodId);
      
      if (selectedMethod) {
        const { error } = await supabase
          .from("payouts")
          .insert([{ 
            user_id: user?.id,
            amount: 0,
            status: "template",
            payment_method: `${selectedMethod.method_type}: ${selectedMethod.details}`
          }] as any);
          
        if (error) throw error;
      }
      
      toast.success('Default payout method updated');
      refetch();
    } catch (error) {
      console.error('Error updating default method:', error);
      toast.error('Failed to update default method');
    }
  };

  return {
    payoutMethods,
    addPayoutMethod,
    setDefaultMethod
  };
}
