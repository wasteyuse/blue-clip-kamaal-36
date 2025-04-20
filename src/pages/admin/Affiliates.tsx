import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Handshake, BarChart, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliatesPage() {
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliateLinks();
  }, []);

  async function fetchAffiliateLinks() {
    setIsTableLoading(true);
    try {
      // Get all affiliate links from product submissions
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .eq('type', 'product')
        .not('affiliate_link', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAffiliateLinks(data || []);
      
      // Calculate stats
      const totalLinks = data?.length || 0;
      const totalClicks = data?.reduce((sum, item) => sum + (item.affiliate_clicks || 0), 0) || 0;
      const totalConversions = data?.reduce((sum, item) => sum + (item.affiliate_conversions || 0), 0) || 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
      
      setStats({
        totalLinks,
        totalClicks,
        totalConversions,
        conversionRate,
      });
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  }

  const filteredLinks = searchTerm
    ? affiliateLinks.filter(link => 
        link.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        link.content_url?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : affiliateLinks;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-indigo-500" />
          <h1 className="text-3xl font-bold">Affiliate System</h1>
        </div>
        <Button onClick={fetchAffiliateLinks} variant="outline">Refresh</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search affiliate links by creator or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isTableLoading ? (
        <div className="text-center py-4">Loading affiliate data...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Affiliate Link</TableHead>
                <TableHead>Original Content</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.profiles?.name || 'Unknown Creator'}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      <a 
                        href={link.affiliate_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.affiliate_link}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      <a 
                        href={link.content_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.content_url}
                      </a>
                    </TableCell>
                    <TableCell>
                      {link.created_at ? format(new Date(link.created_at), 'PPP') : 'Unknown'}
                    </TableCell>
                    <TableCell>{link.affiliate_clicks || 0}</TableCell>
                    <TableCell>{link.affiliate_conversions || 0}</TableCell>
                    <TableCell>
                      {link.affiliate_clicks > 0 
                        ? ((link.affiliate_conversions || 0) / link.affiliate_clicks * 100).toFixed(2) 
                        : 0}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No affiliate links found
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
