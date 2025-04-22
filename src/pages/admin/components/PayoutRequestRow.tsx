
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle } from "lucide-react";
import { PayoutRequest } from "../hooks/usePayoutRequests";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PayoutRequestRowProps {
  payout: PayoutRequest;
  onAction: (payout: PayoutRequest, status: "approved" | "rejected", reason?: string) => void;
  disabled?: boolean;
}

export function PayoutRequestRow({
  payout,
  onAction,
  disabled = false,
}: PayoutRequestRowProps) {
  const [rejectReason, setRejectReason] = React.useState("");
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  const handleReject = () => {
    if (showRejectInput) {
      onAction(payout, "rejected", rejectReason || undefined);
      setShowRejectInput(false);
      setRejectReason("");
    } else {
      setShowRejectInput(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isRecentAccount = () => {
    // Check if user account is less than 7 days old (assume profiles.created_at exists)
    if (payout.profiles?.created_at) {
      const creationDate = new Date(payout.profiles.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return creationDate > sevenDaysAgo;
    }
    return false;
  };

  return (
    <TableRow key={payout.id}>
      <TableCell className="font-bold">
        <div className="flex items-center gap-2">
          {payout.profiles?.name || payout.user_id}
          {isRecentAccount() && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>New account (less than 7 days old)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
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
        {getStatusBadge(payout.status)}
      </TableCell>
      <TableCell className="text-right">
        {showRejectInput ? (
          <div className="flex gap-2 justify-end">
            <input
              type="text"
              className="border p-1 text-sm rounded"
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRejectInput(false)}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject}
              disabled={disabled}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAction(payout, "approved")}
              disabled={disabled || payout.status !== 'pending'}
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleReject}
              disabled={disabled || payout.status !== 'pending'}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
