
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserActions } from "./UserActions";
import { UserTableSkeleton } from "./UserTableSkeleton";

interface User {
  id: string;
  name?: string;
  is_creator?: boolean;
  banned?: boolean;
  total_earnings?: number;
  total_views?: number;
  kyc_status?: 'pending' | 'approved' | 'rejected';
  kyc_doc_url?: string | null;
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
}

export function UserTable({ 
  users, 
  admins, 
  isLoading,
  onToggleCreator,
  onToggleAdmin,
  onToggleBan,
  columns = []
}: UserTableProps) {
  if (users.length === 0 && !isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-4">
          No users found
        </TableCell>
      </TableRow>
    );
  }

  return (
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
                  <UserStatusBadge banned={user.banned} />
                </TableCell>
                <TableCell>
                  <UserActions
                    userId={user.id}
                    isBanned={user.banned}
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
  );
}
