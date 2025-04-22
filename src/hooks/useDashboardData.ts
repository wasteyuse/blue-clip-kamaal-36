
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DashboardStats {
  totalViews: number;
  totalEarnings: number;
  pendingEarnings: number;
  totalPaidOut: number;
  affiliateEarnings: number;
  viewEarnings: number;
  contentCount: number;
  approvalRate: number;
  progress: {
    currentPayout: number;
    minPayout: number;
    maxPayout: number;
  };
}

export interface ContentItem {
  id: string;
  title: string;
  status: string;
  views: number;
  earnings: number;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    totalPaidOut: 0,
    affiliateEarnings: 0,
    viewEarnings: 0,
    contentCount: 0,
    approvalRate: 0,
    progress: {
      currentPayout: 0,
      minPayout: 10,
      maxPayout: 500
    }
  });
  
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);

  // Fetch user profile data with earnings and views
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('total_earnings, total_views')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch user's content submissions
  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ['userContent', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch payouts data to calculate paid out amount
  const { data: payoutsData, isLoading: isPayoutsLoading } = useQuery({
    queryKey: ['userPayouts', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('payouts')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'paid');

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Setup real-time subscription for profile updates
  useEffect(() => {
    if (!user) return;

    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          // Update profile stats when changes occur
          const updatedProfile = payload.new;
          if (updatedProfile) {
            setStats(prev => ({
              ...prev,
              totalViews: updatedProfile.total_views || 0,
              totalEarnings: updatedProfile.total_earnings || 0,
              progress: {
                ...prev.progress,
                currentPayout: updatedProfile.total_earnings || 0
              }
            }));
            toast.info('Your earnings have been updated');
          }
        }
      )
      .subscribe();

    // Setup real-time subscription for submissions updates
    const submissionsChannel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch content data when submissions are updated
          supabase
            .from('submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(4)
            .then(({ data, error }) => {
              if (!error && data) {
                const formattedContent = data.map(item => ({
                  id: item.id,
                  title: item.content_url?.split('/').pop() || 'Untitled Content',
                  status: item.status || 'pending',
                  views: item.views || 0,
                  earnings: item.earnings || 0
                }));
                setRecentContent(formattedContent);
                
                // Update content count
                setStats(prev => ({
                  ...prev,
                  contentCount: formattedContent.length
                }));
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(submissionsChannel);
    };
  }, [user]);

  // Process and update the stats when data is fetched
  useEffect(() => {
    if (!profileData) return;

    const totalEarnings = profileData.total_earnings || 0;
    const totalViews = profileData.total_views || 0;
    
    // Calculate paid out amount from payouts data
    const totalPaidOut = payoutsData ? 
      payoutsData.reduce((sum, payout) => sum + (payout.amount || 0), 0) : 0;
    
    // Assuming pending earnings is the difference between total and paid out
    const pendingEarnings = Math.max(0, totalEarnings - totalPaidOut);
    
    // Process content data
    const processedContent = contentData ? 
      contentData.map(item => ({
        id: item.id,
        title: item.content_url?.split('/').pop() || 'Untitled Content',
        status: item.status || 'pending',
        views: item.views || 0,
        earnings: item.earnings || 0
      })) : [];
    
    // Calculate approval rate
    const approvedContent = contentData ? 
      contentData.filter(item => item.status === 'approved').length : 0;
    const approvalRate = contentData && contentData.length > 0 ? 
      Math.round((approvedContent / contentData.length) * 100) : 0;
    
    // Calculate earnings breakdown (sample logic - adjust based on your business rules)
    const affiliateEarnings = contentData ? 
      contentData.reduce((sum, item) => sum + (item.affiliate_conversions || 0), 0) : 0;
    const viewEarnings = totalEarnings - affiliateEarnings;
    
    // Update the stats state
    setStats({
      totalViews,
      totalEarnings,
      pendingEarnings,
      totalPaidOut,
      affiliateEarnings,
      viewEarnings,
      contentCount: processedContent.length,
      approvalRate,
      progress: {
        currentPayout: pendingEarnings,
        minPayout: 10,
        maxPayout: 500
      }
    });
    
    setRecentContent(processedContent);
  }, [profileData, contentData, payoutsData]);

  return {
    stats,
    recentContent,
    isLoading: isProfileLoading || isContentLoading || isPayoutsLoading
  };
}
