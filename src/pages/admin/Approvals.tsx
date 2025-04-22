
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { approveSubmission, updateSubmissionStatus } from "@/lib/api";
import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { PreviewDialog } from "@/components/admin/PreviewDialog";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<{ url: string; type: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submissionToReject, setSubmissionToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();

    // Setup real-time listener for submissions changes
    const channel = supabase
      .channel('admin-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSubmissions() {
    setIsTableLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error("Failed to load submissions data");
    } finally {
      setIsTableLoading(false);
    }
  }

  async function handleApproveSubmission(submissionId: string) {
    try {
      await approveSubmission(submissionId);
      setSubmissions(submissions.map(submission => 
        submission.id === submissionId ? { ...submission, status: 'approved' } : submission
      ));
      toast.success("Submission approved successfully");
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error("Failed to approve submission");
    }
  }

  async function handleRejectSubmission(submissionId: string) {
    // Open the reject dialog and store the submission ID
    setSubmissionToReject(submissionId);
    setRejectReason("");
    setIsRejectDialogOpen(true);
  }

  async function confirmRejectSubmission() {
    if (!submissionToReject) return;
    
    try {
      await updateSubmissionStatus(submissionToReject, 'rejected', rejectReason);
      setSubmissions(submissions.map(submission => 
        submission.id === submissionToReject ? { ...submission, status: 'rejected', reason: rejectReason } : submission
      ));
      toast.success("Submission rejected successfully");
      setIsRejectDialogOpen(false);
      setSubmissionToReject(null);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error("Failed to reject submission");
    }
  }

  const handlePreview = (url: string, type: string) => {
    setPreviewContent({ url, type });
    setIsPreviewOpen(true);
  };

  const filteredSubmissions = searchTerm
    ? submissions.filter(submission => 
        submission.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : submissions;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Check className="h-6 w-6 text-purple-500" />
          <h1 className="text-3xl font-bold">Approval Center</h1>
        </div>
        <Button onClick={fetchSubmissions} variant="outline">Refresh</Button>
      </div>

      <SearchFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isTableLoading ? (
        <div className="text-center py-4">Loading submissions data...</div>
      ) : (
        <SubmissionTable 
          submissions={filteredSubmissions}
          onApprove={handleApproveSubmission}
          onReject={handleRejectSubmission}
          onPreview={handlePreview}
        />
      )}

      <PreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        content={previewContent}
        creatorName={submissions.find(s => s.content_url === previewContent?.url)?.profiles?.name}
      />

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Reason for rejection (optional)
            </label>
            <Textarea
              placeholder="Please provide a reason for rejecting this submission"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectSubmission}>
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
