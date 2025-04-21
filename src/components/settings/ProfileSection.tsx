
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/components/UserSettings";

interface ProfileSectionProps {
  profile: Profile | null;
  profileLoading: boolean;
  saving: boolean;
  onProfileChange: (field: keyof Profile, value: string) => void;
  onSave: () => void;
}

export function ProfileSection({
  profile,
  profileLoading,
  saving,
  onProfileChange,
  onSave,
}: ProfileSectionProps) {
  return (
    <div className="rounded-lg border bg-white p-6 mb-8 space-y-5">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile?.name ?? ""}
          onChange={(e) => onProfileChange("name", e.target.value)}
          className="mt-1"
          disabled={profileLoading}
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          value={profile?.bio ?? ""}
          onChange={(e) => onProfileChange("bio", e.target.value)}
          className="mt-1"
          disabled={profileLoading}
        />
      </div>
      <Button onClick={onSave} disabled={saving || profileLoading}>
        {saving ? "Saving..." : "💾 Save Profile"}
      </Button>
    </div>
  );
}
