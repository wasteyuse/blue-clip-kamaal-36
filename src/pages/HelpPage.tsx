
import { useEffect } from 'react';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { CreateTicketForm } from '@/components/support/CreateTicketForm';
import { TicketList } from '@/components/support/TicketList';

export default function HelpPage() {
  const { tickets, isLoading, fetchTickets, createTicket } = useSupportTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">
          Need help? Create a support ticket and we'll get back to you as soon as possible.
        </p>
      </div>

      <CreateTicketForm onSubmit={createTicket} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading tickets...</p>
        ) : tickets.length > 0 ? (
          <TicketList tickets={tickets} />
        ) : (
          <p className="text-gray-600">You haven't created any support tickets yet.</p>
        )}
      </div>
    </div>
  );
}
