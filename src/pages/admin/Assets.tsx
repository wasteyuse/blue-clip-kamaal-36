
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadForm } from "@/components/admin/assets/UploadForm";
import { AssetCard } from "@/components/admin/assets/AssetCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setIsTableLoading(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets data",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  }

  async function deleteAsset(assetId: string) {
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset?.file_url) throw new Error("Asset not found");

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove([asset.file_url]);
      
      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (dbError) throw dbError;
      
      // Update local state
      setAssets(assets.filter(a => a.id !== assetId));
      
      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
    }
  }

  const filteredAssets = searchTerm
    ? assets.filter(asset => 
        asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : assets;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl font-bold">Asset Manager</h1>
        </div>
        <Button onClick={fetchAssets} variant="outline">Refresh</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div>
          <UploadForm onUploadComplete={fetchAssets} />
        </div>
        
        <div className="space-y-4">
          <Input
            placeholder="Search assets by title, type or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {isTableLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onDelete={deleteAsset}
                />
              ))}
              {filteredAssets.length === 0 && (
                <p className="col-span-2 text-center py-4 text-gray-500">
                  No assets found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
