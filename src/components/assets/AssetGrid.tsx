
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileType, Video, Image as ImageIcon } from "lucide-react";
import { WorkflowActions } from "@/components/assets/WorkflowActions";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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

interface AssetGridProps {
  assets: Asset[];
  loading: boolean;
  isAdmin: boolean;
  onPreview: (asset: Asset) => void;
  onStatusChange: () => void;
}

export function AssetGrid({ assets, loading, isAdmin, onPreview, onStatusChange }: AssetGridProps) {
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

  const getStatusBadge = (status: WorkflowStatus) => {
    const variants: Record<WorkflowStatus, "default" | "destructive" | "warning" | "success" | "secondary" | "outline"> = {
      draft: "default",
      in_review: "warning",
      approved: "success",
      rejected: "destructive",
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="h-[200px] animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border rounded-md">
        No assets found
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="p-4">
            <div className="flex items-start justify-between">
              {getAssetIcon(asset.type)}
              {getStatusBadge(asset.workflow_status)}
            </div>
            <CardTitle className="text-lg mt-2 line-clamp-1">{asset.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{asset.description}</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(asset)}
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
              {isAdmin && (
                <WorkflowActions
                  assetId={asset.id}
                  currentStatus={asset.workflow_status}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
