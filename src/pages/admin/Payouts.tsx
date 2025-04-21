
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

type PayoutRequest = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  requested_at: string;
  profiles: { name: string; email?: string } | null;
  wallets: { balance: number } | null;
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  async function fetchPayoutRequests() {
    setIsLoading(true);
    try {
      // Get all pending requests & user info (profiles/wallet)
      const { data, error } = await supabase
        .from("payout_requests")
        .select(`
          id,
          user_id,
          amount,
          status,
          requested_at,
          profiles:profiles(name),
          wallets(balance)
        `)
        .eq("status", "pending")
        .order("requested_at", { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load payout requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAction(payout: PayoutRequest, status: "approved" | "rejected") {
    try {
      if (status === "approved") {
        // 1. Mark payout request as approved
        const { error: updErr } = await supabase
          .from("payout_requests")
          .update({ status: "approved" })
          .eq("id", payout.id);
        if (updErr) throw updErr;

        // 2. Deduct funds from wallet (call RPC)
        const { error: rpcErr } = await supabase.rpc("deduct_wallet_balance", {
          user_id: payout.user_id,
          amount: payout.amount,
        });
        if (rpcErr) throw rpcErr;

        // 3. Log the payout in wallet_transactions
        const { error: logErr } = await supabase.from("wallet_transactions").insert([
          {
            user_id: payout.user_id,
            type: "debit",
            amount: payout.amount,
            reason: "Payout approved",
          },
        ]);
        if (logErr) throw logErr;

        toast({ title: "Payout approved", description: `Payout of ₹${payout.amount} approved.` });
      } else {
        // Just mark as rejected
        const { error } = await supabase.from("payout_requests").update({ status: "rejected" }).eq("id", payout.id);
        if (error) throw error;
        toast({ title: "Payout rejected", description: "Payout request was rejected." });
      }
      fetchPayoutRequests();
    } catch (e: any) {
      toast({ title: "Error processing payout", description: e?.message, variant: "destructive" });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">💸 Pending Payout Requests</h1>
      {isLoading ? (
        <div className="text-center py-4">Loading requests...</div>
      ) : payouts.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No pending payout requests found.</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-bold">{p.profiles?.name || p.user_id}</TableCell>
                  <TableCell>
                    ₹{typeof p.wallets?.balance === "number" ? Number(p.wallets.balance).toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell>₹{Number(p.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    {p.requested_at ? new Date(p.requested_at).toLocaleString() : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize">{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(p, "approved")}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleAction(p, "rejected")}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
