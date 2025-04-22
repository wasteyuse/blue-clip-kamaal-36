
import { usePayoutMethods } from "./payouts/usePayoutMethods";
import { AddPayoutMethodDialog } from "./payouts/AddPayoutMethodDialog";
import { PayoutMethodList } from "./payouts/PayoutMethodList";

export function PayoutMethods() {
  const { payoutMethods, addPayoutMethod, setDefaultMethod } = usePayoutMethods();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payout Methods</h2>
        <AddPayoutMethodDialog onSubmit={addPayoutMethod} />
      </div>

      <PayoutMethodList 
        payoutMethods={payoutMethods} 
        onSetDefault={setDefaultMethod}
      />
    </div>
  );
}
