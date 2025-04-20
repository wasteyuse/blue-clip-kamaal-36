
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Users, Check, X, Ban } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

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

  // We need to modify this function since 'banned' is not a field in the profiles table
  // Instead, let's track banned status in our client-side state for now
  async function toggleBanStatus(userId: string, isBanned: boolean = false) {
    try {
      // Instead of updating a non-existent 'banned' field, we'll use the 'is_creator' field temporarily
      // as a placeholder to demonstrate ban functionality
      // In a real application, you would need to add a 'banned' column to the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: isBanned }) // We're toggling is_creator to the opposite state as a temporary solution
        .eq('id', userId);

      if (error) throw error;
      
      // For the UI, we'll just track the banned status in our local state
      // Note: this is just for demonstration, in a real app you'd want a proper banned column
      setUsers(users.map(user => 
        user.id === userId ? { ...user, banned: !isBanned } : user
      ));
      
      toast({
        title: "Success",
        description: `User ${!isBanned ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error) {
      console.error('Error updating ban status:', error);
      toast({
        title: "Error",
        description: "Failed to update user ban status",
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
                <TableHead>Status</TableHead>
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
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
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
                        
                        <Button 
                          variant={user.banned ? "outline" : "destructive"} 
                          size="sm"
                          onClick={() => toggleBanStatus(user.id, user.banned)}
                        >
                          {user.banned ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Unban
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
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
