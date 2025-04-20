
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AssetsPage() {
  // Mock data - would come from Supabase in production
  const videoAssets = [
    { id: 1, title: "Indian Street Food B-Roll", format: "MP4", duration: "1:24", size: "48MB", category: "Food" },
    { id: 2, title: "Mumbai Skyline Timelapse", format: "MP4", duration: "0:45", size: "35MB", category: "Travel" },
    { id: 3, title: "Indian Wedding Ceremony", format: "MP4", duration: "2:10", size: "112MB", category: "Culture" },
    { id: 4, title: "Taj Mahal Aerial View", format: "MP4", duration: "1:05", size: "78MB", category: "Travel" },
  ];
  
  const imageAssets = [
    { id: 5, title: "Indian Cuisine Collection", format: "ZIP", count: "25 images", size: "64MB", category: "Food" },
    { id: 6, title: "Indian Traditional Fabrics", format: "ZIP", count: "18 images", size: "42MB", category: "Fashion" },
    { id: 7, title: "Rajasthan Architecture", format: "ZIP", count: "30 images", size: "76MB", category: "Travel" },
  ];
  
  const documentAssets = [
    { id: 8, title: "Indian Recipe Collection", format: "PDF", pages: "24 pages", size: "12MB", category: "Food" },
    { id: 9, title: "India Travel Guide", format: "PDF", pages: "45 pages", size: "18MB", category: "Travel" },
    { id: 10, title: "Affiliate Marketing Best Practices", format: "PDF", pages: "12 pages", size: "8MB", category: "Marketing" },
  ];

  const assetCategories = ["All", "Food", "Travel", "Culture", "Fashion", "Marketing"];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assets Library</h1>
        <p className="text-gray-600">
          Browse and use admin-provided assets for your content creation
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <select className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" defaultValue="All Categories">
            <option value="All Categories">All Categories</option>
            {assetCategories.map((category) => (
              category !== "All" && <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button variant="secondary">Filter</Button>
        </div>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download Assets
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videoAssets.length})</TabsTrigger>
          <TabsTrigger value="images">Images & Documents ({imageAssets.length + documentAssets.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...videoAssets, ...imageAssets, ...documentAssets].map((asset: any) => (
              <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  {asset.format === "MP4" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-blue-600 opacity-50"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                  )}
                  {asset.format === "ZIP" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-blue-600 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  )}
                  {asset.format === "PDF" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text text-blue-600 opacity-50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="blue">{asset.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>
                    {asset.format} • {asset.size}
                    {asset.duration && ` • ${asset.duration}`}
                    {asset.count && ` • ${asset.count}`}
                    {asset.pages && ` • ${asset.pages}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">Preview</Button>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoAssets.map((asset) => (
              <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-blue-600 opacity-50"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                  <div className="absolute top-2 right-2">
                    <Badge variant="blue">{asset.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>
                    {asset.format} • {asset.size} • {asset.duration}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">Preview</Button>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...imageAssets, ...documentAssets].map((asset) => (
              <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  {asset.format === "ZIP" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-blue-600 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  )}
                  {asset.format === "PDF" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text text-blue-600 opacity-50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="blue">{asset.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{asset.title}</CardTitle>
                  <CardDescription>
                    {asset.format} • {asset.size}
                    {('count' in asset) && ` • ${asset.count}`}
                    {('pages' in asset) && ` • ${asset.pages}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">Preview</Button>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
