
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Payout {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
  payment_method?: string;
}

interface PayoutHistoryProps {
  payouts: Payout[];
}

export function PayoutHistory({ payouts }: PayoutHistoryProps) {
  if (payouts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payout history available
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>₹{payout.amount.toFixed(2)}</TableCell>
            <TableCell>{payout.payment_method || "Not specified"}</TableCell>
            <TableCell>{getStatusBadge(payout.status)}</TableCell>
            <TableCell>
              {new Date(payout.requested_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
