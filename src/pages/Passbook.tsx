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
  Divider,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
  ViewList as AllIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';

const Passbook: React.FC = () => {
  const theme = useTheme();
  const { transactions } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filter transactions
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
      // Default sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
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

  const handleTypeColumnClick = () => {
    if (filterType === 'all') {
      setFilterType('credit');
    } else if (filterType === 'credit') {
      setFilterType('debit');
    } else {
      setFilterType('all');
    }
  };

  const getTypeColumnTitle = () => {
    if (filterType === 'all') {
      return 'Type';
    } else if (filterType === 'credit') {
      return 'Type (Income)';
    } else {
      return 'Type (Expense)';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when search term or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

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
                placeholder="Search by amount, category, notes, or source..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  minWidth: 200, 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '16px 14px',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
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
              <Table 
                sx={{ 
                  minWidth: 650,
                  tableLayout: 'fixed',
                  '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }
                }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f5f5f5' }}>
                    <TableCell 
                      sx={{ 
                        width: '120px',
                        minWidth: '120px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 12px'
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        width: '45%',
                        minWidth: '220px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 12px'
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        width: '130px',
                        minWidth: '130px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 12px'
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        width: '130px',
                        minWidth: '130px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 12px'
                      }}
                    >
                      Balance
                    </TableCell>
                    <TableCell 
                      onClick={handleTypeColumnClick}
                      sx={{ 
                        width: '110px',
                        minWidth: '110px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        padding: '16px 12px',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '15',
                        },
                        color: filterType !== 'all' ? theme.palette.primary.main : 'inherit',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {getTypeColumnTitle()}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No transactions found. {searchTerm && `Try adjusting your search for "${searchTerm}".`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions.map((transaction, paginatedIndex) => {
                      const actualIndex = startIndex + paginatedIndex;
                      return (
                        <TableRow
                          key={transaction.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e15' : '#f5f5f515'
                            },
                            '&:nth-of-type(even)': {
                              backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e08' : '#f8f9fa50'
                            }
                          }}
                        >
                          <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>
                            <Typography variant="body2" fontWeight={400} sx={{ fontFamily: 'monospace' }}>
                              {formatDate(transaction.date)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: '12px' }}>
                            <Box>
                              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                {transaction.source || transaction.category}
                              </Typography>
                              {transaction.notes && (
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                  {transaction.notes}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ padding: '12px' }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                            >
                              {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ padding: '12px' }}>
                            <Typography 
                              variant="body2" 
                              fontWeight={500} 
                              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                            >
                              ₹{getRunningBalance(actualIndex).toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ padding: '12px' }}>
                            <Chip
                              icon={transaction.type === 'credit' ? <IncomeIcon /> : <ExpenseIcon />}
                              label={transaction.type === 'credit' ? 'Income' : 'Expense'}
                              size="small"
                              color={transaction.type === 'credit' ? 'success' : 'error'}
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 500,
                                minWidth: '85px'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Pagination Controls */}
        {filteredTransactions.length > itemsPerPage && (
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 3,
              px: 2
            }}>
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Previous
              </Button>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                backgroundColor: theme.palette.background.paper,
                px: 3,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Typography variant="body2" color="text.secondary">
                  Page
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {currentPage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of {totalPages}
                </Typography>
              </Box>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </motion.div>
        )}

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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                {searchTerm && ` for "${searchTerm}"`}
                {filterType !== 'all' && ` (${filterType === 'credit' ? 'Income' : 'Expense'} only)`}
                {filteredTransactions.length !== transactions.length && ` • Total: ${transactions.length}`}
              </Typography>
            </Paper>
          </motion.div>
        )}
      </motion.div>




    </Container>
  );
};

export default Passbook;