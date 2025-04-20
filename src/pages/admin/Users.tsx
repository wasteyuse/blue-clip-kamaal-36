
import { useAdminGuard } from "@/utils/isAdminGuard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function UsersPage() {
  const { isAdmin, isLoading } = useAdminGuard();
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchAdmins();
    }
  }, [isAdmin]);

  async function fetchUsers() {
    setIsTableLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  }

  async function fetchAdmins() {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('user_id');

      if (error) throw error;
      
      // Create a map of user_id to admin status
      const adminMap: Record<string, boolean> = {};
      (data || []).forEach(admin => {
        adminMap[admin.user_id] = true;
      });
      
      setAdmins(adminMap);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    }
  }

  async function toggleCreatorStatus(userId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_creator: !currentStatus } : user
      ));
      
      toast({
        title: "Success",
        description: `User creator status ${!currentStatus ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  }

  async function toggleAdminStatus(userId: string, isCurrentlyAdmin: boolean) {
    try {
      if (isCurrentlyAdmin) {
        // Remove from admins table
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Add to admins table
        const { error } = await supabase
          .from('admins')
          .insert([{ user_id: userId }]);

        if (error) throw error;
      }
      
      // Update local state
      setAdmins({
        ...admins,
        [userId]: !isCurrentlyAdmin
      });
      
      toast({
        title: "Success",
        description: `User admin status ${!isCurrentlyAdmin ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  }

  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  if (isLoading || !isAdmin) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button onClick={() => { fetchUsers(); fetchAdmins(); }} variant="outline">Refresh</Button>
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
        <div className="text-center py-4">Loading users data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'Anonymous'}</TableCell>
                    <TableCell className="text-xs text-gray-500">{user.id}</TableCell>
                    <TableCell>
                      {user.is_creator ? (
                        <Badge variant="success" className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {admins[user.id] ? (
                        <Badge variant="success" className="bg-blue-100 text-blue-800">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>₹{user.total_earnings?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{user.total_views || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant={user.is_creator ? "destructive" : "outline"} 
                          size="sm"
                          onClick={() => toggleCreatorStatus(user.id, user.is_creator)}
                        >
                          {user.is_creator ? 'Disable Creator' : 'Enable Creator'}
                        </Button>
                        
                        <Button 
                          variant={admins[user.id] ? "destructive" : "default"} 
                          size="sm"
                          onClick={() => toggleAdminStatus(user.id, admins[user.id] || false)}
                        >
                          {admins[user.id] ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
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
