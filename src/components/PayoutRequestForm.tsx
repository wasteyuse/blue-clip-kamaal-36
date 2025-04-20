
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PayoutRequestFormProps {
  availableAmount: number;
  onSuccess: () => void;
}

export function PayoutRequestForm({ availableAmount, onSuccess }: PayoutRequestFormProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (numAmount < 10 || numAmount > 500) {
      toast.error("Amount must be between ₹10 and ₹500");
      return;
    }

    if (numAmount > availableAmount) {
      toast.error("Amount cannot exceed your available earnings");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("payouts")
        .insert([{ amount: numAmount }]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (min ₹10)"
          min={10}
          max={Math.min(500, availableAmount)}
          step="0.01"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Min: ₹10, Max: ₹500 (Available: ₹{availableAmount.toFixed(2)})
        </p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Payout"}
      </Button>
    </form>
  );
}
