import { supabase } from "@/integrations/supabase/client";

export async function approveCreator(userId: string) {
  const { data: functionData, error } = await supabase.functions.invoke('manage-creators', {
    body: { userId }
  });
  
  if (error) throw error;
  return functionData;
}

export async function submitContent(type: string, contentUrl: string, assetUsed: string) {
  const { data: functionData, error } = await supabase.functions.invoke('manage-submissions', {
    body: { 
      action: 'submit',
      type,
      contentUrl,
      assetUsed
    }
  });
  
  if (error) throw error;
  return functionData;
}

export async function updateSubmissionStatus(submissionId: string, status: 'approved' | 'rejected') {
  const { data: functionData, error } = await supabase.functions.invoke('manage-submissions', {
    body: { 
      action: 'update-status',
      submissionId,
      status
    }
  });
  
  if (error) throw error;
  return functionData;
}

export async function addAsset(title: string, type: string, fileUrl: string, description: string) {
  const { data: functionData, error } = await supabase.functions.invoke('manage-admin', {
    body: { 
      action: 'add-asset',
      title,
      type,
      fileUrl,
      description
    }
  });
  
  if (error) throw error;
  return functionData;
}

export async function approveSubmission(submissionId: string) {
  const { data: functionData, error } = await supabase.functions.invoke('manage-admin', {
    body: { 
      action: 'approve-submission',
      submissionId
    }
  });
  
  if (error) throw error;
  return functionData;
}
