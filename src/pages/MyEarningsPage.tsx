
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PayoutRequestForm } from "@/components/PayoutRequestForm";
import { PayoutHistory } from "@/components/PayoutHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, DollarSign, Clock, RefreshCw } from "lucide-react";

export default function MyEarningsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const fetchPayouts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("payouts")
      .select("*")
      .eq("user_id", user.id)
      .order("requested_at", { ascending: false });

    if (error) {
      console.error("Error fetching payouts:", error);
      return;
    }

    setPayouts(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchPayouts();

    // Set up real-time subscriptions
    const profileChannel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user?.id}` },
        () => fetchProfile()
      )
      .subscribe();

    const payoutsChannel = supabase
      .channel("payouts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payouts", filter: `user_id=eq.${user?.id}` },
        () => fetchPayouts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(payoutsChannel);
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.total_views || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(profile?.total_earnings || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
          <CardDescription>
            Request a payout of your earnings (Min: ₹10, Max: ₹500)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayoutRequestForm
            availableAmount={profile?.total_earnings || 0}
            onSuccess={fetchPayouts}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            View your previous payout requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayoutHistory payouts={payouts} />
        </CardContent>
      </Card>
    </div>
  );
}
