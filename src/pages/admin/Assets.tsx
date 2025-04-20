import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileType, Video, Image as ImageIcon, ShoppingBag, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { addAsset } from "@/lib/api";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form states
  const [assetTitle, setAssetTitle] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetURL, setAssetURL] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addAsset(assetTitle, assetType, assetURL, assetDescription);
      
      toast({
        title: "Success",
        description: "Asset added successfully",
      });

      // Reset form and close dialog
      setAssetTitle("");
      setAssetType("");
      setAssetURL("");
      setAssetDescription("");
      setIsDialogOpen(false);
      
      // Refresh assets list
      fetchAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteAsset(assetId: string) {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      
      // Update local state
      setAssets(assets.filter(asset => asset.id !== assetId));
      
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

  const getAssetTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'product':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      default:
        return <FileType className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAssets = searchTerm
    ? assets.filter(asset => 
        asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : assets;

  if (isLoading || !isAdmin) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl font-bold">Asset Manager</h1>
        </div>
        <div className="flex gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Asset</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Add a new asset to be used by creators for content creation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Asset Title</Label>
                  <Input
                    id="title"
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    placeholder="Enter asset title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Asset Type</Label>
                  <Select
                    value={assetType}
                    onValueChange={setAssetType}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Asset URL</Label>
                  <Input
                    id="url"
                    value={assetURL}
                    onChange={(e) => setAssetURL(e.target.value)}
                    placeholder="Enter asset URL"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Asset Description</Label>
                  <Textarea
                    id="description"
                    value={assetDescription}
                    onChange={(e) => setAssetDescription(e.target.value)}
                    placeholder="Enter asset description"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Asset'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button onClick={fetchAssets} variant="outline">Refresh</Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search assets by title, type or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isTableLoading ? (
        <div className="text-center py-4">Loading assets data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAssetTypeIcon(asset.type)}
                        <span className="capitalize">{asset.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{asset.description}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a 
                        href={asset.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {asset.file_url}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteAsset(asset.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No assets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
