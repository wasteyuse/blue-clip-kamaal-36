
import { Badge } from "@/components/ui/badge";
import { KycStatus } from "./KycBadge";

interface UserStatusBadgeProps {
  isBanned?: boolean;
  kycStatus?: KycStatus;
}

export function UserStatusBadge({ isBanned, kycStatus }: UserStatusBadgeProps) {
  if (isBanned) {
    return <Badge variant="destructive">Banned</Badge>;
  }
  
  if (kycStatus === 'rejected') {
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">KYC Rejected</Badge>;
  }
  
  if (kycStatus === 'pending') {
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">KYC Pending</Badge>;
  }
  
  return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
}
