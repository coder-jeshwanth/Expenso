import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';

const Passbook: React.FC = () => {
  const theme = useTheme();
  const { transactions } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

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

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm);
      
      const matchesFilter = 
        filterType === 'all' || 
        transaction.type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRunningBalance = (index: number) => {
    let balance = 0;
    for (let i = filteredTransactions.length - 1; i >= index; i--) {
      const transaction = filteredTransactions[i];
      if (transaction.type === 'credit') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    }
    return balance;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                component={Link} 
                to="/" 
                startIcon={<ArrowBackIcon />}
                sx={{ mr: 3 }}
                variant="outlined"
              >
                Back to Dashboard
              </Button>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Passbook
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <FilterIcon />
              </IconButton>
            </Box>
          </Box>
        </motion.div>

        {/* Filters Section */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                label="Search transactions"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200, flex: 1 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="credit">Income</MenuItem>
                  <MenuItem value="debit">Expense</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </motion.div>

        {/* Transaction Summary */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                flex: 1,
                minWidth: 150,
                border: `1px solid ${theme.palette.success.light}`,
                backgroundColor: `${theme.palette.success.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary">Total Income</Typography>
              <Typography variant="h6" color="success.main" fontWeight={600}>
                ₹{transactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString('en-IN')}
              </Typography>
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                flex: 1,
                minWidth: 150,
                border: `1px solid ${theme.palette.error.light}`,
                backgroundColor: `${theme.palette.error.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary">Total Expenses</Typography>
              <Typography variant="h6" color="error.main" fontWeight={600}>
                ₹{transactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString('en-IN')}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                flex: 1,
                minWidth: 150,
                border: `1px solid ${theme.palette.primary.light}`,
                backgroundColor: `${theme.palette.primary.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary">Net Balance</Typography>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                ₹{(transactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + t.amount, 0) -
                  transactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + t.amount, 0))
                  .toLocaleString('en-IN')}
              </Typography>
            </Paper>
          </Box>
        </motion.div>

        {/* Transactions Table */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)'
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f5f5f5' }}>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell align="right"><strong>Balance</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No transactions found. {searchTerm && `Try adjusting your search for "${searchTerm}".`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <TableRow
                        key={transaction.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e20' : '#f5f5f520'
                          }
                        }}
                      >
                        <TableCell>
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {transaction.source || transaction.category}
                            </Typography>
                            {transaction.notes && (
                              <Typography variant="caption" color="textSecondary">
                                {transaction.notes}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {transaction.category || transaction.source || '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={500}>
                            ₹{getRunningBalance(index).toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={transaction.type === 'credit' ? <IncomeIcon /> : <ExpenseIcon />}
                            label={transaction.type === 'credit' ? 'Income' : 'Expense'}
                            size="small"
                            color={transaction.type === 'credit' ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Summary Footer */}
        {filteredTransactions.length > 0 && (
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 3,
                borderRadius: 2,
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f9f9f9'
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Showing {filteredTransactions.length} of {transactions.length} transactions
                {searchTerm && ` for "${searchTerm}"`}
                {filterType !== 'all' && ` (${filterType === 'credit' ? 'Income' : 'Expense'} only)`}
              </Typography>
            </Paper>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Passbook;