
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/components/UserSettings";

interface PayoutSectionProps {
  profile: Profile | null;
  profileLoading: boolean;
  saving: boolean;
  onProfileChange: (field: keyof Profile, value: string) => void;
  onSave: () => void;
}

export function PayoutSection({
  profile,
  profileLoading,
  saving,
  onProfileChange,
  onSave,
}: PayoutSectionProps) {
  return (
    <div className="rounded-lg border bg-white p-6 mb-8 space-y-5">
      <div>
        <Label htmlFor="payout_upi">UPI ID</Label>
        <Input
          id="payout_upi"
          placeholder="yourname@upi"
          value={profile?.payout_upi ?? ""}
          onChange={(e) => onProfileChange("payout_upi", e.target.value)}
          className="mt-1"
          disabled={profileLoading}
        />
      </div>
      <div>
        <Label htmlFor="payout_bank">Bank Info (optional)</Label>
        <Input
          id="payout_bank"
          placeholder="IFSC, Account No"
          value={profile?.payout_bank ?? ""}
          onChange={(e) => onProfileChange("payout_bank", e.target.value)}
          className="mt-1"
          disabled={profileLoading}
        />
      </div>
      <Button onClick={onSave} disabled={saving || profileLoading}>
        {saving ? "Saving..." : "💾 Save Payout Details"}
      </Button>
    </div>
  );
}
