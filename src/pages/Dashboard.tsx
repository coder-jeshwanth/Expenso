import React from 'react';
import { Container, Typography, Box, Button, useTheme, Paper } from '@mui/material';
import { 
  TrendingUp as IncomeIcon, 
  TrendingDown as ExpenseIcon, 
  AccountBalance as BalanceIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/SummaryCard';
import ExpensePieChart from '../components/ExpensePieChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import RotatingQuotes from '../components/RotatingQuotes';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getCurrentBalance,
    getCategoryExpenses,
    getDailyExpenses 
  } = useTransactions();

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getCurrentBalance();
  const categoryExpenses = getCategoryExpenses();
  const dailyExpenses = getDailyExpenses();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Rotating Quotes Section */}
        <motion.div variants={itemVariants}>
          <RotatingQuotes />
        </motion.div>

        {/* Header with buttons */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={Link} 
                to="/add-credit" 
                variant="outlined" 
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Income
              </Button>
              <Button 
                component={Link} 
                to="/add-debit" 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Expense
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title="Total Income" 
                amount={income} 
                icon={<IncomeIcon />} 
                color={theme.palette.success.main} 
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title="Total Expenses" 
                amount={expenses} 
                icon={<ExpenseIcon />} 
                color={theme.palette.error.main} 
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title="Current Balance" 
                amount={balance} 
                icon={<BalanceIcon />} 
                color={theme.palette.info.main} 
              />
            </motion.div>
          </Box>
        </Box>

        {/* Analytics Section - Moved to Bottom */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Analytics
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <motion.div variants={itemVariants}>
              <ExpensePieChart categoryExpenses={categoryExpenses} />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
            <motion.div variants={itemVariants}>
              <ExpenseBarChart dailyExpenses={dailyExpenses} />
            </motion.div>
          </Box>
        </Box>
          
        {/* Optional: Future Features Section */}
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: `1px dashed ${theme.palette.divider}`,
              textAlign: 'center',
              mt: 4
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Looking for more insights?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              We're working on adding more detailed analytics and reporting features.
              Stay tuned for updates!
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              to="/settings"
            >
              Check Settings
            </Button>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Dashboard;