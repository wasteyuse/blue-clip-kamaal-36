
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type TransactionType = 'earning' | 'affiliate' | 'payout';
type TransactionStatus = 'pending' | 'approved' | 'paid' | 'failed';

interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  source?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    name?: string;
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType | ''>('');
  const [searchUser, setSearchUser] = useState('');
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (filterType) query = query.eq('type', filterType);
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

  const getStatusBadgeVariant = (status: TransactionStatus) => {
    switch(status) {
      case 'pending': return 'outline';
      case 'approved': return 'secondary';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">💸 Admin Transactions</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by name"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="max-w-md"
        />
        <Select value={filterType} onValueChange={(val: TransactionType | '') => setFilterType(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="earning">Earnings</SelectItem>
            <SelectItem value="affiliate">Affiliate</SelectItem>
            <SelectItem value="payout">Payout</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.user_id}</TableCell>
                  <TableCell>{transaction.profiles?.name || 'Unknown'}</TableCell>
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
                            onClick={() => updateStatus(transaction.id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => updateStatus(transaction.id, 'paid')}
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
    </div>
  );
}
