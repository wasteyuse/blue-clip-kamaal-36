
import { Badge } from "@/components/ui/badge";
import { Transaction, TransactionStatus } from "@/types/transactions";
import { format } from "date-fns";
import { isSuspiciousTransaction } from "@/utils/transactionUtils";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionActions } from "./TransactionActions";

interface TransactionRowProps {
  transaction: Transaction;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
}

export function TransactionRow({ transaction, onUpdateStatus }: TransactionRowProps) {
  return (
    <tr className={isSuspiciousTransaction(transaction) ? 'bg-red-50 hover:bg-red-100' : ''}>
      <td className="p-4">{transaction.user_id}</td>
      <td className="p-4">
        {transaction.profiles?.name || 'Unknown'}
        {isSuspiciousTransaction(transaction) && (
          <Badge variant="destructive" className="ml-2">
            🚨 Suspicious
          </Badge>
        )}
      </td>
      <td className="p-4 capitalize">{transaction.type}</td>
      <td className="p-4">₹{transaction.amount.toFixed(2)}</td>
      <td className="p-4">{transaction.source || '-'}</td>
      <td className="p-4">
        <TransactionStatusBadge status={transaction.status} />
      </td>
      <td className="p-4">
        {format(new Date(transaction.created_at), 'PPP')}
      </td>
      <td className="p-4">
        <TransactionActions 
          status={transaction.status}
          onUpdateStatus={(newStatus) => onUpdateStatus(transaction.id, newStatus)}
        />
      </td>
    </tr>
  );
}
