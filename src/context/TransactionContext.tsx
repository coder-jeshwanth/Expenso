import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, CategoryExpense, DailyExpense } from '../types';
import { format, subDays } from 'date-fns';

// Mock data for our app
const generateMockTransactions = (): Transaction[] => {
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health'];
  const sources = ['Salary', 'Freelance', 'Gift', 'Refund', 'Other'];
  const today = new Date();
  
  return [
    // Credits (Income)
    {
      id: '1',
      amount: 5000,
      date: subDays(today, 15),
      type: 'credit',
      source: 'Salary',
      notes: 'Monthly salary'
    },
    {
      id: '2',
      amount: 1200,
      date: subDays(today, 10),
      type: 'credit',
      source: 'Freelance',
      notes: 'Website design project'
    },
    {
      id: '3',
      amount: 300,
      date: subDays(today, 5),
      type: 'credit',
      source: 'Refund',
      notes: 'Product return refund'
    },
    
    // Debits (Expenses)
    {
      id: '4',
      amount: 120,
      date: subDays(today, 12),
      type: 'debit',
      category: 'Food',
      notes: 'Groceries'
    },
    {
      id: '5',
      amount: 500,
      date: subDays(today, 9),
      type: 'debit',
      category: 'Bills',
      notes: 'Electricity bill'
    },
    {
      id: '6',
      amount: 200,
      date: subDays(today, 7),
      type: 'debit',
      category: 'Transport',
      notes: 'Fuel'
    },
    {
      id: '7',
      amount: 350,
      date: subDays(today, 4),
      type: 'debit',
      category: 'Shopping',
      notes: 'New clothes'
    },
    {
      id: '8',
      amount: 80,
      date: subDays(today, 3),
      type: 'debit',
      category: 'Entertainment',
      notes: 'Movie tickets'
    },
    {
      id: '9',
      amount: 150,
      date: subDays(today, 2),
      type: 'debit',
      category: 'Food',
      notes: 'Restaurant dinner'
    },
    {
      id: '10',
      amount: 300,
      date: subDays(today, 1),
      type: 'debit',
      category: 'Health',
      notes: 'Medicine'
    },
  ];
};

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getCurrentBalance: () => number;
  getCategoryExpenses: () => CategoryExpense[];
  getDailyExpenses: () => DailyExpense[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions());

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions([...transactions, newTransaction]);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCurrentBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  // For the pie chart - category-wise expense distribution
  const getCategoryExpenses = (): CategoryExpense[] => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'debit' && t.category)
      .forEach(t => {
        const category = t.category as string;
        const currentAmount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentAmount + t.amount);
      });
      
    // Colors for the categories
    const colors = [
      '#6366F1', // Indigo
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#14B8A6', // Teal
    ];
    
    return Array.from(categoryMap).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length]
    }));
  };

  // For the bar chart - daily expense trends
  const getDailyExpenses = (): DailyExpense[] => {
    const dailyMap = new Map<string, number>();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyMap.set(date, 0);
    }
    
    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        const date = format(t.date, 'yyyy-MM-dd');
        if (dailyMap.has(date)) {
          const currentAmount = dailyMap.get(date) || 0;
          dailyMap.set(date, currentAmount + t.amount);
        }
      });
    
    return Array.from(dailyMap).map(([date, amount]) => ({
      date: format(new Date(date), 'MMM dd'),
      amount
    }));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTotalIncome,
        getTotalExpenses,
        getCurrentBalance,
        getCategoryExpenses,
        getDailyExpenses
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};