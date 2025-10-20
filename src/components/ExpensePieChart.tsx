import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Stack,
  alpha
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { CategoryExpense } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  CalendarToday as CalendarIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart: React.FC = () => {
  const theme = useTheme();
  const { getCategoryExpenses, getAvailableYears } = useTransactions();
  
  const availableYears = getAvailableYears();
  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ];

  // Update data when year or month changes
  useEffect(() => {
    const categoryData = getCategoryExpenses(selectedYear, selectedMonth);
    setCategoryExpenses(categoryData);
  }, [selectedYear, selectedMonth, getCategoryExpenses]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  };
  
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
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    },
    maintainAspectRatio: false
  };

  const totalExpense = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card sx={{ 
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
      },
      transition: 'all 0.3s ease-in-out'
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
            <PieChartIcon 
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
              Expense Categories
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <FormControl variant="outlined" size="small" sx={{ 
              minWidth: 80, 
              width: 80,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8)
              }
            }}>
              <InputLabel id="year-select-label" sx={{ fontSize: '0.875rem' }}>
                Year
              </InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                label="Year"
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ 
              minWidth: 90, 
              width: 90,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8)
              }
            }}>
              <InputLabel id="month-select-label" sx={{ fontSize: '0.875rem' }}>
                Month
              </InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Month"
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>{month.label.slice(0, 3)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
        

        
        <Box sx={{ position: 'relative', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={chartData} options={options} />
          <Box sx={{ 
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            textAlign: 'center',
            minWidth: '100px'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1, mb: 0.5 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              ₹{totalExpense.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;