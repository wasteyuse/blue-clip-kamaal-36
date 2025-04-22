
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { AssetGrid } from "@/components/assets/AssetGrid";
import { PreviewDialog } from "@/components/assets/PreviewDialog";
import { Database } from "@/integrations/supabase/types";

type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];

type Asset = {
  id: string;
  title: string;
  type: string;
  file_url: string;
  description: string;
  category: string;
  workflow_status: WorkflowStatus;
  created_at: string;
};

export function AssetsDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<string>("all");
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchAssets();
    setupRealtimeSubscription();
  }, [category, status]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return;
    }

    setIsAdmin(!!data);
  };

  const fetchAssets = async () => {
    try {
      let query = supabase.from("assets").select("*");

      if (category !== "all") {
        query = query.eq("category", category);
      }
      
      if (status !== "all") {
        if (status === "draft" || status === "in_review" || status === "approved" || status === "rejected") {
          query = query.eq("workflow_status", status as WorkflowStatus);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching assets",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('asset-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets'
        },
        (payload) => {
          console.log('Change received:', payload);
          fetchAssets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleStatusChange = () => {
    fetchAssets();
    toast({
      description: "Assets refreshed with updated status"
    });
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assets Library</h1>
        <p className="text-gray-600">Browse and manage your digital assets</p>
      </div>

      <AssetFilters
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AssetGrid 
        assets={filteredAssets}
        loading={loading}
        isAdmin={isAdmin}
        onPreview={setPreviewAsset}
        onStatusChange={handleStatusChange}
      />

      <PreviewDialog
        open={!!previewAsset}
        onOpenChange={() => setPreviewAsset(null)}
        asset={previewAsset}
      />
    </div>
  );
}
