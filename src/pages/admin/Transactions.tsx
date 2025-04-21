
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Transaction, TransactionType, TransactionStatus } from "@/types/transactions";
import { TransactionHeader } from "@/components/admin/transactions/TransactionHeader";
import { TransactionFilters } from "@/components/admin/transactions/TransactionFilters";
import { TransactionTable } from "@/components/admin/transactions/TransactionTable";
import { TransactionsChart } from "@/components/admin/transactions/TransactionsChart";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [searchUser, setSearchUser] = useState('');
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (filterType !== 'all') query = query.eq('type', filterType);
    if (searchUser) query = query.ilike('profiles.name', `%${searchUser}%`);

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive"
      });
      console.error(error);
    } else {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, searchUser]);

  const updateStatus = async (id: string, newStatus: TransactionStatus) => {
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Transaction status updated",
      });
      fetchTransactions();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionHeader transactions={transactions} />
      <TransactionsChart transactions={transactions} />
      <TransactionFilters
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <TransactionTable
        transactions={transactions}
        loading={loading}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
