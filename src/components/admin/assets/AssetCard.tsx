
import { FileType, Video, Image as ImageIcon, Package, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssetCardProps {
  asset: {
    id: string;
    title: string;
    type: string;
    file_url: string;
    description: string;
  };
  onDelete: (id: string) => void;
}

export function AssetCard({ asset, onDelete }: AssetCardProps) {
  const getAssetTypeIcon = () => {
    switch(asset.type?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'product':
        return <Package className="h-4 w-4 text-purple-500" />;
      default:
        return <FileType className="h-4 w-4 text-gray-500" />;
    }
  };

  const fileUrl = `https://wrvkgerfvxijlvxzstnc.supabase.co/storage/v1/object/public/assets/${asset.file_url}`;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {asset.type}
          </Badge>
          {getAssetTypeIcon()}
        </div>
        <CardTitle className="text-base">{asset.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 truncate">{asset.description}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noreferrer">
            View
          </a>
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(asset.id)}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
