import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { WeeklyTrend } from '../types';
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
  weeklyTrends: WeeklyTrend[];
}

const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ weeklyTrends }) => {
  const theme = useTheme();
  
  const chartData = {
    labels: weeklyTrends.map(item => item.week),
    datasets: [
      {
        label: 'Expenses',
        data: weeklyTrends.map(item => item.expenses),
        backgroundColor: theme.palette.error.light,
        borderColor: theme.palette.error.main,
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: theme.palette.error.main
      },
      {
        label: 'Income',
        data: weeklyTrends.map(item => item.income),
        backgroundColor: theme.palette.success.light,
        borderColor: theme.palette.success.main,
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: theme.palette.success.main
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
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
            return '₹' + value.toLocaleString();
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
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
      },
      transition: 'all 0.3s ease-in-out'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Weekly Trends
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseBarChart;