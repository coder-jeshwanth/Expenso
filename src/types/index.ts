export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  type: TransactionType;
  category?: string;
  source?: string;
  notes?: string;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

export interface DailyExpense {
  date: string;
  amount: number;
}