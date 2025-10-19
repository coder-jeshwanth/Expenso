import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { DailyExpense } from '../types';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseBarChartProps {
  dailyExpenses: DailyExpense[];
}

const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ dailyExpenses }) => {
  const theme = useTheme();
  
  const chartData = {
    labels: dailyExpenses.map(item => item.date),
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyExpenses.map(item => item.amount),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: theme.palette.primary.main
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `₹${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
      },
      transition: 'all 0.3s ease-in-out'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Daily Expense Trend
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseBarChart;