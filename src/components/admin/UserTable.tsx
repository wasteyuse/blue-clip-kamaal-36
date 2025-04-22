
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserActions } from "./UserActions";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { KycStatus } from "./KycBadge";

// Updated interface to include additional properties not in the database schema
interface User extends Tables<'profiles'> {
  isBanned?: boolean;
}

interface Column {
  header: string;
  cell: (user: User) => React.ReactNode;
}

interface UserTableProps {
  users: User[];
  admins: Record<string, boolean>;
  isLoading: boolean;
  onToggleCreator: (userId: string, status: boolean) => Promise<void>;
  onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
  onToggleBan: (userId: string, isBanned: boolean) => Promise<void>;
  columns?: Column[];
  page: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserTable({ 
  users, 
  admins, 
  isLoading,
  onToggleCreator,
  onToggleAdmin,
  onToggleBan,
  columns = [],
  page,
  totalPages,
  onPageChange
}: UserTableProps) {
  if (users.length === 0 && !isLoading) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UserTableSkeleton />
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {columns.map((column, index) => (
                    <TableCell key={index}>{column.cell(user)}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      {user.is_creator && (
                        <Badge variant="secondary">Creator</Badge>
                      )}
                      {admins[user.id] && (
                        <Badge variant="default">Admin</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge 
                      isBanned={user.isBanned} 
                      kycStatus={user.kyc_status as KycStatus} 
                    />
                  </TableCell>
                  <TableCell>
                    <UserActions
                      userId={user.id}
                      isBanned={user.isBanned}
                      isCreator={user.is_creator}
                      isAdmin={admins[user.id]}
                      onToggleCreator={onToggleCreator}
                      onToggleAdmin={onToggleAdmin}
                      onToggleBan={onToggleBan}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
