
import { PayoutMethodCard } from "./PayoutMethodCard";

interface PayoutMethod {
  id: string;
  user_id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

interface PayoutMethodListProps {
  payoutMethods: PayoutMethod[];
  onSetDefault: (methodId: string) => void;
}

export function PayoutMethodList({ payoutMethods, onSetDefault }: PayoutMethodListProps) {
  if (!payoutMethods || payoutMethods.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payout methods added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payoutMethods.map((method) => (
        <PayoutMethodCard
          key={method.id}
          id={method.id}
          methodType={method.method_type}
          details={method.details}
          isDefault={method.is_default}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
