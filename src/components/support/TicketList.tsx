
import { SupportTicket } from '@/types/support';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";

interface TicketListProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
}

export function TicketList({ tickets, isLoading }: TicketListProps) {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No tickets found.</p>
      </div>
    );
  }

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
