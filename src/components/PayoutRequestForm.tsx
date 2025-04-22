
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePayoutRequest } from "./payouts/hooks/usePayoutRequest";
import { PayoutMethodSelect } from "./payouts/PayoutMethodSelect";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PayoutRequestFormProps {
  availableAmount: number;
  onSuccess: () => void;
}

export function PayoutRequestForm({ availableAmount, onSuccess }: PayoutRequestFormProps) {
  const { user } = useAuth();
  const {
    amount,
    setAmount,
    isSubmitting,
    selectedMethodId,
    setSelectedMethodId,
    handleSubmit,
    payoutMethods
  } = usePayoutRequest(availableAmount, onSuccess);

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

      <PayoutMethodSelect
        payoutMethods={payoutMethods}
        selectedMethodId={selectedMethodId}
        onMethodSelect={setSelectedMethodId}
      />

      <Button 
        type="submit" 
        disabled={isSubmitting || !payoutMethods?.length || !selectedMethodId}
      >
        {isSubmitting ? "Submitting..." : "Request Payout"}
      </Button>
    </form>
  );
}
