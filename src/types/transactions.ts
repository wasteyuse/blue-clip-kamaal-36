
export type TransactionType = 'earning' | 'affiliate' | 'payout';
export type TransactionStatus = 'pending' | 'approved' | 'paid' | 'failed';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  source?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    name?: string;
  };
}
