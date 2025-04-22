
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/types/transactions";
import { format } from "date-fns";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No transactions found
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionBadge = (type: TransactionType, status: string) => {
    // Type badge
    const typeBadge = () => {
      switch (type) {
        case "earning":
          return <Badge className="bg-green-500">Earning</Badge>;
        case "affiliate":
          return <Badge className="bg-blue-500">Affiliate</Badge>;
        case "payout":
          return <Badge className="bg-purple-500">Payout</Badge>;
        default:
          return <Badge>Unknown</Badge>;
      }
    };

    // Status badge
    const statusBadge = () => {
      switch (status) {
        case "pending":
          return <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700">Pending</Badge>;
        case "approved":
          return <Badge variant="outline" className="ml-2 border-green-500 text-green-700">Approved</Badge>;
        case "paid":
          return <Badge variant="outline" className="ml-2 border-blue-500 text-blue-700">Paid</Badge>;
        case "failed":
          return <Badge variant="outline" className="ml-2 border-red-500 text-red-700">Failed</Badge>;
        default:
          return null;
      }
    };

    return (
      <div className="flex items-center">
        {typeBadge()}
        {statusBadge()}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getTransactionBadge(transaction.type, transaction.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {transaction.source || "Content earnings"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.created_at), "PPp")}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "payout" ? "text-red-600" : "text-green-600"}`}>
                  {transaction.type === "payout" ? "-" : "+"}₹{transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
