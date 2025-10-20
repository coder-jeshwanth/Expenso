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
  alpha
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import {
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define the structure of our monthly expense data
interface MonthlyExpense {
  month: string;
  total: number;
  year: number;
}

const ExpenseLineChart: React.FC = () => {
  const theme = useTheme();
  const { getMonthlyExpenses, getAvailableYears } = useTransactions();
  
  const availableYears = getAvailableYears();
  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyExpense[]>([]);
  
  // Update data when year changes
  useEffect(() => {
    const data = getMonthlyExpenses(selectedYear);
    setMonthlyData(data);
  }, [selectedYear, getMonthlyExpenses]);
  

  
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };
  
  const chartData = {
    labels: monthlyData.map((item: MonthlyExpense) => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.map((item: MonthlyExpense) => item.total),
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: theme.palette.primary.dark,
        tension: 0.3,
        fill: true
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          boxWidth: 8,
          boxHeight: 8,
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
        usePointStyle: true,
        callbacks: {
          title: function(context: any) {
            return `${context[0].label} ${selectedYear}`;
          },
          label: function(context: any) {
            return `Total Expense: ₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
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
      },
      x: {
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
      mb: 3,
      overflow: 'visible'
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
            <TrendingUpIcon 
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
              Monthly Expense Trends
            </Typography>
          </Box>
          
          <FormControl variant="outlined" size="small" sx={{ 
            minWidth: 120, 
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
              startAdornment={
                <CalendarIcon sx={{ mr: 0.5, fontSize: '1rem', color: theme.palette.text.secondary }} />
              }
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        

        
        <Box sx={{ 
          height: 300, 
          position: 'relative',
          mb: 1
        }}>
          <Line data={chartData} options={options} />
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          *Monthly expense trends (last 4 months) in {selectedYear}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpenseLineChart;