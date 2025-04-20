
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AssetType = "video" | "image" | "product";

export function UploadForm({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<AssetType>("video");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const filePath = `${type}s/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("assets").insert({
        title: file.name,
        type,
        file_url: `${filePath}`,
        description: `${type} asset: ${file.name}`,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Asset uploaded successfully",
      });
      
      onUploadComplete();
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload asset",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="space-y-2">
        <Label htmlFor="assetType">Asset Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as AssetType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select asset type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="product">Product (ZIP/PDF)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? "Uploading..." : "Upload Asset"}
      </Button>
    </div>
  );
}
