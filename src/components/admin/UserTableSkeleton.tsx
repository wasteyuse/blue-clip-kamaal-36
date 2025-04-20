
import { TableCell, TableRow } from "@/components/ui/table";

export function UserTableSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-4">
        Loading users data...
      </TableCell>
    </TableRow>
  );
}
