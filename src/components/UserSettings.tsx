import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileSection } from "./settings/ProfileSection";
import { PayoutSection } from "./settings/PayoutSection";
import { SecuritySection } from "./settings/SecuritySection";
import { KYCSection } from "./settings/KYCSection";

export interface Profile {
  id: string;
  name: string;
  bio?: string;
  payout_upi?: string;
  payout_bank?: string;
  [key: string]: any;
}

export default function UserSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setProfileLoading(true);
      
      console.log("Fetching profile for user ID:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } else if (data) {
        console.log("Profile data fetched:", data);
        setProfile({
          id: data.id,
          name: data.name || "",
          bio: data.bio || "",
          payout_upi: data.payout_upi || "",
          payout_bank: data.payout_bank || "",
        });
      } else {
        console.log("No profile data found, creating default profile");
        // If no profile exists, create a default one
        setProfile({
          id: user.id,
          name: user.email?.split('@')[0] || "",
          bio: "",
          payout_upi: "",
          payout_bank: "",
        });
      }
      
      setProfileLoading(false);
    };

    if (user?.email) {
      setEmail(user.email);
      fetchProfile();
    } else {
      console.log("No user found or user not fully loaded:", user);
    }
  }, [user]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        bio: profile.bio,
        payout_upi: profile.payout_upi,
        payout_bank: profile.payout_bank
      })
      .eq("id", user.id);
    setSaving(false);
    if (!error) {
      toast.success("Profile updated!");
    } else {
      toast.error("Error updating profile");
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !email) return;
    setEmailSaving(true);
    const { error } = await supabase.auth.updateUser({ email });
    setEmailSaving(false);
    if (!error) {
      toast.success("Email update requested! Please check your email for confirmation.");
    } else {
      toast.error(error.message || "Failed to update email");
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !password) return;
    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);
    setPassword("");
    if (!error) {
      toast.success("Password updated!");
    } else {
      toast.error(error.message || "Failed to update password");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto w-full">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
        <span>⚙️ User Settings</span>
      </h2>

      <ProfileSection
        profile={profile}
        profileLoading={profileLoading}
        saving={saving}
        onProfileChange={handleProfileChange}
        onSave={handleSaveProfile}
      />

      <KYCSection />

      <PayoutSection
        profile={profile}
        profileLoading={profileLoading}
        saving={saving}
        onProfileChange={handleProfileChange}
        onSave={handleSaveProfile}
      />

      <SecuritySection
        email={email}
        password={password}
        emailSaving={emailSaving}
        passwordSaving={passwordSaving}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onUpdateEmail={handleUpdateEmail}
        onUpdatePassword={handleUpdatePassword}
        onLogout={handleLogout}
      />
    </div>
  );
}
