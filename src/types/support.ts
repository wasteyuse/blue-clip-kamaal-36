
export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved' | 'closed';
  reply?: string;
  created_at: string;
  updated_at: string;
}
