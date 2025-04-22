
import { useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket } from '@/types/support';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the status is one of the allowed types defined in the SupportTicket interface
      const typedTickets = (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as 'open' | 'resolved' | 'closed'
      })) as SupportTicket[];
      
      setTickets(typedTickets);
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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a ticket",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({ 
          subject, 
          message,
          user_id: user.id,
          status: 'open'
        });

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
