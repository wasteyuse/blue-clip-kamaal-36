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

export async function updateViewsAndEarnings(submissionId: string, newViews: number) {
  const { data: submission, error: fetchError } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (fetchError) throw fetchError;
  if (!submission) throw new Error('Submission not found');

  const totalViews = (submission.views || 0) + newViews;
  const baseEarnings = (totalViews / 1000); // ₹1 per 1000 views
  const finalEarnings = submission.type === 'product'
    ? baseEarnings * 0.2 // 20% commission for product content
    : baseEarnings;

  const { error: updateError } = await supabase
    .from('submissions')
    .update({
      views: totalViews,
      earnings: finalEarnings,
    })
    .eq('id', submissionId);

  if (updateError) throw updateError;

  const { error: rpcError } = await supabase.rpc('increment_user_earnings', {
    user_id_param: submission.user_id,
    amount_param: finalEarnings - (submission.earnings || 0) // Only increment the difference
  });

  if (rpcError) throw rpcError;
  
  return { totalViews, finalEarnings };
}
