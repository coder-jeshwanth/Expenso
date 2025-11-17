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
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
  ViewList as AllIcon,
  AccountBalance as BalanceIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';

const Passbook: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { transactions } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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
      
      // Date range filtering
      const transactionDate = new Date(transaction.date);
      const matchesDateRange = 
        (!fromDate || transactionDate >= new Date(fromDate)) &&
        (!toDate || transactionDate <= new Date(toDate));
      
      return matchesSearch && matchesFilter && matchesDateRange;
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

  // Download transactions as CSV
  const handleDownload = () => {
    const csvContent = [
      ['Date', 'Type', 'Category', 'Source', 'Amount', 'Notes'],
      ...filteredTransactions.map(t => [
        formatDate(t.date),
        t.type === 'credit' ? 'Income' : 'Expense',
        t.category || '',
        t.source || '',
        t.amount,
        t.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
  }, [searchTerm, filterType, fromDate, toDate]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Transaction Summary */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              mb: 4, 
              justifyContent: 'center',
              flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 0' },
                  maxWidth: { xs: 'none', md: 350 },
                  minWidth: { xs: 150, md: 280 },
                  border: `2px solid ${theme.palette.success.main}40`,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}08)`
                    : `linear-gradient(135deg, ${theme.palette.success.main}08, #ffffff)`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 32px ${theme.palette.success.main}20`
                    : `0 4px 20px ${theme.palette.success.main}15`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 12px 40px ${theme.palette.success.main}30`
                      : `0 8px 30px ${theme.palette.success.main}25`,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Total Income
                  </Typography>
                  <IncomeIcon sx={{ fontSize: 28, color: theme.palette.success.main, opacity: 0.8 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight={700} 
                  sx={{ 
                    color: theme.palette.success.main,
                    textShadow: theme.palette.mode === 'dark' ? `0 0 20px ${theme.palette.success.main}40` : 'none'
                  }}
                >
                  ₹{transactions
                    .filter(t => t.type === 'credit')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </Typography>
              </Paper>
              
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  flex: { xs: '1 1 calc(50% - 12px)', md: '1 1 0' },
                  maxWidth: { xs: 'none', md: 350 },
                  minWidth: { xs: 150, md: 280 },
                  border: `2px solid ${theme.palette.error.main}40`,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}08)`
                    : `linear-gradient(135deg, ${theme.palette.error.main}08, #ffffff)`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 32px ${theme.palette.error.main}20`
                    : `0 4px 20px ${theme.palette.error.main}15`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 12px 40px ${theme.palette.error.main}30`
                      : `0 8px 30px ${theme.palette.error.main}25`,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Total Expenses
                  </Typography>
                  <ExpenseIcon sx={{ fontSize: 28, color: theme.palette.error.main, opacity: 0.8 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ 
                    color: theme.palette.error.main,
                    textShadow: theme.palette.mode === 'dark' ? `0 0 20px ${theme.palette.error.main}40` : 'none'
                  }}
                >
                  ₹{transactions
                    .filter(t => t.type === 'debit')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('en-IN')}
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  flex: { xs: '1 1 100%', md: '1 1 0' },
                  maxWidth: { xs: 'none', md: 350 },
                  minWidth: { xs: 150, md: 280 },
                  border: `2px solid ${theme.palette.primary.main}40`,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}08)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main}08, #ffffff)`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 32px ${theme.palette.primary.main}20`
                    : `0 4px 20px ${theme.palette.primary.main}15`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 12px 40px ${theme.palette.primary.main}30`
                      : `0 8px 30px ${theme.palette.primary.main}25`,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    Net Balance
                  </Typography>
                  <BalanceIcon sx={{ fontSize: 28, color: theme.palette.primary.main, opacity: 0.8 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ 
                    color: theme.palette.primary.main,
                    textShadow: theme.palette.mode === 'dark' ? `0 0 20px ${theme.palette.primary.main}40` : 'none'
                  }}
                >
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
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : '#ffffff',
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)'
                : '0px 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Filters Section - Inside Table */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(0,0,0,0.01)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1.5, sm: 2 },
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: { xs: 'wrap', md: 'nowrap' }
              }}>
                {/* Search Field - Takes more space */}
                <TextField
                  label="Search"
                  placeholder="Search transactions..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '1 1 auto' },
                    minWidth: { xs: '100%', md: 280 },
                    '& .MuiOutlinedInput-root': {
                      height: '44px',
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: '2px',
                          boxShadow: `0 0 0 3px ${theme.palette.primary.main}15`,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '0.875rem',
                      padding: '10px 12px 10px 0',
                    },
                  }}
                />
                
                {/* Date Range Fields - Equal width, side by side */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5,
                  flex: { xs: '1 1 100%', md: '0 0 auto' },
                }}>
                  <TextField
                    label="From"
                    type="date"
                    size="small"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      flex: 1,
                      minWidth: { xs: 'calc(50% - 6px)', sm: 140 },
                      maxWidth: { md: 160 },
                      '& .MuiOutlinedInput-root': {
                        height: '44px',
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: '1px',
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff',
                          '& fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px',
                            boxShadow: `0 0 0 3px ${theme.palette.primary.main}15`,
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.875rem',
                        padding: '10px 12px',
                      },
                    }}
                  />

                  <TextField
                    label="To"
                    type="date"
                    size="small"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      flex: 1,
                      minWidth: { xs: 'calc(50% - 6px)', sm: 140 },
                      maxWidth: { md: 160 },
                      '& .MuiOutlinedInput-root': {
                        height: '44px',
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: '1px',
                        },
                        '&.Mui-focused': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#ffffff',
                          '& fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px',
                            boxShadow: `0 0 0 3px ${theme.palette.primary.main}15`,
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.875rem',
                        '&.Mui-focused': {
                          color: theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.875rem',
                        padding: '10px 12px',
                      },
                    }}
                  />
                </Box>

                {/* Download Button - Compact with icon */}
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                  onClick={handleDownload}
                  disabled={filteredTransactions.length === 0}
                  sx={{
                    height: 44,
                    px: { xs: 2, sm: 2.5 },
                    minWidth: { xs: 'auto', sm: 110 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    flex: { xs: '1 1 100%', md: '0 0 auto' },
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                        : theme.palette.primary.dark,
                      boxShadow: `0 6px 20px ${theme.palette.primary.main}50, 0 0 30px ${theme.palette.primary.main}20`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      opacity: 0.4,
                      background: theme.palette.action.disabledBackground,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {isMobile ? 'CSV' : 'Download'}
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table 
                sx={{ 
                  minWidth: 650,
                  '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    padding: '20px 16px',
                  }
                }}
              >
                <TableHead>
                  <TableRow sx={{ 
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)' 
                  }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                        textTransform: 'uppercase',
                        display: { xs: 'none', md: 'table-cell' }
                      }}
                    >
                      Balance
                    </TableCell>
                    <TableCell 
                      onClick={handleTypeColumnClick}
                      align="right"
                      sx={{ 
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.5px',
                        color: filterType !== 'all' ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                        textTransform: 'uppercase',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.15)' : 'rgba(156, 39, 176, 0.08)',
                        },
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
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                          No transactions found
                        </Typography>
                        {searchTerm && (
                          <Typography variant="body2" color="textSecondary">
                            Try adjusting your search or date range
                          </Typography>
                        )}
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
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255,255,255,0.05)' 
                                : 'rgba(0,0,0,0.02)',
                              transition: 'background-color 0.2s ease',
                            },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              fontWeight={500} 
                              sx={{ 
                                fontFamily: 'monospace',
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {formatDate(transaction.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                                {transaction.source || transaction.category}
                              </Typography>
                              {transaction.notes && (
                                <Typography variant="caption" color="textSecondary">
                                  {transaction.notes}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body1"
                              fontWeight={700}
                              sx={{ 
                                fontFamily: 'monospace',
                                color: transaction.type === 'credit' ? theme.palette.success.main : theme.palette.error.main,
                                textShadow: theme.palette.mode === 'dark' 
                                  ? transaction.type === 'credit'
                                    ? `0 0 10px ${theme.palette.success.main}40`
                                    : `0 0 10px ${theme.palette.error.main}40`
                                  : 'none',
                              }}
                            >
                              {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Typography 
                              variant="body1" 
                              fontWeight={600} 
                              sx={{ 
                                fontFamily: 'monospace',
                                color: theme.palette.text.primary,
                              }}
                            >
                              ₹{getRunningBalance(actualIndex).toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={transaction.type === 'credit' ? <IncomeIcon /> : <ExpenseIcon />}
                              label={transaction.type === 'credit' ? 'Income' : 'Expense'}
                              size="small"
                              color={transaction.type === 'credit' ? 'success' : 'error'}
                              variant="outlined"
                              sx={{ 
                                fontWeight: 600,
                                borderWidth: 2,
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
              mt: 4,
              px: 2,
            }}>
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  height: 48,
                  borderRadius: 2,
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateX(-4px)',
                  },
                  '&:disabled': {
                    opacity: 0.3
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Previous
              </Button>
              
              <Paper
                elevation={0}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  border: `2px solid ${theme.palette.primary.main}40`,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}08)`
                    : `${theme.palette.primary.main}08`,
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Page
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {currentPage}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  of {totalPages}
                </Typography>
              </Paper>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                variant="outlined"
                sx={{ 
                  minWidth: 120,
                  height: 48,
                  borderRadius: 2,
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateX(4px)',
                  },
                  '&:disabled': {
                    opacity: 0.3
                  },
                  transition: 'all 0.3s ease',
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
                p: 3,
                mt: 4,
                borderRadius: 3,
                textAlign: 'center',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
              }}
            >
              <Typography variant="body2" color="textSecondary" fontWeight={500}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                {(searchTerm || fromDate || toDate) && (
                  <Box component="span" sx={{ display: 'block', mt: 1, color: theme.palette.primary.main }}>
                    {searchTerm && ` • Search: "${searchTerm}"`}
                    {fromDate && ` • From: ${new Date(fromDate).toLocaleDateString('en-IN')}`}
                    {toDate && ` • To: ${new Date(toDate).toLocaleDateString('en-IN')}`}
                  </Box>
                )}
                {filterType !== 'all' && (
                  <Box component="span" sx={{ display: 'block', mt: 0.5, color: theme.palette.primary.main }}>
                    {` • ${filterType === 'credit' ? 'Income' : 'Expense'} only`}
                  </Box>
                )}
                {filteredTransactions.length !== transactions.length && (
                  <Box component="span" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                    {` Total: ${transactions.length} transactions`}
                  </Box>
                )}
              </Typography>
            </Paper>
          </motion.div>
        )}
        </motion.div>
      </Box>
    </Container>
  );
};

export default Passbook;