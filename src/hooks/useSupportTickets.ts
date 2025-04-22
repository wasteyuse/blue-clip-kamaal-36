
import { useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket } from '@/types/support';
import { useToast } from '@/hooks/use-toast';

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch support tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createTicket = async (subject: string, message: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({ subject, message });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Support ticket created successfully"
      });
      
      await fetchTickets();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    tickets,
    isLoading,
    fetchTickets,
    createTicket
  };
}
