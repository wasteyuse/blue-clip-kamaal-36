import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, DollarSign, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function EarningsPage() {
  const [userEarnings, setUserEarnings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState({
    totalEarnings: 0,
    totalPaidOut: 0,
    pendingPayouts: 0,
    topEarner: { name: '', amount: 0 },
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEarningsData();
  }, []);

  async function fetchEarningsData() {
    setIsTableLoading(true);
    try {
      // Fetch all users with their earnings
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('total_earnings', { ascending: false });

      if (profilesError) throw profilesError;
      
      // Fetch all payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('*');

      if (payoutsError) throw payoutsError;
      
      // Calculate stats
      const totalEarnings = profilesData?.reduce((sum, profile) => sum + (profile.total_earnings || 0), 0) || 0;
      
      const completedPayouts = payoutsData?.filter(payout => payout.status === 'completed') || [];
      const totalPaidOut = completedPayouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
      
      const pendingPayouts = payoutsData?.filter(payout => payout.status === 'pending' || payout.status === 'approved') || [];
      const pendingAmount = pendingPayouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
      
      const topEarner = profilesData && profilesData.length > 0 
        ? { name: profilesData[0].name || 'Unknown', amount: profilesData[0].total_earnings || 0 }
        : { name: '', amount: 0 };
      
      setUserEarnings(profilesData || []);
      setOverviewStats({
        totalEarnings,
        totalPaidOut,
        pendingPayouts: pendingAmount,
        topEarner,
      });
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast({
        title: "Error",
        description: "Failed to load earnings data",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  }

  const filteredUsers = searchTerm
    ? userEarnings.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : userEarnings;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h1 className="text-3xl font-bold">Earnings Overview</h1>
        </div>
        <Button onClick={fetchEarningsData} variant="outline">Refresh</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">₹{overviewStats.totalEarnings.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">₹{overviewStats.totalPaidOut.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">₹{overviewStats.pendingPayouts.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Earner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <div className="text-lg font-bold">{overviewStats.topEarner.name}</div>
                <div className="text-sm text-gray-500">₹{overviewStats.topEarner.amount.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search users by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isTableLoading ? (
        <div className="text-center py-4">Loading earnings data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Total Views</TableHead>
                <TableHead>Creator Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'Anonymous'}</TableCell>
                    <TableCell>₹{user.total_earnings?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{user.total_views || 0}</TableCell>
                    <TableCell>
                      {user.is_creator ? (
                        user.is_approved ? (
                          <Badge className="bg-green-100 text-green-800">Approved Creator</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Pending Creator</Badge>
                        )
                      ) : (
                        <Badge variant="outline">Regular User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.updated_at ? format(new Date(user.updated_at), 'PPP') : 'Unknown'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found
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
