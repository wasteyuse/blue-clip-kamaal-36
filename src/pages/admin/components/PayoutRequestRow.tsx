
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { PayoutRequest } from "../hooks/usePayoutRequests";

interface PayoutRequestRowProps {
  payout: PayoutRequest;
  onAction: (payout: PayoutRequest, status: "approved" | "rejected") => void;
  disabled?: boolean;
}

export function PayoutRequestRow({
  payout,
  onAction,
  disabled = false,
}: PayoutRequestRowProps) {
  return (
    <TableRow key={payout.id}>
      <TableCell className="font-bold">{payout.profiles?.name || payout.user_id}</TableCell>
      <TableCell>
        ₹{typeof payout.wallets?.balance === "number"
          ? Number(payout.wallets.balance).toFixed(2)
          : "0.00"}
      </TableCell>
      <TableCell>₹{Number(payout.amount).toFixed(2)}</TableCell>
      <TableCell>
        {payout.requested_at ? new Date(payout.requested_at).toLocaleString() : "Unknown"}
      </TableCell>
      <TableCell>
        <Badge className="capitalize">{payout.status}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onAction(payout, "approved")}
            disabled={disabled}
          >
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onAction(payout, "rejected")}
            disabled={disabled}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

