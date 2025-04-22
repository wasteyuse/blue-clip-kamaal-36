
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";

type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];

interface WorkflowActionsProps {
  assetId: string;
  currentStatus: WorkflowStatus;
  onStatusChange: () => void;
}

export function WorkflowActions({ assetId, currentStatus, onStatusChange }: WorkflowActionsProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: WorkflowStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('assets')
        .update({ workflow_status: newStatus })
        .eq('id', assetId);

      if (error) throw error;

      toast({
        description: `Asset status updated to ${newStatus.replace('_', ' ')}`
      });
      
      onStatusChange();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Failed to update status"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentStatus === 'draft') {
    return (
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => updateStatus('in_review')}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Submit for Review"}
      </Button>
    );
  }

  if (currentStatus === 'in_review') {
    return (
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-green-50 text-green-600 hover:bg-green-100"
          onClick={() => updateStatus('approved')}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Approve"}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100"
          onClick={() => updateStatus('rejected')}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Reject"}
        </Button>
      </div>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => updateStatus('draft')}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Revise & Resubmit"}
      </Button>
    );
  }

  return null;
}
