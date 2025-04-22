
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePayoutRequest } from "./payouts/hooks/usePayoutRequest";
import { PayoutMethodSelect } from "./payouts/PayoutMethodSelect";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { validateAmount } from "./payouts/utils/payoutValidation";

interface PayoutRequestFormProps {
  availableAmount: number;
  onSuccess: () => void;
}

export function PayoutRequestForm({ availableAmount, onSuccess }: PayoutRequestFormProps) {
  const { user } = useAuth();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  
  const {
    isSubmitting,
    selectedMethodId,
    setSelectedMethodId,
    handleSubmit,
    payoutMethods
  } = usePayoutRequest(availableAmount, onSuccess);

  // Validate amount whenever it changes
  useEffect(() => {
    if (amount.trim() === "") {
      setValidationError(null);
      return;
    }
    
    const numericAmount = parseFloat(amount);
    const error = validateAmount(numericAmount, availableAmount);
    setValidationError(error);
  }, [amount, availableAmount]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation before submission
    if (validationError) return;
    handleSubmit(e, amount);
  };

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
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
          className={validationError ? "border-red-500" : ""}
        />
        {validationError ? (
          <p className="text-sm text-red-500 mt-1">{validationError}</p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Min: ₹10, Max: ₹500 (Available: ₹{availableAmount.toFixed(2)})
          </p>
        )}
      </div>

      {amount && parseFloat(amount) >= 10 && (
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 text-sm">
            Your payout will be processed within 3-5 business days after approval.
          </AlertDescription>
        </Alert>
      )}

      <PayoutMethodSelect
        payoutMethods={payoutMethods}
        selectedMethodId={selectedMethodId}
        onMethodSelect={setSelectedMethodId}
      />

      <Button 
        type="submit" 
        disabled={isSubmitting || !payoutMethods?.length || !selectedMethodId || !!validationError || !amount}
      >
        {isSubmitting ? "Submitting..." : "Request Payout"}
      </Button>
    </form>
  );
}
