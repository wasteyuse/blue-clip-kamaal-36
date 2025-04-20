
import { useAdminGuard } from "@/utils/isAdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function PayoutsPage() {
  const { isAdmin, isLoading } = useAdminGuard();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchPayouts();
    }
  }, [isAdmin]);

  async function fetchPayouts() {
    setIsTableLoading(true);
    try {
      // Join payouts with profiles to get user names
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast({
        title: "Error",
        description: "Failed to load payouts data",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  }

  async function updatePayoutStatus(payoutId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('payouts')
        .update({ status: newStatus })
        .eq('id', payoutId);

      if (error) throw error;
      
      // Update local state
      setPayouts(payouts.map(payout => 
        payout.id === payoutId ? { ...payout, status: newStatus } : payout
      ));
      
      toast({
        title: "Success",
        description: `Payout ${newStatus} successfully`,
      });
    } catch (error) {
      console.error('Error updating payout:', error);
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive",
      });
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredPayouts = searchTerm
    ? payouts.filter(payout => 
        payout.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        payout.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : payouts;

  if (isLoading || !isAdmin) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Payout Control</h1>
        </div>
        <Button onClick={fetchPayouts} variant="outline">Refresh</Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search payouts by user, status, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isTableLoading ? (
        <div className="text-center py-4">Loading payouts data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.length > 0 ? (
                filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.profiles?.name || 'Unknown User'}</TableCell>
                    <TableCell>₹{payout.amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      {payout.requested_at ? format(new Date(payout.requested_at), 'PPP') : 'Unknown'}
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {payout.status === 'pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {payout.status === 'approved' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updatePayoutStatus(payout.id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No payouts found
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
