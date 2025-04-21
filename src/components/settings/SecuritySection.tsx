
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecuritySectionProps {
  email: string;
  password: string;
  emailSaving: boolean;
  passwordSaving: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onUpdateEmail: () => void;
  onUpdatePassword: () => void;
  onLogout: () => void;
}

export function SecuritySection({
  email,
  password,
  emailSaving,
  passwordSaving,
  onEmailChange,
  onPasswordChange,
  onUpdateEmail,
  onUpdatePassword,
  onLogout,
}: SecuritySectionProps) {
  return (
    <div className="rounded-lg border bg-white p-6 mb-8 space-y-5">
      <h3 className="text-xl font-semibold">🔐 Account Security</h3>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="mt-1"
          disabled={emailSaving}
        />
        <Button
          className="mt-2"
          variant="secondary"
          onClick={onUpdateEmail}
          disabled={emailSaving}
        >
          {emailSaving ? "Updating..." : "Update Email"}
        </Button>
      </div>
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => onPasswordChange(e.target.value)}
          className="mt-1"
          disabled={passwordSaving}
        />
        <Button
          className="mt-2"
          variant="secondary"
          onClick={onUpdatePassword}
          disabled={passwordSaving || !password}
        >
          {passwordSaving ? "Updating..." : "Change Password"}
        </Button>
      </div>
      <Button className="mt-6" variant="destructive" onClick={onLogout}>
        🚪 Logout
      </Button>
    </div>
  );
}
