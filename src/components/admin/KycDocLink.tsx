
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KycDocLinkProps {
  url: string | null;
}

export function KycDocLink({ url }: KycDocLinkProps) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  
  useEffect(() => {
    async function getPublicUrl() {
      if (!url) return;
      
      try {
        // Get a temporary signed URL for the document
        const { data, error } = await supabase
          .storage
          .from('kyc_docs')
          .createSignedUrl(url, 3600); // 1 hour expiry
          
        if (error) {
          console.error('Error getting signed URL:', error);
          return;
        }
        
        setPublicUrl(data.signedUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    getPublicUrl();
  }, [url]);

  if (!url) {
    return <span className="text-gray-500 text-sm">No document</span>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="gap-2"
      disabled={!publicUrl}
    >
      <a href={publicUrl || '#'} target="_blank" rel="noopener noreferrer">
        <FileText className="h-4 w-4" />
        <span>View</span>
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    </Button>
  );
}
