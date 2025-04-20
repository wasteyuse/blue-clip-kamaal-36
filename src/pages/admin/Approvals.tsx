import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { approveSubmission, updateSubmissionStatus } from "@/lib/api";
import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { PreviewDialog } from "@/components/admin/PreviewDialog";
import { SearchFilter } from "@/components/admin/SearchFilter";

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<{ url: string; type: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
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
      toast({
        title: "Error",
        description: "Failed to load submissions data",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Submission approved successfully",
      });
    } catch (error) {
      console.error('Error approving submission:', error);
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive",
      });
    }
  }

  async function handleRejectSubmission(submissionId: string) {
    try {
      await updateSubmissionStatus(submissionId, 'rejected');
      setSubmissions(submissions.map(submission => 
        submission.id === submissionId ? { ...submission, status: 'rejected' } : submission
      ));
      toast({
        title: "Success",
        description: "Submission rejected successfully",
      });
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive",
      });
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
    </div>
  );
}
