import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { KycBadge } from "@/components/admin/KycBadge";
import { KycDocLink } from "@/components/admin/KycDocLink";

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
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admins')
          .insert([{ user_id: userId }]);

        if (error) throw error;
      }
      
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

  async function toggleBanStatus(userId: string, isBanned: boolean = false) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_creator: isBanned })
        .eq('id', userId);

      if (error) throw error;
      
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

  async function updateKycStatus(userId: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ kyc_status: status })
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers();
      
      toast({
        title: "Success",
        description: `KYC status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast({
        title: "Error",
        description: "Failed to update KYC status",
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

  const columns = [
    {
      header: "Name",
      cell: (user: any) => user.name || "Anonymous"
    },
    {
      header: "KYC Document",
      cell: (user: any) => <KycDocLink url={user.kyc_doc_url} />
    },
    {
      header: "KYC Status",
      cell: (user: any) => <KycBadge status={user.kyc_status || 'pending'} />
    },
    {
      header: "Actions",
      cell: (user: any) => (
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => updateKycStatus(user.id, 'approved')}
          >
            Approve
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => updateKycStatus(user.id, 'rejected')}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button onClick={fetchUsers} variant="outline">Refresh</Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search users by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <UserTable 
        users={filteredUsers}
        admins={admins}
        isLoading={isTableLoading}
        onToggleCreator={toggleCreatorStatus}
        onToggleAdmin={toggleAdminStatus}
        onToggleBan={toggleBanStatus}
        columns={columns}
      />
    </div>
  );
}
