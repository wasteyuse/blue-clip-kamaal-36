
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Define extended payout type that includes payment_method
interface PayoutWithMethod {
  id: string;
  user_id?: string;
  amount?: number;
  status?: string;
  requested_at: string;
  payment_method?: string;
}

export function PayoutRequestForm({ availableAmount, onSuccess }: PayoutRequestFormProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  const { data: payoutMethods } = useQuery({
    queryKey: ['payoutMethods', user?.id],
    queryFn: async () => {
      // Use a raw query to get payout records and cast as any to bypass type checking
      const { data, error } = await supabase.from('payouts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'template') as { data: any[] | null, error: any };

      if (error) throw error;
      
      // Transform the data to match our PayoutMethod interface
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
                  is_default: uniqueMethods.size === 0 // First one is default
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

  // Set default selected method when data is loaded
  useEffect(() => {
    if (payoutMethods && payoutMethods.length > 0) {
      const defaultMethod = payoutMethods.find(m => m.is_default) || payoutMethods[0];
      setSelectedMethodId(defaultMethod.id);
    }
  }, [payoutMethods]);

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

      {payoutMethods && payoutMethods.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="payment-method">Select Payment Method</Label>
          <Select 
            value={selectedMethodId} 
            onValueChange={setSelectedMethodId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {payoutMethods.map(method => (
                <SelectItem key={method.id} value={method.id}>
                  {method.method_type}: {method.details} {method.is_default ? "(Default)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="text-sm text-yellow-600">
          Please add a payment method before requesting a payout
        </p>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting || !payoutMethods?.length || !selectedMethodId}
      >
        {isSubmitting ? "Submitting..." : "Request Payout"}
      </Button>
    </form>
  );
}
