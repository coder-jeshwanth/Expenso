import React from 'react';
import { Container, Typography, Box, Button, useTheme, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { 
  TrendingUp as IncomeIcon, 
  TrendingDown as ExpenseIcon, 
  AccountBalance as BalanceIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import SummaryCard from '../components/SummaryCard';
import ExpensePieChart from '../components/ExpensePieChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import ExpenseLineChart from '../components/ExpenseLineChart';
import DailyExpenseChart from '../components/DailyExpenseChart';
import RotatingQuotes from '../components/RotatingQuotes';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getCurrentBalance,
    getCategoryExpenses,
    getDailyExpenses,
    getWeeklyTrends
  } = useTransactions();

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getCurrentBalance();
  const categoryExpenses = getCategoryExpenses();
  const dailyExpenses = getDailyExpenses();
  const weeklyTrends = getWeeklyTrends();

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
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
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
          <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
              {t('dashboard.title')}
            </Typography>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                component={Link} 
                to="/add-transaction?type=credit" 
                variant="outlined" 
                color="primary"
                startIcon={!isMobile && <AddIcon />}
                size={isMobile ? "small" : "medium"}
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                {isMobile ? 'Income' : 'Add Income'}
              </Button>
              <Button 
                component={Link} 
                to="/add-transaction?type=debit" 
                variant="contained" 
                color="primary"
                startIcon={!isMobile && <AddIcon />}
                size={isMobile ? "small" : "medium"}
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                {isMobile ? 'Expense' : 'Add Expense'}
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 0 } }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title={t('dashboard.totalIncome')} 
                amount={income} 
                icon={<IncomeIcon />} 
                color={theme.palette.success.main} 
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 0 } }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title={t('dashboard.totalExpenses')} 
                amount={expenses} 
                icon={<ExpenseIcon />} 
                color={theme.palette.error.main} 
              />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 0 } }}>
            <motion.div variants={itemVariants}>
              <SummaryCard 
                title={t('dashboard.totalBalance')} 
                amount={balance} 
                icon={<BalanceIcon />} 
                color={theme.palette.info.main} 
              />
            </motion.div>
          </Box>
        </Box>

        {/* Monthly Expense Trend Line Chart - Full width */}
        <motion.div variants={itemVariants}>
          <ExpenseLineChart />
        </motion.div>

        {/* Analytics Section - Moved to Bottom */}
        <motion.div variants={itemVariants}>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 600 }}>
            Analytics
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', sm: 0 } }}>
            <motion.div variants={itemVariants}>
              <ExpensePieChart />
            </motion.div>
          </Box>
          <Box sx={{ flex: '1 1 500px', minWidth: { xs: '100%', sm: 0 } }}>
            <motion.div variants={itemVariants}>
              <ExpenseBarChart weeklyTrends={weeklyTrends} />
            </motion.div>
          </Box>
        </Box>

        {/* Daily Analysis Chart - Full width at bottom */}
        <motion.div variants={itemVariants}>
          <DailyExpenseChart />
        </motion.div>
          
        {/* Optional: Future Features Section */}
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: { xs: 2, sm: 3 }, 
              border: `1px dashed ${theme.palette.divider}`,
              textAlign: 'center',
              mt: { xs: 3, sm: 4 }
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Looking for more insights?
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              We're working on adding more detailed analytics and reporting features.
              Stay tuned for updates!
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              to="/settings"
              size={isMobile ? "small" : "medium"}
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