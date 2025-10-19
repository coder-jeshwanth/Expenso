import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, CategoryExpense, DailyExpense, WeeklyTrend } from '../types';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

// Mock data for our app - 40 transactions
const generateMockTransactions = (): Transaction[] => {
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health'];
  const sources = ['Salary', 'Freelance', 'Gift', 'Refund', 'Investment', 'Bonus'];
  const today = new Date();
  
  return [
    // Credits (Income) - 12 transactions
    { id: '1', amount: 75000, date: subDays(today, 30), type: 'credit', source: 'Salary', notes: 'Monthly salary payment' },
    { id: '2', amount: 15000, date: subDays(today, 28), type: 'credit', source: 'Freelance', notes: 'Web development project' },
    { id: '3', amount: 5000, date: subDays(today, 25), type: 'credit', source: 'Bonus', notes: 'Performance bonus' },
    { id: '4', amount: 2500, date: subDays(today, 22), type: 'credit', source: 'Investment', notes: 'Dividend payment' },
    { id: '5', amount: 800, date: subDays(today, 20), type: 'credit', source: 'Refund', notes: 'Insurance claim refund' },
    { id: '6', amount: 3000, date: subDays(today, 18), type: 'credit', source: 'Gift', notes: 'Birthday gift money' },
    { id: '7', amount: 12000, date: subDays(today, 15), type: 'credit', source: 'Freelance', notes: 'Mobile app development' },
    { id: '8', amount: 1200, date: subDays(today, 12), type: 'credit', source: 'Refund', notes: 'Product return refund' },
    { id: '9', amount: 8500, date: subDays(today, 10), type: 'credit', source: 'Freelance', notes: 'Logo design project' },
    { id: '10', amount: 4500, date: subDays(today, 8), type: 'credit', source: 'Investment', notes: 'Stock profit' },
    { id: '11', amount: 2000, date: subDays(today, 5), type: 'credit', source: 'Gift', notes: 'Festival money' },
    { id: '12', amount: 6000, date: subDays(today, 2), type: 'credit', source: 'Bonus', notes: 'Project completion bonus' },

    // Debits (Expenses) - 28 transactions
    { id: '13', amount: 15000, date: subDays(today, 29), type: 'debit', category: 'Bills', notes: 'House rent payment' },
    { id: '14', amount: 3500, date: subDays(today, 27), type: 'debit', category: 'Food', notes: 'Monthly groceries' },
    { id: '15', amount: 2200, date: subDays(today, 26), type: 'debit', category: 'Bills', notes: 'Electricity bill' },
    { id: '16', amount: 800, date: subDays(today, 25), type: 'debit', category: 'Transport', notes: 'Fuel for car' },
    { id: '17', amount: 1500, date: subDays(today, 24), type: 'debit', category: 'Entertainment', notes: 'Concert tickets' },
    { id: '18', amount: 4200, date: subDays(today, 23), type: 'debit', category: 'Shopping', notes: 'New laptop accessories' },
    { id: '19', amount: 650, date: subDays(today, 22), type: 'debit', category: 'Food', notes: 'Restaurant dinner' },
    { id: '20', amount: 1800, date: subDays(today, 21), type: 'debit', category: 'Health', notes: 'Medical checkup' },
    { id: '21', amount: 900, date: subDays(today, 20), type: 'debit', category: 'Bills', notes: 'Internet bill' },
    { id: '22', amount: 2500, date: subDays(today, 19), type: 'debit', category: 'Shopping', notes: 'Clothing purchase' },
    { id: '23', amount: 450, date: subDays(today, 18), type: 'debit', category: 'Transport', notes: 'Taxi fare' },
    { id: '24', amount: 750, date: subDays(today, 17), type: 'debit', category: 'Food', notes: 'Weekly groceries' },
    { id: '25', amount: 3200, date: subDays(today, 16), type: 'debit', category: 'Bills', notes: 'Credit card payment' },
    { id: '26', amount: 180, date: subDays(today, 15), type: 'debit', category: 'Entertainment', notes: 'Movie tickets' },
    { id: '27', amount: 520, date: subDays(today, 14), type: 'debit', category: 'Food', notes: 'Food delivery' },
    { id: '28', amount: 1100, date: subDays(today, 13), type: 'debit', category: 'Transport', notes: 'Car maintenance' },
    { id: '29', amount: 2800, date: subDays(today, 12), type: 'debit', category: 'Shopping', notes: 'Electronics purchase' },
    { id: '30', amount: 350, date: subDays(today, 11), type: 'debit', category: 'Health', notes: 'Pharmacy medicines' },
    { id: '31', amount: 1400, date: subDays(today, 10), type: 'debit', category: 'Bills', notes: 'Phone bill' },
    { id: '32', amount: 680, date: subDays(today, 9), type: 'debit', category: 'Entertainment', notes: 'Gaming subscription' },
    { id: '33', amount: 920, date: subDays(today, 8), type: 'debit', category: 'Food', notes: 'Coffee and snacks' },
    { id: '34', amount: 1600, date: subDays(today, 7), type: 'debit', category: 'Transport', notes: 'Monthly bus pass' },
    { id: '35', amount: 3500, date: subDays(today, 6), type: 'debit', category: 'Shopping', notes: 'Home decoration items' },
    { id: '36', amount: 280, date: subDays(today, 5), type: 'debit', category: 'Food', notes: 'Lunch at office' },
    { id: '37', amount: 1250, date: subDays(today, 4), type: 'debit', category: 'Health', notes: 'Gym membership' },
    { id: '38', amount: 450, date: subDays(today, 3), type: 'debit', category: 'Entertainment', notes: 'Book purchase' },
    { id: '39', amount: 720, date: subDays(today, 2), type: 'debit', category: 'Bills', notes: 'Water bill' },
    { id: '40', amount: 1800, date: subDays(today, 1), type: 'debit', category: 'Shopping', notes: 'Gift for friend' },
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
  getWeeklyTrends: () => WeeklyTrend[];
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

  // For the bar chart - weekly trends with both income and expenses
  const getWeeklyTrends = (): WeeklyTrend[] => {
    const weeklyMap = new Map<string, { expenses: number; income: number }>();
    
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 }); // Monday as start of week
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      const weekLabel = `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`;
      
      weeklyMap.set(weekKey, { expenses: 0, income: 0 });
    }
    
    // Process all transactions
    transactions.forEach(t => {
      const transactionWeekStart = startOfWeek(t.date, { weekStartsOn: 1 });
      const weekKey = format(transactionWeekStart, 'yyyy-MM-dd');
      
      if (weeklyMap.has(weekKey)) {
        const weekData = weeklyMap.get(weekKey)!;
        if (t.type === 'debit') {
          weekData.expenses += t.amount;
        } else if (t.type === 'credit') {
          weekData.income += t.amount;
        }
        weeklyMap.set(weekKey, weekData);
      }
    });
    
    return Array.from(weeklyMap).map(([weekKey, data]) => {
      const weekStart = new Date(weekKey);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      return {
        week: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'dd')}`,
        expenses: data.expenses,
        income: data.income
      };
    });
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
        getDailyExpenses,
        getWeeklyTrends
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};