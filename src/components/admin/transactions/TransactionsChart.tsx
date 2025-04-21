
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Transaction } from "@/types/transactions";

interface TransactionsChartProps {
  transactions: Transaction[];
}

export function TransactionsChart({ transactions }: TransactionsChartProps) {
  const chartData = transactions.reduce((acc, tx) => {
    const date = new Date(tx.created_at).toLocaleDateString();
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.total += Number(tx.amount);
    } else {
      acc.push({ date, total: Number(tx.amount) });
    }
    return acc;
  }, [] as Array<{ date: string; total: number }>);

  const config = {
    total: {
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>💸 Daily Transaction Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" name="Total Amount (₹)" dataKey="total" stroke="hsl(var(--primary))" />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
