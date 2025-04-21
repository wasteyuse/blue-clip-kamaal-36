
import React, { useEffect, useState } from "react";
import { usePayoutRequests } from "../hooks/usePayoutRequests";
import { PayoutRequestsTable } from "./PayoutRequestsTable";
import { useToast } from "@/hooks/use-toast";

export function PayoutRequestsContainer() {
  const { payoutRequests, isLoading, error, approveOrReject } = usePayoutRequests();
  const { toast } = useToast();
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleAction = async (payout, status: "approved" | "rejected") => {
    setActioningId(payout.id);
    try {
      await approveOrReject(payout, status);
      toast({
        title: "Success!",
        description: `Payout request ${status}`,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${status} payout`,
        variant: "destructive",
      });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payout Requests</h2>
      <PayoutRequestsTable
        payoutRequests={payoutRequests}
        isLoading={isLoading}
        error={error}
        onAction={handleAction}
        actioningId={actioningId}
      />
    </div>
  );
}
