
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { stats, recentContent, isLoading } = useDashboardData();
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Loading your data...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Views</CardDescription>
            <CardTitle className="text-3xl">{stats.totalViews.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Across all content
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-3xl">₹{stats.totalEarnings.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Lifetime earnings
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Content Count</CardDescription>
            <CardTitle className="text-3xl">{stats.contentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Total pieces of content
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approval Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.approvalRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Content approval success
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>
              Your earnings from different sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-blue-600"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                    <span className="text-sm font-medium">Views</span>
                  </div>
                  <span className="text-sm font-medium">₹{stats.viewEarnings.toFixed(2)}</span>
                </div>
                <Progress value={stats.totalEarnings > 0 ? (stats.viewEarnings / stats.totalEarnings) * 100 : 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link text-green-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span className="text-sm font-medium">Affiliate</span>
                  </div>
                  <span className="text-sm font-medium">₹{stats.affiliateEarnings.toFixed(2)}</span>
                </div>
                <Progress value={stats.totalEarnings > 0 ? (stats.affiliateEarnings / stats.totalEarnings) * 100 : 0} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">All Time</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                        <p className="text-lg font-medium">₹{stats.totalEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paid Out</p>
                        <p className="text-lg font-medium">₹{stats.totalPaidOut.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-lg font-medium">₹{stats.pendingEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="pt-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">This Month</p>
                        <p className="text-lg font-medium">₹{(stats.totalEarnings * 0.4).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paid Out</p>
                        <p className="text-lg font-medium">₹0.00</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-lg font-medium">₹{(stats.totalEarnings * 0.4).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="weekly" className="pt-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">This Week</p>
                        <p className="text-lg font-medium">₹{(stats.totalEarnings * 0.1).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paid Out</p>
                        <p className="text-lg font-medium">₹0.00</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-lg font-medium">₹{(stats.totalEarnings * 0.1).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Payout Progress</CardTitle>
            <CardDescription>
              ₹{stats.progress.minPayout} minimum • ₹{stats.progress.maxPayout} maximum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current balance</span>
                  <span className="text-sm font-medium">
                    ₹{stats.progress.currentPayout.toFixed(2)}
                  </span>
                </div>
                <div className="relative pt-4">
                  <div className="absolute -top-1 left-0 w-full h-2 rounded-full bg-gray-100"></div>
                  <div className="absolute -top-1 left-0 h-2 rounded-full bg-blue-500" style={{ width: `${(stats.progress.currentPayout / stats.progress.maxPayout) * 100}%` }}></div>
                  <div className="absolute -top-1 left-0 h-2 w-px bg-green-500" style={{ left: `${(stats.progress.minPayout / stats.progress.maxPayout) * 100}%` }}>
                    <div className="absolute -left-1 -top-1 h-4 w-2 bg-green-500 rounded-full"></div>
                    <div className="absolute -left-6 -top-8 bg-green-500 text-white text-xs rounded px-1 py-0.5">Min</div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-200 p-4">
                <h3 className="text-sm font-medium mb-2">Next Payout</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You'll receive your next payout when your balance reaches the minimum threshold of ₹10.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Amount needed:</span>
                  <span className="font-medium">
                    {stats.progress.currentPayout >= stats.progress.minPayout 
                      ? "Eligible for payout!" 
                      : `₹${(stats.progress.minPayout - stats.progress.currentPayout).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>
            Your recent content submissions and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't submitted any content yet. 
              <br/>
              <a href="/dashboard/content/submit" className="text-blue-600 hover:underline">Submit your first content now</a>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Title</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Views</th>
                    <th scope="col" className="px-6 py-3">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((content) => (
                    <tr key={content.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {content.title}
                      </td>
                      <td className="px-6 py-4">
                        {content.status === 'approved' ? (
                          <Badge variant="success" className="bg-green-500">Approved</Badge>
                        ) : (
                          <Badge variant="warning" className="bg-yellow-500">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {content.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        ₹{content.earnings.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
