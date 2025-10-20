import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, CategoryExpense, DailyExpense, WeeklyTrend, Goal, Investment } from '../types';
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
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addInvestmentToGoal: (goalId: string, investment: Omit<Investment, 'id'>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getCurrentBalance: () => number;
  getCategoryExpenses: (selectedYear?: number, selectedMonth?: number) => CategoryExpense[];
  getDailyExpenses: () => DailyExpense[];
  getWeeklyTrends: () => WeeklyTrend[];
  getMonthlyExpenses: (selectedYear?: number) => { month: string; total: number; year: number }[];
  getAvailableYears: () => number[];
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

// Mock goals data
const generateMockGoals = (): Goal[] => {
  const today = new Date();
  return [
    {
      id: '1',
      name: 'New Laptop',
      targetAmount: 80000,
      currentAmount: 25000,
      category: 'Electronics',
      description: 'Gaming laptop for development work',
      targetDate: new Date(2025, 11, 31), // December 31, 2025
      createdDate: new Date(2025, 8, 1), // September 1, 2025
      completed: false,
      investments: [
        {
          id: 'inv1',
          amount: 15000,
          date: subDays(today, 20),
          notes: 'Initial investment from salary'
        },
        {
          id: 'inv2',
          amount: 10000,
          date: subDays(today, 10),
          notes: 'Freelance project bonus'
        }
      ]
    },
    {
      id: '2',
      name: 'Emergency Fund',
      targetAmount: 200000,
      currentAmount: 150000,
      category: 'Other',
      description: '6 months emergency fund',
      createdDate: new Date(2025, 5, 1), // June 1, 2025
      completed: false,
      investments: [
        {
          id: 'inv3',
          amount: 50000,
          date: subDays(today, 60),
          notes: 'Initial emergency fund setup'
        },
        {
          id: 'inv4',
          amount: 25000,
          date: subDays(today, 30),
          notes: 'Monthly contribution'
        },
        {
          id: 'inv5',
          amount: 75000,
          date: subDays(today, 5),
          notes: 'Large investment from bonus'
        }
      ]
    },
  ];
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions());
  const [goals, setGoals] = useState<Goal[]>(generateMockGoals());

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions([...transactions, newTransaction]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9)
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  const addInvestmentToGoal = (goalId: string, investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Math.random().toString(36).substr(2, 9)
    };

    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedInvestments = goal.investments ? [...goal.investments, newInvestment] : [newInvestment];
          const newCurrentAmount = goal.currentAmount + investment.amount;
          const isCompleted = newCurrentAmount >= goal.targetAmount;
          
          return {
            ...goal,
            investments: updatedInvestments,
            currentAmount: newCurrentAmount,
            completed: isCompleted
          };
        }
        return goal;
      })
    );

    // Also add this as a debit transaction to track the money flow
    addTransaction({
      amount: investment.amount,
      date: investment.date,
      type: 'debit',
      category: 'Goals',
      notes: `Investment in goal: ${goals.find(g => g.id === goalId)?.name || 'Unknown Goal'}${investment.notes ? ` - ${investment.notes}` : ''}`
    });
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
  const getCategoryExpenses = (selectedYear?: number, selectedMonth?: number): CategoryExpense[] => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => {
        if (t.type !== 'debit' || !t.category) return false;
        
        // Filter by year if provided
        if (selectedYear && t.date.getFullYear() !== selectedYear) return false;
        
        // Filter by month if provided (0-indexed)
        if (selectedMonth !== undefined && t.date.getMonth() !== selectedMonth) return false;
        
        return true;
      })
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

  // For the line chart - monthly expense totals (last 4 months)
  const getMonthlyExpenses = (selectedYear?: number) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const year = selectedYear || currentYear;
    
    const monthlyExpenses = new Map<string, number>();
    
    // Get last 4 months from current date or selected year
    let startMonth: number;
    let targetYear: number = year;
    
    if (year === currentYear) {
      // For current year, show last 4 months from current month
      startMonth = Math.max(0, currentMonth - 3);
    } else {
      // For past years, show last 4 months of that year (Sep, Oct, Nov, Dec)
      startMonth = 8; // September (0-indexed)
    }
    
    // Initialize 4 months
    for (let i = 0; i < 4; i++) {
      const monthIndex = startMonth + i;
      let displayYear = targetYear;
      
      // Handle year transition for current year
      if (year === currentYear && monthIndex > 11) {
        displayYear = targetYear + 1;
      }
      
      const date = new Date(displayYear, monthIndex % 12, 1);
      const monthKey = format(date, 'yyyy-MM');
      monthlyExpenses.set(monthKey, 0);
    }
    
    // Process all transactions for the target months
    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        const monthKey = format(t.date, 'yyyy-MM');
        if (monthlyExpenses.has(monthKey)) {
          const currentAmount = monthlyExpenses.get(monthKey) || 0;
          monthlyExpenses.set(monthKey, currentAmount + t.amount);
        }
      });
    
    // Return monthly totals
    return Array.from(monthlyExpenses).map(([monthKey, total]) => {
      const date = new Date(monthKey + '-01');
      return {
        month: format(date, 'MMM'),
        total: Math.round(total),
        year: date.getFullYear()
      };
    });
  };
  
  // Get available years starting from 2020
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    // Generate years from 2020 to current year
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        goals,
        addTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        addInvestmentToGoal,
        getTotalIncome,
        getTotalExpenses,
        getCurrentBalance,
        getCategoryExpenses,
        getDailyExpenses,
        getWeeklyTrends,
        getMonthlyExpenses,
        getAvailableYears
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};