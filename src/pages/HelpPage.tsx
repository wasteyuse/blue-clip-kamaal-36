
import { useEffect } from 'react';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { CreateTicketForm } from '@/components/support/CreateTicketForm';
import { TicketList } from '@/components/support/TicketList';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function HelpPage() {
  const { tickets, isLoading, fetchTickets, createTicket } = useSupportTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">
          Need help? Create a support ticket and we'll get back to you as soon as possible.
        </p>
      </div>

      {!tickets && !isLoading && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading your tickets. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      <CreateTicketForm onSubmit={createTicket} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
        <TicketList tickets={tickets} isLoading={isLoading} />
      </div>
    </div>
  );
}
