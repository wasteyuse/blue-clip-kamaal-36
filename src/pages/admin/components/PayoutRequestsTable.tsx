
import React from "react";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { UserTableSkeleton } from "@/components/admin/UserTableSkeleton";
import { PayoutRequestRow } from "./PayoutRequestRow";
import type { PayoutRequest } from "../hooks/usePayoutRequests";

interface PayoutRequestsTableProps {
  payoutRequests: PayoutRequest[];
  isLoading: boolean;
  error: Error | null;
  onAction: (payout: PayoutRequest, status: "approved" | "rejected") => void;
  actioningId: string | null;
}

export function PayoutRequestsTable({
  payoutRequests,
  isLoading,
  error,
  onAction,
  actioningId,
}: PayoutRequestsTableProps) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <UserTableSkeleton />
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-red-500">
                {error.message}
              </TableCell>
            </TableRow>
          ) : payoutRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No payout requests found.
              </TableCell>
            </TableRow>
          ) : (
            payoutRequests.map((payout) => (
              <PayoutRequestRow
                key={payout.id}
                payout={payout}
                onAction={onAction}
                disabled={actioningId === payout.id}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
