import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  TextField,
  alpha
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import {
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import { format, subDays, addDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DailyExpense {
  date: string;
  expenses: number;
  income: number;
}

const DailyExpenseChart: React.FC = () => {
  const theme = useTheme();
  const { transactions } = useTransactions();
  
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [dailyData, setDailyData] = useState<DailyExpense[]>([]);

  // Update data when selected date changes
  useEffect(() => {
    const startDate = new Date(selectedDate);
    const data: DailyExpense[] = [];
    
    // Generate 7 days starting from 3 days before selected date to 3 days after
    for (let i = -3; i <= 3; i++) {
      const currentDate = addDays(startDate, i);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // Calculate expenses and income for this date
      const dayTransactions = transactions.filter(t => 
        format(t.date, 'yyyy-MM-dd') === dateStr
      );
      
      const expenses = dayTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const income = dayTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        date: format(currentDate, 'MMM dd'),
        expenses,
        income
      });
    }
    
    setDailyData(data);
  }, [selectedDate, transactions]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const chartData = {
    labels: dailyData.map(item => item.date),
    datasets: [
      {
        label: 'Income',
        data: dailyData.map(item => item.income),
        backgroundColor: alpha(theme.palette.success.main, 0.8),
        borderColor: theme.palette.success.main,
        borderWidth: 0,
        borderRadius: 0,
        hoverBackgroundColor: theme.palette.success.main
      },
      {
        label: 'Expenses',
        data: dailyData.map(item => item.expenses),
        backgroundColor: alpha(theme.palette.error.main, 0.8),
        borderColor: theme.palette.error.main,
        borderWidth: 0,
        borderRadius: 0,
        hoverBackgroundColor: theme.palette.error.main
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        border: {
          display: false
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: alpha(theme.palette.divider, 0.5),
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          font: {
            size: 11
          },
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.common.black, 0.8),
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
          },
          footer: function(context: any) {
            const total = context.reduce((sum: number, item: any) => sum + item.raw, 0);
            return `Total: ₹${total.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <Card sx={{ 
      width: '100%',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
      },
      transition: 'all 0.3s ease-in-out',
      mb: 3
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          mb: 2.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon 
              sx={{ 
                fontSize: 24, 
                mr: 1.5, 
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                p: 0.6,
                borderRadius: '50%'
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: '600' }}>
              Daily Analysis (7 Days)
            </Typography>
          </Box>
          
          <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            size="small"
            InputProps={{
              startAdornment: (
                <CalendarIcon sx={{ mr: 0.5, fontSize: '1rem', color: theme.palette.text.secondary }} />
              ),
            }}
            sx={{ 
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8)
              }
            }}
          />
        </Box>
        
        <Box sx={{ 
          height: 350, 
          position: 'relative',
          mb: 1
        }}>
          <Bar data={chartData} options={options} />
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          *Daily income and expenses around {format(new Date(selectedDate), 'MMM dd, yyyy')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DailyExpenseChart;