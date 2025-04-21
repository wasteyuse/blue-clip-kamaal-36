
import { Badge } from "@/components/ui/badge";

type KycStatus = 'pending' | 'approved' | 'rejected';

interface KycBadgeProps {
  status: KycStatus;
}

export function KycBadge({ status }: KycBadgeProps) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
