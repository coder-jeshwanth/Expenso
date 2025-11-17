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
  ViewList as AllIcon
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                component={Link} 
                to="/" 
                startIcon={<ArrowBackIcon />}
                sx={{ mr: { xs: 2, sm: 3 } }}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? 'Back' : 'Back to Dashboard'}
              </Button>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Passbook
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
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
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 2, sm: 3 },
              mb: { xs: 2, sm: 3 },
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                label="Search transactions"
                placeholder={isMobile ? "Search..." : "Search by amount, category, notes, or source..."}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
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
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: '100px', sm: '150px' },
                border: `1px solid ${theme.palette.success.light}`,
                backgroundColor: `${theme.palette.success.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Total Income</Typography>
              <Typography variant={isMobile ? "body1" : "h6"} color="success.main" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                ₹{transactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString('en-IN')}
              </Typography>
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: '100px', sm: '150px' },
                border: `1px solid ${theme.palette.error.light}`,
                backgroundColor: `${theme.palette.error.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Total Expenses</Typography>
              <Typography variant={isMobile ? "body1" : "h6"} color="error.main" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                ₹{transactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString('en-IN')}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: '100px', sm: '150px' },
                border: `1px solid ${theme.palette.primary.light}`,
                backgroundColor: `${theme.palette.primary.main}08`
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>Net Balance</Typography>
              <Typography variant={isMobile ? "body1" : "h6"} color="primary.main" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
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
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)'
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table 
                sx={{ 
                  minWidth: { xs: 300, sm: 650 },
                  tableLayout: 'auto',
                  '& .MuiTableCell-root': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: { xs: '8px 4px', sm: '16px 12px' },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }
                }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f5f5f5' }}>
                    <TableCell 
                      sx={{ 
                        width: { xs: '70px', sm: '120px' },
                        minWidth: { xs: '70px', sm: '120px' },
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        letterSpacing: '0.5px'
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        width: { xs: '35%', sm: '45%' },
                        minWidth: { xs: '120px', sm: '220px' },
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        letterSpacing: '0.5px'
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        width: { xs: '80px', sm: '130px' },
                        minWidth: { xs: '80px', sm: '130px' },
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        letterSpacing: '0.5px'
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        width: { xs: '80px', sm: '130px' },
                        minWidth: { xs: '80px', sm: '130px' },
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        letterSpacing: '0.5px',
                        display: { xs: 'none', sm: 'table-cell' }
                      }}
                    >
                      Balance
                    </TableCell>
                    <TableCell 
                      onClick={handleTypeColumnClick}
                      sx={{ 
                        width: { xs: '70px', sm: '110px' },
                        minWidth: { xs: '70px', sm: '110px' },
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                        letterSpacing: '0.5px',
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
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" fontWeight={400} sx={{ fontFamily: 'monospace', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                              {formatDate(transaction.date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 0.5 }}>
                                {transaction.source || transaction.category}
                              </Typography>
                              {transaction.notes && !isMobile && (
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                  {transaction.notes}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                              sx={{ fontFamily: 'monospace', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography 
                              variant="body2" 
                              fontWeight={500} 
                              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                            >
                              ₹{getRunningBalance(actualIndex).toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={isMobile ? undefined : (transaction.type === 'credit' ? <IncomeIcon /> : <ExpenseIcon />)}
                              label={isMobile ? (transaction.type === 'credit' ? 'In' : 'Out') : (transaction.type === 'credit' ? 'Income' : 'Expense')}
                              size="small"
                              color={transaction.type === 'credit' ? 'success' : 'error'}
                              variant="outlined"
                              sx={{ 
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }, 
                                fontWeight: 500,
                                minWidth: { xs: '45px', sm: '85px' },
                                height: { xs: '20px', sm: '24px' }
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
              mt: { xs: 2, sm: 3 },
              px: { xs: 0, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  minWidth: { xs: '100%', sm: 120 },
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
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Page
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {currentPage}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  of {totalPages}
                </Typography>
              </Box>
              
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  minWidth: { xs: '100%', sm: 120 },
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