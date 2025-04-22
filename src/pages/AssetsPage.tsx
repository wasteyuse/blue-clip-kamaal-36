
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileType, Video, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PreviewDialog } from "@/components/assets/PreviewDialog";
import { AssetFilters } from "@/components/assets/AssetFilters";

type Asset = {
  id: string;
  title: string;
  type: string;
  file_url: string;
  description: string;
  category: string;
  workflow_status: "draft" | "in_review" | "approved" | "rejected";
  created_at: string;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, [category, status]);

  const fetchAssets = async () => {
    try {
      let query = supabase.from("assets").select("*");

      if (category !== "all") {
        query = query.eq("category", category);
      }
      
      if (status !== "all") {
        query = query.eq("workflow_status", status);
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

  const handleDownload = (asset: Asset) => {
    const url = `https://wrvkgerfvxijlvxzstnc.supabase.co/storage/v1/object/public/assets/${asset.file_url}`;
    window.open(url, '_blank');
  };

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <Video className="h-8 w-8 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-500" />;
      default:
        return <FileType className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Asset["workflow_status"]) => {
    const variants = {
      draft: "default",
      in_review: "warning",
      approved: "success",
      rejected: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assets Library</h1>
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

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="h-[200px] animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  {getAssetIcon(asset.type)}
                  {getStatusBadge(asset.workflow_status)}
                </div>
                <CardTitle className="text-lg mt-2">{asset.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500 mb-4">{asset.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(asset)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PreviewDialog
        open={!!previewAsset}
        onOpenChange={() => setPreviewAsset(null)}
        asset={previewAsset}
      />
    </div>
  );
}
