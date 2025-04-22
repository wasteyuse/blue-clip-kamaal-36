
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type Submission = {
  id: string;
  // Making title optional since it doesn't exist in the database structure
  title?: string; 
  content_url: string;
  status: string;
  created_at: string;
  views: number;
  earnings: number;
  reason?: string;
  // Additional fields from Supabase
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
  const { toast } = useToast();
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
          console.log('Change received!', payload);
          fetchSubmissions();
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
      toast({
        variant: "destructive",
        title: "Error fetching content",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingContent = submissions.filter(sub => sub.status === 'pending');
  const approvedContent = submissions.filter(sub => sub.status === 'approved');
  const rejectedContent = submissions.filter(sub => sub.status === 'rejected');

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
                {submissions.map((content) => (
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
                        {content.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <CardDescription>
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      {content.status === 'approved' && (
                        <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                      )}
                      {content.status === 'rejected' && content.reason && (
                        <span className="text-sm text-red-500">Reason: {content.reason}</span>
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
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      {content.status === 'approved' && (
                        <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                      )}
                      {content.status === 'rejected' && content.reason && (
                        <span className="text-sm text-red-500">Reason: {content.reason}</span>
                      )}
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
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      {content.status === 'approved' && (
                        <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                      )}
                      {content.status === 'rejected' && content.reason && (
                        <span className="text-sm text-red-500">Reason: {content.reason}</span>
                      )}
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
                        {new Date(content.created_at).toLocaleDateString()}
                        {content.views > 0 && ` • ${content.views.toLocaleString()} views`}
                        {content.reason && (
                          <div className="mt-1 text-xs text-red-500">
                            Reason: {content.reason}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(content.content_url, '_blank')}>
                        View Content
                      </Button>
                      {content.status === 'approved' && (
                        <span className="text-sm font-medium">₹{content.earnings?.toFixed(2) || '0.00'}</span>
                      )}
                      {content.status === 'rejected' && content.reason && (
                        <span className="text-sm text-red-500">Reason: {content.reason}</span>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
