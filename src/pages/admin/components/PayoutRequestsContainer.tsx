
import React, { useState } from "react";
import { usePayoutRequests } from "../hooks/usePayoutRequests";
import { PayoutRequestsTable } from "./PayoutRequestsTable";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PayoutRequestsContainer() {
  const { payoutRequests, isLoading, error, approveOrReject } = usePayoutRequests();
  const { toast } = useToast();
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>("pending");
  
  const pendingRequests = payoutRequests.filter(p => p.status === 'pending');
  const approvedRequests = payoutRequests.filter(p => p.status === 'approved');
  const rejectedRequests = payoutRequests.filter(p => p.status === 'rejected');
  const completedRequests = payoutRequests.filter(p => p.status === 'completed');

  const handleAction = async (payout, status: "approved" | "rejected", reason?: string) => {
    setActioningId(payout.id);
    try {
      await approveOrReject(payout, status, reason);
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
      
      <Tabs defaultValue="pending" onValueChange={setActiveStatus}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRequests.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PayoutRequestsTable
            payoutRequests={pendingRequests}
            isLoading={isLoading}
            error={error}
            onAction={handleAction}
            actioningId={actioningId}
          />
        </TabsContent>
        
        <TabsContent value="approved">
          <PayoutRequestsTable
            payoutRequests={approvedRequests}
            isLoading={isLoading}
            error={error}
            onAction={handleAction}
            actioningId={actioningId}
          />
        </TabsContent>
        
        <TabsContent value="rejected">
          <PayoutRequestsTable
            payoutRequests={rejectedRequests}
            isLoading={isLoading}
            error={error}
            onAction={handleAction}
            actioningId={actioningId}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <PayoutRequestsTable
            payoutRequests={completedRequests}
            isLoading={isLoading}
            error={error}
            onAction={handleAction}
            actioningId={actioningId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
