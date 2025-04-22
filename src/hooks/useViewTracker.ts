
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useViewTracker = () => {
  const [isTracking, setIsTracking] = useState(false);

  const trackView = async (submissionId: string, isAffiliate: boolean = false) => {
    // Prevent duplicate tracking in a single session
    const viewedSubmissions = JSON.parse(localStorage.getItem('viewedSubmissions') || '{}');
    const timeNow = Date.now();
    
    // Only track if not viewed in the last hour
    if (viewedSubmissions[submissionId] && (timeNow - viewedSubmissions[submissionId]) < 3600000) {
      return;
    }
    
    setIsTracking(true);
    try {
      // Use track-view edge function to handle the view
      const { data, error } = await supabase.functions.invoke('track-view', {
        body: { submissionId, isAffiliate }
      });

      if (error) throw error;
      
      // Save to localStorage to prevent multiple views in short period
      viewedSubmissions[submissionId] = timeNow;
      localStorage.setItem('viewedSubmissions', JSON.stringify(viewedSubmissions));

      if (isAffiliate) {
        // Track affiliate click using RPC function
        await supabase.rpc('increment_affiliate_click', { sub_id: submissionId });
      }
      
      return data;
    } catch (error) {
      console.error('Error tracking view:', error);
      toast.error('Error tracking view');
    } finally {
      setIsTracking(false);
    }
  };

  return { trackView, isTracking };
};
