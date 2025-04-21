
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Transaction } from "@/types/transactions";
import { formatTransactionForExport } from "@/utils/transactionUtils";

interface TransactionHeaderProps {
  transactions: Transaction[];
}

export function TransactionHeader({ transactions }: TransactionHeaderProps) {
  const handleExport = () => {
    const csvContent = transactions.map(formatTransactionForExport);
    const csvString = csvContent
      .map(row => Object.values(row).join(','))
      .join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">💸 Admin Transactions</h1>
      <Button onClick={handleExport} variant="outline">
        <FileDown className="mr-2" />
        Export CSV
      </Button>
    </div>
  );
}
