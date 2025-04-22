
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { KycBadge } from "@/components/admin/KycBadge";
import { KycDocLink } from "@/components/admin/KycDocLink";
import { KYCVerificationDialog } from "@/components/admin/KYCVerificationDialog";
import { UserSearchFilter } from "@/components/admin/UserSearchFilter";
import { Tables } from "@/integrations/supabase/types";

// Constants
const USERS_PER_PAGE = 10;

// Type for filtered users with additional properties
interface UserWithMeta extends Tables<'profiles'> {
  isBanned?: boolean; // Using a separate property instead of "banned"
}

export default function UsersPage() {
  // State for users and pagination
  const [users, setUsers] = useState<UserWithMeta[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithMeta[]>([]);
  const [admins, setAdmins] = useState<Record<string, boolean>>({});
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for filters - using literal string types to avoid infinite type instantiation
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all" as "all" | "active" | "banned",
    kyc: "all" as "all" | "pending" | "approved" | "rejected",
    role: "all" as "all" | "admin" | "creator" | "user"
  });
  
  // State for KYC verification
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  
  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch users with filters applied
  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, filters]);

  // Apply filters to users
  useEffect(() => {
    if (users.length > 0) {
      applyFilters();
    }
  }, [users, searchTerm, filters, admins]);

  async function fetchUsers() {
    setIsTableLoading(true);
    try {
      let query = supabase.from('profiles').select('*', { count: 'exact' });
      
      // Apply search if provided
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }
      
      // Apply KYC filter
      if (filters.kyc !== 'all') {
        query = query.eq('kyc_status', filters.kyc);
      }
      
      // Apply role filter - handle in client side for admin
      if (filters.role === 'creator') {
        query = query.eq('is_creator', true);
      }
      
      // Apply status filter - We'll handle the "banned" status in the client side
      // since it's not in the database schema
      
      // Apply pagination
      const from = (page - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;
      
      const { data, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to add the isBanned property
      const processedData = (data || []).map(user => ({
        ...user,
        isBanned: false // Default value, we'll update this later
      }));
      
      setUsers(processedData);
      if (count !== null) {
        setTotalCount(count);
        setTotalPages(Math.ceil(count / USERS_PER_PAGE));
      }
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

  function applyFilters() {
    let result = [...users];
    
    // Filter by status
    if (filters.status === 'banned') {
      result = result.filter(user => user.isBanned);
    } else if (filters.status === 'active') {
      result = result.filter(user => !user.isBanned);
    }
    
    // Filter admins (can only be done client-side since it's from a different table)
    if (filters.role === 'admin') {
      result = result.filter(user => admins[user.id]);
    } else if (filters.role === 'user') {
      result = result.filter(user => !admins[user.id] && !user.is_creator);
    }
    
    setFilteredUsers(result);
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
      // Update local state only since we don't have a 'banned' column
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBanned: !isBanned } : user
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

  function handleSearchChange(term: string) {
    setSearchTerm(term);
    setPage(1); // Reset to first page when search changes
  }

  function handleFilterChange(filter: string, value: string) {
    setFilters(prev => ({ ...prev, [filter]: value as any }));
    setPage(1); // Reset to first page when filters change
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handleVerifyKYC(userId: string) {
    setSelectedUserId(userId);
    setVerificationDialogOpen(true);
  }

  const columns = [
    {
      header: "Name",
      cell: (user: UserWithMeta) => user.name || "Anonymous"
    },
    {
      header: "KYC Document",
      cell: (user: UserWithMeta) => <KycDocLink url={user.kyc_doc_url} />
    },
    {
      header: "KYC Status",
      cell: (user: UserWithMeta) => <KycBadge status={user.kyc_status || 'pending'} />
    },
    {
      header: "Actions",
      cell: (user: UserWithMeta) => (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => handleVerifyKYC(user.id)}
          disabled={!user.kyc_doc_url}
        >
          Verify KYC
        </Button>
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
        <UserSearchFilter 
          onSearch={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {totalCount} users
        </p>
      </div>
      
      <UserTable 
        users={filteredUsers}
        admins={admins}
        isLoading={isTableLoading}
        onToggleCreator={toggleCreatorStatus}
        onToggleAdmin={toggleAdminStatus}
        onToggleBan={toggleBanStatus}
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
      <KYCVerificationDialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        userId={selectedUserId || ''}
        onVerificationComplete={fetchUsers}
      />
    </div>
  );
}
