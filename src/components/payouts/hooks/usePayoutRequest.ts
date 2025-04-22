
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateAmount } from "../utils/payoutValidation";

export const usePayoutRequest = (availableAmount: number, onSuccess: () => void) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

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
    handleSubmit
  };
};
