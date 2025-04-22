
import { Button } from "@/components/ui/button";
import { TransactionStatus } from "@/types/transactions";

interface TransactionActionsProps {
  status: TransactionStatus;
  onUpdateStatus: (status: TransactionStatus) => void;
}

export function TransactionActions({ status, onUpdateStatus }: TransactionActionsProps) {
  if (status === 'paid') return null;

  return (
    <div className="flex gap-2">
      {status === 'pending' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdateStatus('approved')}
        >
          Approve
        </Button>
      )}
      <Button 
        variant="secondary" 
        size="sm"
        onClick={() => onUpdateStatus('paid')}
      >
        Mark Paid
      </Button>
    </div>
  );
}
