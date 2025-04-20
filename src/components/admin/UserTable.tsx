
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
}

interface UserTableProps {
  users: User[];
  admins: Record<string, boolean>;
  isLoading: boolean;
  onToggleCreator: (userId: string, status: boolean) => Promise<void>;
  onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
  onToggleBan: (userId: string, isBanned: boolean) => Promise<void>;
}

export function UserTable({ 
  users, 
  admins, 
  isLoading,
  onToggleCreator,
  onToggleAdmin,
  onToggleBan
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
          {isLoading ? (
            <UserTableSkeleton />
          ) : (
            users.map((user) => (
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
                  <UserStatusBadge banned={user.banned} />
                </TableCell>
                <TableCell>₹{user.total_earnings?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{user.total_views || 0}</TableCell>
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
