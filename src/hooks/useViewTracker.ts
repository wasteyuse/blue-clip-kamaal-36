
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useViewTracker = () => {
  const [isTracking, setIsTracking] = useState(false);

  const trackView = async (submissionId: string) => {
    // Prevent duplicate tracking in a single session
    const viewedSubmissions = JSON.parse(localStorage.getItem('viewedSubmissions') || '{}');
    const timeNow = Date.now();
    
    // Only track if not viewed in the last hour
    if (viewedSubmissions[submissionId] && (timeNow - viewedSubmissions[submissionId]) < 3600000) {
      return;
    }
    
    setIsTracking(true);
    try {
      const { data, error } = await supabase.functions.invoke('track-view', {
        body: { submissionId }
      });

      if (error) throw error;
      
      // Save to localStorage to prevent multiple views in short period
      viewedSubmissions[submissionId] = timeNow;
      localStorage.setItem('viewedSubmissions', JSON.stringify(viewedSubmissions));
      
      return data;
    } catch (error) {
      console.error('Error tracking view:', error);
    } finally {
      setIsTracking(false);
    }
  };

  return { trackView, isTracking };
};
