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

export interface WeeklyTrend {
  week: string;
  expenses: number;
  income: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  description?: string;
  targetDate?: Date;
  createdDate: Date;
  completed: boolean;
}