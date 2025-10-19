import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { CategoryExpense } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensePieChartProps {
  categoryExpenses: CategoryExpense[];
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ categoryExpenses }) => {
  const theme = useTheme();
  
  const chartData = {
    labels: categoryExpenses.map(item => item.category),
    datasets: [
      {
        data: categoryExpenses.map(item => item.amount),
        backgroundColor: categoryExpenses.map(item => item.color),
        borderColor: categoryExpenses.map(item => theme.palette.background.paper),
        borderWidth: 2,
        hoverOffset: 15
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₹${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const totalExpense = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);

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
          Expense Categories
        </Typography>
        
        <Box sx={{ position: 'relative', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={chartData} options={options} />
          <Box sx={{ 
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body2" color="textSecondary">Total</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹{totalExpense.toLocaleString()}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;