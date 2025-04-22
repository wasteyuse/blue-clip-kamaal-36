
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function KYCSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("pending");
  const [kycReason, setKycReason] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchKYCStatus();
    }
  }, [user]);

  const fetchKYCStatus = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status, kyc_verification_reason')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching KYC status:', error);
      return;
    }
    
    if (data) {
      setKycStatus(data.kyc_status || 'pending');
      setKycReason(data.kyc_verification_reason);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !user) return;
    
    setUploading(true);
    const file = event.target.files[0];
    
    try {
      // Upload to kyc_docs bucket with user ID as folder name
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc_docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update profile with document URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          kyc_doc_url: filePath,
          kyc_status: 'pending'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Document uploaded successfully",
        description: "Your KYC document is under review."
      });

      setKycStatus('pending');
      setKycReason(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = () => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={variants[kycStatus as keyof typeof variants]} variant="outline">
        {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border bg-white p-6 mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">KYC Verification</h3>
        {getStatusBadge()}
      </div>

      {kycReason && kycStatus === 'rejected' && (
        <p className="text-sm text-red-600">Reason: {kycReason}</p>
      )}

      <div className="space-y-2">
        <Button
          variant="outline"
          disabled={uploading || kycStatus === 'approved'}
          onClick={() => document.getElementById('kyc-file')?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload KYC Document'
          )}
        </Button>
        <input
          type="file"
          id="kyc-file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <p className="text-sm text-muted-foreground">
          Upload a clear photo of your government ID (Aadhar, PAN, or Passport)
        </p>
      </div>
    </div>
  );
}
