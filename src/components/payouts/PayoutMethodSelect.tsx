
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PayoutMethod {
  id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

interface PayoutMethodSelectProps {
  payoutMethods: PayoutMethod[] | undefined;
  selectedMethodId: string;
  onMethodSelect: (value: string) => void;
}

export function PayoutMethodSelect({ payoutMethods, selectedMethodId, onMethodSelect }: PayoutMethodSelectProps) {
  if (!payoutMethods?.length) {
    return (
      <p className="text-sm text-yellow-600">
        Please add a payment method before requesting a payout
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="payment-method">Select Payment Method</Label>
      <Select 
        value={selectedMethodId} 
        onValueChange={onMethodSelect}
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
  );
}
