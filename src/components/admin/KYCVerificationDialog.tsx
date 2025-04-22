
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KYCVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onVerificationComplete: () => void;
}

export function KYCVerificationDialog({
  open,
  onClose,
  userId,
  onVerificationComplete
}: KYCVerificationDialogProps) {
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleVerification = async (status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('verify_kyc', {
        user_id_param: userId,
        status_param: status,
        reason_param: status === 'rejected' ? reason : null
      });

      if (error) throw error;

      toast({
        title: `KYC ${status}`,
        description: `Successfully ${status} the KYC document.`
      });
      
      onVerificationComplete();
      onClose();
    } catch (error) {
      console.error('Error verifying KYC:', error);
      toast({
        title: "Verification failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify KYC Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason (optional)</Label>
            <Input
              id="reason"
              placeholder="Enter reason if rejecting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            disabled={processing}
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={processing}
            onClick={() => handleVerification('rejected')}
          >
            Reject
          </Button>
          <Button
            disabled={processing}
            onClick={() => handleVerification('approved')}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
