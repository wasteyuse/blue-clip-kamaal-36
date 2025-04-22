
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Transaction, TransactionType, TransactionStatus } from "@/types/transactions";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        // Get profile name in a separate query since the join relationship doesn't exist
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;
        
        // Transform the data to match the Transaction type
        const formattedData: Transaction[] = (data || []).map(item => ({
          ...item,
          type: item.type as TransactionType,
          status: item.status as TransactionStatus,
          profiles: { 
            name: profileData?.name || null 
          }
        }));
        
        setTransactions(formattedData);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
        toast.error("Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();

    // Set up real-time listener for transactions
    const transactionsChannel = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            // Get the profile data for the new transaction
            const getProfileAndUpdateTransaction = async () => {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", user.id)
                .single();
              
              const newTransaction = {
                ...payload.new,
                type: payload.new.type as TransactionType,
                status: payload.new.status as TransactionStatus,
                profiles: {
                  name: profileData?.name || null
                }
              } as Transaction;
              
              setTransactions((prev) => [newTransaction, ...prev]);
            };
            
            getProfileAndUpdateTransaction();
            toast.info("New transaction recorded");
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === payload.new.id 
                  ? {
                      ...payload.new,
                      type: payload.new.type as TransactionType,
                      status: payload.new.status as TransactionStatus,
                      profiles: tx.profiles
                    } as Transaction
                  : tx
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTransactions((prev) =>
              prev.filter((tx) => tx.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
    };
  }, [user]);

  return { transactions, isLoading, error };
}
