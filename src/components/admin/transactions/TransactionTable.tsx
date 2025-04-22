
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/types/transactions";
import { TransactionRow } from "./TransactionRow";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
}

export function TransactionTable({ transactions, loading, onUpdateStatus }: TransactionTableProps) {
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
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
