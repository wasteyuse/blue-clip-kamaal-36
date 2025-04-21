
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Transaction, TransactionStatus } from "@/types/transactions";
import { isSuspiciousTransaction } from "@/utils/transactionUtils";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
}

export function TransactionTable({ transactions, loading, onUpdateStatus }: TransactionTableProps) {
  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch(status) {
      case 'pending': return 'outline';
      case 'approved': return 'secondary';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">No transactions found</TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow 
                key={transaction.id}
                className={isSuspiciousTransaction(transaction) ? 'bg-red-50 hover:bg-red-100' : ''}
              >
                <TableCell>{transaction.user_id}</TableCell>
                <TableCell>
                  {transaction.profiles?.name || 'Unknown'}
                  {isSuspiciousTransaction(transaction) && (
                    <Badge variant="destructive" className="ml-2">
                      🚨 Suspicious
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.source || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.created_at), 'PPP')}
                </TableCell>
                <TableCell>
                  {transaction.status !== 'paid' && (
                    <div className="flex gap-2">
                      {transaction.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onUpdateStatus(transaction.id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => onUpdateStatus(transaction.id, 'paid')}
                      >
                        Mark Paid
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
