
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Video, Image as ImageIcon, ShoppingBag, FileType } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  profiles?: { name: string };
  type: string;
  created_at: string;
  status: string;
  asset_used: string;
  content_url: string;
}

interface SubmissionTableProps {
  submissions: Submission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPreview: (url: string, type: string) => void;
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

export function SubmissionTable({ submissions, onApprove, onReject, onPreview }: SubmissionTableProps) {
  return (
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
          {submissions.length > 0 ? (
            submissions.map((submission) => (
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPreview(submission.content_url, submission.type)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => onApprove(submission.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onReject(submission.id)}
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
  );
}
