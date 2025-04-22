
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePayoutRequest } from "./payouts/hooks/usePayoutRequest";
import { PayoutMethodSelect } from "./payouts/PayoutMethodSelect";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PayoutRequestFormProps {
  availableAmount: number;
  onSuccess: () => void;
}

interface PayoutMethod {
  id: string;
  user_id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

export function PayoutRequestForm({ availableAmount, onSuccess }: PayoutRequestFormProps) {
  const { user } = useAuth();
  const {
    amount,
    setAmount,
    isSubmitting,
    selectedMethodId,
    setSelectedMethodId,
    handleSubmit
  } = usePayoutRequest(availableAmount, onSuccess);

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
