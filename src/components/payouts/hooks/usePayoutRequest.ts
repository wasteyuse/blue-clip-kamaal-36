
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAmount } from "../utils/payoutValidation";
import { useQuery } from "@tanstack/react-query";

interface PayoutMethod {
  id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

export const usePayoutRequest = (availableAmount: number, onSuccess: () => void) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  // Fetch payout methods
  const { data: payoutMethods } = useQuery({
    queryKey: ['payoutMethods', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('payouts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'template') as { data: any[] | null, error: any };

      if (error) throw error;
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    const error = validateAmount(numAmount, availableAmount);
    if (error) {
      toast.error(error);
      return;
    }

    if (!selectedMethodId) {
      toast.error("Please select a payment method");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedMethod = payoutMethods?.find(m => m.id === selectedMethodId);
      
      const { error } = await supabase
        .from("payouts")
        .insert([{ 
          user_id: user?.id,
          amount: numAmount,
          status: "pending",
          payment_method: selectedMethod ? `${selectedMethod.method_type}: ${selectedMethod.details}` : undefined
        }] as any);

      if (error) throw error;
      
      toast.success("Payout request submitted successfully");
      setAmount("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to submit payout request");
      console.error("Payout request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    amount,
    setAmount,
    isSubmitting,
    selectedMethodId,
    setSelectedMethodId,
    handleSubmit,
    payoutMethods
  };
};
