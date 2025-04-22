
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, ListFilter, TrendingUp } from "lucide-react";
import { TransactionsList } from "./TransactionsList";
import { EarningsSummary } from "./EarningsSummary";
import { EarningsChart } from "./EarningsChart";
import { PayoutHistory } from "@/components/PayoutHistory";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactions } from "@/hooks/useTransactions";
import { usePayouts } from "@/hooks/usePayouts";

export function EarningsContent() {
  const { stats, isLoading: statsLoading } = useDashboardData();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { payouts, isLoading: payoutsLoading } = usePayouts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h1 className="text-2xl font-bold">My Earnings</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/payouts">
              <DollarSign className="mr-2 h-4 w-4" />
              Request Payout
            </Link>
          </Button>
        </div>
      </div>

      <EarningsSummary stats={stats} />

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <EarningsChart />
            <TransactionsList 
              transactions={transactions.slice(0, 5)} 
              isLoading={transactionsLoading} 
            />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          {transactionsLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <TransactionsList 
                transactions={transactions} 
                isLoading={transactionsLoading} 
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payout History</h3>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/payouts">Manage Payouts</Link>
              </Button>
            </div>
            {payoutsLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <PayoutHistory payouts={payouts} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
