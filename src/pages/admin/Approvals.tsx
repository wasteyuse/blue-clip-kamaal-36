import { useAdminGuard } from "@/utils/isAdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, Video, Image as ImageIcon, ShoppingBag, FileType, Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { approveSubmission, updateSubmissionStatus } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ApprovalsPage() {
  const { isAdmin, isLoading } = useAdminGuard();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<{ url: string; type: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin]);

  async function fetchSubmissions() {
    setIsTableLoading(true);
    try {
      // Join submissions with profiles to get user names
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
      
      // Update local state
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
      
      // Update local state
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

  const getContentTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'product':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      default:
        return <FileType className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handlePreview = (url: string, type: string) => {
    setPreviewContent({ url, type });
  };

  const renderPreviewContent = () => {
    if (!previewContent) return null;
    
    if (previewContent.type?.toLowerCase() === 'video') {
      return (
        <video 
          src={previewContent.url} 
          controls 
          className="max-h-[500px] w-full object-contain"
        />
      );
    } else if (previewContent.type?.toLowerCase() === 'image') {
      return (
        <img 
          src={previewContent.url} 
          alt="Content preview" 
          className="max-h-[500px] w-full object-contain"
        />
      );
    } else {
      return (
        <div className="p-4 text-center">
          <p>Preview not available for this content type</p>
          <a 
            href={previewContent.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline mt-2 block"
          >
            Open content URL
          </a>
        </div>
      );
    }
  };

  const filteredSubmissions = searchTerm
    ? submissions.filter(submission => 
        submission.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        submission.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : submissions;

  if (isLoading || !isAdmin) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Check className="h-6 w-6 text-purple-500" />
          <h1 className="text-3xl font-bold">Approval Center</h1>
        </div>
        <Button onClick={fetchSubmissions} variant="outline">Refresh</Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search submissions by user, type or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isTableLoading ? (
        <div className="text-center py-4">Loading submissions data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Asset Used</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.profiles?.name || 'Unknown Creator'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(submission.type)}
                        <span className="capitalize">{submission.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.created_at ? format(new Date(submission.created_at), 'PPP') : 'Unknown'}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {submission.asset_used || 'None'}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(submission.content_url, submission.type)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Content Preview</DialogTitle>
                            <DialogDescription>
                              Previewing content by {submission.profiles?.name || 'Unknown Creator'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 flex justify-center">
                            {renderPreviewContent()}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {submission.status === 'pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApproveSubmission(submission.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRejectSubmission(submission.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
