
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { usePayoutRequests, PayoutRequest } from "./hooks/usePayoutRequests";
import { PayoutRequestRow } from "./components/PayoutRequestRow";
import { supabase } from "@/integrations/supabase/client";

export default function AdminPayoutsPage() {
  const { payouts, isLoading, fetchPayoutRequests } = usePayoutRequests();
  const { toast } = useToast();
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);

  async function handleAction(
    payout: PayoutRequest,
    status: "approved" | "rejected"
  ) {
    setActionLoadingId(payout.id);
    try {
      if (status === "approved") {
        const { error: updErr } = await supabase
          .from("payout_requests")
          .update({ status: "approved" })
          .eq("id", payout.id);
        if (updErr) throw updErr;

        const { error: rpcErr } = await supabase.rpc("deduct_wallet_balance", {
          user_id: payout.user_id,
          amount: payout.amount,
        });
        if (rpcErr) throw rpcErr;

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
        const { error } = await supabase.from("payout_requests").update({ status: "rejected" }).eq("id", payout.id);
        if (error) throw error;
        toast({ title: "Payout rejected", description: "Payout request was rejected." });
      }
      await fetchPayoutRequests();
    } catch (e: any) {
      toast({ title: "Error processing payout", description: e?.message, variant: "destructive" });
    } finally {
      setActionLoadingId(null);
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
                <PayoutRequestRow
                  key={p.id}
                  payout={p}
                  onAction={handleAction}
                  disabled={actionLoadingId === p.id}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

