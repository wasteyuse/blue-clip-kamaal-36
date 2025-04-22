
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Submission = {
  id: string;
  content_url: string;
  status: string;
  created_at: string;
  views: number;
  earnings: number;
  reason?: string;
  asset_used?: string;
  type?: string;
  user_id?: string;
  affiliate_clicks?: number;
  affiliate_conversions?: number;
  affiliate_link?: string;
};

export default function ContentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;

    // Fetch initial submissions
    fetchSubmissions();

    // Set up real-time listener
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Content submission change received:', payload);
          fetchSubmissions();
          
          // Show toast notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const statusMap: {[key: string]: {message: string, type: "success" | "error" | "info"}} = {
              'approved': { 
                message: 'Your content has been approved! You can now start earning.', 
                type: 'success' 
              },
              'rejected': { 
                message: `Your content was rejected. ${payload.new.reason ? `Reason: ${payload.new.reason}` : ''}`, 
                type: 'error' 
              }
            };
            
            const notification = statusMap[payload.new.status];
            if (notification) {
              toast[notification.type](notification.message);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Submission type
      // Using content_url as title if title is not available
      const formattedData = data?.map(item => ({
        ...item,
        title: item.content_url.split('/').pop() || 'Untitled Content'
      }));
      
      setSubmissions(formattedData || []);
    } catch (error: any) {
      toast.error("Error fetching content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingContent = submissions.filter(sub => sub.status === 'pending');
  const approvedContent = submissions.filter(sub => sub.status === 'approved');
  const rejectedContent = submissions.filter(sub => sub.status === 'rejected');

  // Function to get badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

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
        <Button onClick={() => navigate("/dashboard/submit")}>
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
        
        {loading ? (
          <div className="pt-6">
            <p className="text-center text-gray-500">Loading your content...</p>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.length > 0 ? submissions.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src="/placeholder.svg" 
                        alt={content.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(content.status)}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0">
                      {content.asset_used && (
                        <p className="text-xs text-gray-500">
                          Using asset: {content.asset_used}
                        </p>
                      )}
                      {content.status === 'rejected' && content.reason && (
                        <p className="mt-2 text-xs text-red-500">
                          Rejection reason: {content.reason}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      {content.status === 'approved' && (
                        <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                      )}
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't submitted any content yet</p>
                    <Button onClick={() => navigate("/dashboard/submit")}>
                      Submit Your First Content
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingContent.length > 0 ? pendingContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src="/placeholder.svg" 
                        alt={content.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        Submitted on {new Date(content.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0">
                      {content.asset_used && (
                        <p className="text-xs text-gray-500">
                          Using asset: {content.asset_used}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No pending content submissions</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="approved" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedContent.length > 0 ? approvedContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src="/placeholder.svg" 
                        alt={content.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0">
                      {content.asset_used && (
                        <p className="text-xs text-gray-500">
                          Using asset: {content.asset_used}
                        </p>
                      )}
                      {content.type === 'product' && content.affiliate_link && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Affiliate Stats:</p>
                          <p className="text-xs text-gray-500">
                            Clicks: {content.affiliate_clicks || 0} • 
                            Conversions: {content.affiliate_conversions || 0}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No approved content yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedContent.length > 0 ? rejectedContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src="/placeholder.svg" 
                        alt={content.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        {new Date(content.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0">
                      {content.asset_used && (
                        <p className="text-xs text-gray-500">
                          Using asset: {content.asset_used}
                        </p>
                      )}
                      {content.reason && (
                        <p className="mt-2 text-xs text-red-500">
                          Rejection reason: {content.reason}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/submit")}>
                        Try Again
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No rejected content</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
