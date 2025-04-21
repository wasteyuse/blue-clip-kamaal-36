
import { Transaction } from "@/types/transactions";

export function isSuspiciousTransaction(transaction: Transaction): boolean {
  return (
    Number(transaction.amount) > 300 || 
    (transaction.type === 'payout' && transaction.status === 'pending' && Number(transaction.amount) > 200)
  );
}

export function formatTransactionForExport(transaction: Transaction) {
  return {
    User: transaction.profiles?.name || 'Unknown',
    Type: transaction.type,
    Amount: `₹${transaction.amount}`,
    Source: transaction.source || '-',
    Status: transaction.status,
    CreatedAt: new Date(transaction.created_at).toLocaleString(),
  };
}
