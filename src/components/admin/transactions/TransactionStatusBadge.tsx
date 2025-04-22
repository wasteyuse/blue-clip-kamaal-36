
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types/transactions";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch(status) {
      case 'pending': return 'outline';
      case 'approved': return 'secondary';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status}
    </Badge>
  );
}
