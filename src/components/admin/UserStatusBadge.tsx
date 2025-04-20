
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  banned?: boolean;
}

export function UserStatusBadge({ banned }: UserStatusBadgeProps) {
  return banned ? (
    <Badge variant="destructive">Banned</Badge>
  ) : (
    <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
  );
}
