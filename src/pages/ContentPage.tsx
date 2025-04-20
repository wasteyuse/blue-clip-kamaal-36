
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ContentPage() {
  // Mock data - would come from Supabase in production
  const pendingContent = [
    { id: 1, title: "Yoga Basics for Beginners", submittedDate: "2023-04-15", status: "pending" },
    { id: 2, title: "Indian Spices Guide", submittedDate: "2023-04-14", status: "pending" },
  ];
  
  const approvedContent = [
    { id: 3, title: "Top 10 Indian Street Foods", status: "approved", views: 34500, earnings: 34.5 },
    { id: 4, title: "Mumbai City Travel Guide", status: "approved", views: 28000, earnings: 28.0 },
    { id: 5, title: "Traditional Indian Clothing", status: "approved", views: 15500, earnings: 15.5 },
    { id: 6, title: "Delhi Historical Sites", status: "approved", views: 12300, earnings: 12.3 },
  ];
  
  const rejectedContent = [
    { id: 7, title: "Indian Political News", rejectedDate: "2023-03-20", reason: "Content too political/controversial" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Content</h1>
        <p className="text-gray-600">
          Manage your content submissions and track their performance
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="secondary">Filter</Button>
          <Button variant="secondary">Sort</Button>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Create New Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingContent.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedContent.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedContent.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...pendingContent, ...approvedContent, ...rejectedContent].map((content: any) => (
              <Card key={content.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="/placeholder.svg" 
                    alt={content.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {content.status === 'pending' && <Badge variant="warning">Pending</Badge>}
                    {content.status === 'approved' && <Badge variant="success">Approved</Badge>}
                    {content.reason && <Badge variant="destructive">Rejected</Badge>}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>
                    {content.submittedDate && `Submitted: ${content.submittedDate}`}
                    {content.views && `Views: ${content.views.toLocaleString()}`}
                    {content.rejectedDate && `Rejected: ${content.rejectedDate}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                  {content.status === 'approved' && (
                    <span className="text-sm font-medium">₹{content.earnings.toFixed(2)}</span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingContent.map((content) => (
              <Card key={content.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="/placeholder.svg" 
                    alt={content.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>
                    Submitted: {content.submittedDate}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedContent.map((content) => (
              <Card key={content.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="/placeholder.svg" 
                    alt={content.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="success">Approved</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>
                    Views: {content.views.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                  <span className="text-sm font-medium">₹{content.earnings.toFixed(2)}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedContent.map((content) => (
              <Card key={content.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="/placeholder.svg" 
                    alt={content.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive">Rejected</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>
                    Rejected: {content.rejectedDate}
                    <div className="mt-1 text-xs text-red-500">
                      Reason: {content.reason}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Resubmit</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
