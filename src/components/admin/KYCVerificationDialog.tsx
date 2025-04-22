
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      fetchUserData();
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      setUserData(profile);
      
      // Get a signed URL for the document if available
      if (profile?.kyc_doc_url) {
        const { data, error } = await supabase
          .storage
          .from('kyc_docs')
          .createSignedUrl(profile.kyc_doc_url, 3600); // 1 hour expiry
          
        if (!error && data) {
          setDocUrl(data.signedUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data for verification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify KYC Document</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {userData && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-medium">Name: {userData.name || 'Not provided'}</p>
                  <p className="text-sm text-muted-foreground">User ID: {userId}</p>
                  <p className="text-sm text-muted-foreground">
                    Current KYC Status: <span className="font-medium">{userData.kyc_status || 'pending'}</span>
                  </p>
                </div>
                
                {docUrl ? (
                  <div>
                    <Label>KYC Document</Label>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2 justify-center"
                        asChild
                      >
                        <a href={docUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          Open Document in New Tab
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-yellow-600 text-sm">
                    No document available for review.
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Rejection Reason (required if rejecting)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason if rejecting..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            disabled={processing || loading}
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={processing || loading || (reason.trim() === '')}
            onClick={() => handleVerification('rejected')}
            className="gap-2"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Reject
          </Button>
          <Button
            disabled={processing || loading}
            onClick={() => handleVerification('approved')}
            className="gap-2"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
