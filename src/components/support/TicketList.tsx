
import { SupportTicket } from '@/types/support';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TicketListProps {
  tickets: SupportTicket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">{ticket.subject}</h3>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-4">{ticket.message}</p>
          
          {ticket.reply && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-medium text-sm text-blue-800 mb-2">Admin Response:</p>
              <p className="text-blue-900">{ticket.reply}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">
            Created: {format(new Date(ticket.created_at), 'PPP')}
          </p>
        </div>
      ))}
    </div>
  );
}
