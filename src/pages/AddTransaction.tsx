import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Fab
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  ArrowBack as ArrowBackIcon,
  CurrencyRupee as RupeeIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import CreditSavedModal from '../components/CreditSavedModal';
import ExpenseSavedModal from '../components/ExpenseSavedModal';

const AddTransaction: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTransaction } = useTransactions();
  const { t } = useLanguage();
  
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Initialize transaction type from URL parameter
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'credit' || typeParam === 'debit') {
      setTransactionType(typeParam);
    }
  }, [searchParams]);
  
  // Credit categories
  const creditCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Others'];
  
  // Debit categories
  const debitCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];
  
  // Credit state
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [creditSource, setCreditSource] = useState<string>('');
  const [creditCustomSource, setCreditCustomSource] = useState<string>('');
  const [creditDate, setCreditDate] = useState<Date | null>(new Date());
  const [creditNotes, setCreditNotes] = useState<string>('');
  const [creditAmountError, setCreditAmountError] = useState<string>('');
  const [creditSourceError, setCreditSourceError] = useState<string>('');
  const [creditCustomSourceError, setCreditCustomSourceError] = useState<string>('');
  const [showCreditSuccessModal, setShowCreditSuccessModal] = useState<boolean>(false);
  
  // Debit state
  const [debitAmount, setDebitAmount] = useState<string>('');
  const [debitCategory, setDebitCategory] = useState<string>('');
  const [debitCustomCategory, setDebitCustomCategory] = useState<string>('');
  const [debitDate, setDebitDate] = useState<Date | null>(new Date());
  const [debitNotes, setDebitNotes] = useState<string>('');
  const [debitAmountError, setDebitAmountError] = useState<string>('');
  const [debitCategoryError, setDebitCategoryError] = useState<string>('');
  const [debitCustomCategoryError, setDebitCustomCategoryError] = useState<string>('');
  const [showDebitSuccessModal, setShowDebitSuccessModal] = useState<boolean>(false);

  const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newType: 'credit' | 'debit' | null) => {
    if (newType !== null && newType !== transactionType) {
      setIsAnimating(true);
      setTransactionType(newType);
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  const handleCreditSubmit = () => {
    setCreditAmountError('');
    setCreditSourceError('');
    setCreditCustomSourceError('');
    
    let isValid = true;
    
    if (!creditAmount.trim()) {
      setCreditAmountError('Please enter an amount');
      isValid = false;
    } else if (isNaN(parseFloat(creditAmount)) || parseFloat(creditAmount) <= 0) {
      setCreditAmountError('Please enter a valid positive amount');
      isValid = false;
    }
    
    if (!creditSource) {
      setCreditSourceError('Please select a source');
      isValid = false;
    } else if (creditSource === 'Others' && !creditCustomSource.trim()) {
      setCreditCustomSourceError('Please enter a custom source name');
      isValid = false;
    }
    
    if (isValid) {
      const finalSource = creditSource === 'Others' ? creditCustomSource : creditSource;
      addTransaction({
        amount: parseFloat(creditAmount),
        date: creditDate || new Date(),
        type: 'credit',
        source: finalSource,
        notes: creditNotes
      });
      
      setShowCreditSuccessModal(true);
    }
  };

  const handleDebitSubmit = () => {
    setDebitAmountError('');
    setDebitCategoryError('');
    setDebitCustomCategoryError('');
    
    let isValid = true;
    
    if (!debitAmount.trim()) {
      setDebitAmountError('Please enter an amount');
      isValid = false;
    } else if (isNaN(parseFloat(debitAmount)) || parseFloat(debitAmount) <= 0) {
      setDebitAmountError('Please enter a valid positive amount');
      isValid = false;
    }
    
    if (!debitCategory) {
      setDebitCategoryError('Please select a category');
      isValid = false;
    } else if (debitCategory === 'Others' && !debitCustomCategory.trim()) {
      setDebitCustomCategoryError('Please enter a custom category name');
      isValid = false;
    }
    
    if (isValid) {
      const finalCategory = debitCategory === 'Others' ? debitCustomCategory : debitCategory;
      addTransaction({
        amount: parseFloat(debitAmount),
        date: debitDate || new Date(),
        type: 'debit',
        category: finalCategory,
        notes: debitNotes
      });
      
      setShowDebitSuccessModal(true);
    }
  };

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
      opacity: 1
    }
  };

  const formFieldVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  };

  const cardVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      y: -50
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.8,
      y: 100
    })
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      width: '100%',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 3, sm: 4, md: 5 }
    }}>
      <Container 
        maxWidth={false}
        sx={{ 
          maxWidth: '900px',
          width: '100%'
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Toggle Buttons */}
          <motion.div 
            variants={itemVariants} 
            initial="hidden" 
            animate="visible"
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <ToggleButtonGroup
              value={transactionType}
              exclusive
              onChange={handleTypeChange}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '50px',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0px 4px 20px rgba(0, 0, 0, 0.3)' 
                  : '0px 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <ToggleButton 
                value="credit"
                sx={{
                  px: { xs: 3, sm: 5 },
                  py: 1.5,
                  borderRadius: '50px !important',
                  border: 'none !important',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.success.main,
                    color: '#fff',
                    transform: 'scale(1.05)',
                    '&:hover': {
                      backgroundColor: theme.palette.success.dark,
                    }
                  },
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <IncomeIcon sx={{ mr: 1 }} />
                Income
              </ToggleButton>
              <ToggleButton 
                value="debit"
                sx={{
                  px: { xs: 3, sm: 5 },
                  py: 1.5,
                  borderRadius: '50px !important',
                  border: 'none !important',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: '#9c27b0',
                    color: '#fff',
                    transform: 'scale(1.05)',
                    '&:hover': {
                      backgroundColor: '#7b1fa2',
                    }
                  },
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <ExpenseIcon sx={{ mr: 1 }} />
                Expense
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </motion.div>

          {/* Wallet Animation Container */}
          <Box sx={{ 
            position: 'relative', 
            perspective: '1500px',
            minHeight: { xs: '500px', sm: '600px' },
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
          <AnimatePresence mode="wait" custom={transactionType === 'credit' ? 1 : -1}>
            <motion.div
              key={transactionType}
              custom={transactionType === 'credit' ? 1 : -1}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                width: '100%',
                transformStyle: 'preserve-3d'
              }}
            >
              {transactionType === 'credit' ? (
                // Credit Form
                <Paper
                  elevation={0}
                  sx={{
                    width: { xs: '100%', sm: '85%', md: '80%' },
                    mx: 'auto',
                    p: { xs: 3, sm: 4, md: 5 },
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                      : '0px 4px 24px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 600, 
                      color: theme.palette.success.main,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Income Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0, duration: 0.4 }}>
                      <TextField
                        label="Amount"
                        placeholder="0.00"
                        fullWidth
                        value={creditAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/[^0-9.]/g, '');
                          const parts = numericValue.split('.');
                          if (parts.length > 2) {
                            setCreditAmount(parts[0] + '.' + parts.slice(1).join(''));
                          } else {
                            setCreditAmount(numericValue);
                          }
                        }}
                        error={!!creditAmountError}
                        helperText={creditAmountError || "Enter the income amount in rupees"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <RupeeIcon sx={{ color: theme.palette.success.main, fontSize: '1.25rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4caf50',
                          },
                          '& .MuiInputBase-input': {
                            padding: '16px 14px',
                          }
                        }}
                      />
                    </motion.div>
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.08, duration: 0.4 }}>
                      <FormControl 
                        fullWidth
                        error={!!creditSourceError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4caf50',
                          }
                        }}
                      >
                      <InputLabel id="source-label">Income Source</InputLabel>
                      <Select
                        labelId="source-label"
                        value={creditSource}
                        label="Income Source"
                        onChange={(e) => {
                          setCreditSource(e.target.value);
                          if (e.target.value !== 'Others') {
                            setCreditCustomSource('');
                            setCreditCustomSourceError('');
                          }
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon sx={{ color: theme.palette.success.main, fontSize: '1.25rem', ml: -0.5 }} />
                          </InputAdornment>
                        }
                      >
                        {creditCategories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {creditSourceError || "Select the source of this income"}
                      </FormHelperText>
                    </FormControl>
                    </motion.div>

                    {creditSource === 'Others' && (
                      <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.16, duration: 0.4 }}>
                        <TextField
                          label="Custom Source"
                          placeholder="Enter your custom source name"
                          fullWidth
                          value={creditCustomSource}
                          onChange={(e) => setCreditCustomSource(e.target.value)}
                          error={!!creditCustomSourceError}
                          helperText={creditCustomSourceError || "Enter a name for your custom source"}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#4caf50',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#4caf50',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#4caf50',
                            },
                            '& .MuiInputBase-input': {
                              padding: '16px 14px',
                            }
                          }}
                        />
                      </motion.div>
                    )}
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.24, duration: 0.4 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date of Income"
                          value={creditDate}
                          onChange={(newDate: Date | null) => setCreditDate(newDate)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: false,
                              helperText: "Select the date when this income was received",
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EventIcon sx={{ color: '#4caf50', fontSize: '1.25rem' }} />
                                  </InputAdornment>
                                ),
                              },
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  height: '56px',
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#4caf50',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#4caf50',
                                    borderWidth: 2,
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#4caf50',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '16px 14px',
                                }
                              }
                            }
                          }}
                        />
                    </LocalizationProvider>
                    </motion.div>
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.32, duration: 0.4 }}>
                      <TextField
                        label="Additional Notes"
                        placeholder="Any additional details about this income..."
                        fullWidth
                        multiline
                        rows={4}
                        value={creditNotes}
                        onChange={(e) => setCreditNotes(e.target.value)}
                        helperText="Optional: Add any notes or description"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            minHeight: '120px',
                            borderRadius: 2,
                            alignItems: 'flex-start',
                            '&:hover fieldset': {
                              borderColor: '#4caf50',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4caf50',
                          },
                          '& .MuiInputBase-input': {
                            padding: '16px 14px',
                          }
                        }}
                      />
                    </motion.div>
                  </Box>
                  
                  <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4, duration: 0.4 }}>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="inherit" 
                        component={Link}
                        to="/"
                        sx={{ 
                          flex: 1,
                          py: 1.75,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={handleCreditSubmit}
                        sx={{ 
                          flex: 2,
                          py: 1.75,
                          borderRadius: 2,
                          backgroundColor: '#4caf50',
                          color: '#fff',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0px 8px 16px rgba(76, 175, 80, 0.25)',
                          '&:hover': {
                            backgroundColor: '#45a049',
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 10px 20px rgba(76, 175, 80, 0.38)',
                          }
                        }}
                      >
                        Save Income
                      </Button>
                    </Box>
                  </motion.div>
                </Paper>
              ) : (
                // Debit Form
                <Paper
                  elevation={0}
                  sx={{
                    width: { xs: '100%', sm: '85%', md: '80%' },
                    mx: 'auto',
                    p: { xs: 3, sm: 4, md: 5 },
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                      : '0px 4px 24px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 600, 
                      color: '#9c27b0',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    Expense Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0, duration: 0.4 }}>
                      <TextField
                        label="Amount"
                        placeholder="0.00"
                        fullWidth
                        value={debitAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/[^0-9.]/g, '');
                          const parts = numericValue.split('.');
                          if (parts.length > 2) {
                            setDebitAmount(parts[0] + '.' + parts.slice(1).join(''));
                          } else {
                            setDebitAmount(numericValue);
                          }
                        }}
                        error={!!debitAmountError}
                        helperText={debitAmountError || "Enter the expense amount in rupees"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <RupeeIcon sx={{ color: '#9c27b0', fontSize: '1.25rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#f44336',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f44336',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f44336',
                          },
                          '& .MuiInputBase-input': {
                            padding: '16px 14px',
                          }
                        }}
                      />
                    </motion.div>
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.08, duration: 0.4 }}>
                      <FormControl 
                        fullWidth
                        error={!!debitCategoryError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#f44336',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f44336',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f44336',
                          }
                        }}
                      >
                      <InputLabel id="category-label">Expense Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={debitCategory}
                        label="Expense Category"
                        onChange={(e) => {
                          setDebitCategory(e.target.value);
                          if (e.target.value !== 'Others') {
                            setDebitCustomCategory('');
                            setDebitCustomCategoryError('');
                          }
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon sx={{ color: '#9c27b0', fontSize: '1.25rem', ml: -0.5 }} />
                          </InputAdornment>
                        }
                      >
                        {debitCategories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {debitCategoryError || "Select the category that best describes this expense"}
                      </FormHelperText>
                    </FormControl>
                    </motion.div>

                    {debitCategory === 'Others' && (
                      <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.16, duration: 0.4 }}>
                        <TextField
                          label="Custom Category"
                          placeholder="Enter your custom category name"
                          fullWidth
                          value={debitCustomCategory}
                          onChange={(e) => setDebitCustomCategory(e.target.value)}
                          error={!!debitCustomCategoryError}
                          helperText={debitCustomCategoryError || "Enter a name for your custom category"}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#f44336',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#f44336',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#f44336',
                            },
                            '& .MuiInputBase-input': {
                              padding: '16px 14px',
                            }
                          }}
                        />
                      </motion.div>
                    )}
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.24, duration: 0.4 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date of Expense"
                          value={debitDate}
                          onChange={(newDate: Date | null) => setDebitDate(newDate)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: false,
                              helperText: "Select the date when this expense occurred",
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EventIcon sx={{ color: '#f44336', fontSize: '1.25rem' }} />
                                  </InputAdornment>
                                ),
                              },
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  height: '56px',
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#f44336',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#f44336',
                                    borderWidth: 2,
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#f44336',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '16px 14px',
                                }
                              }
                            }
                          }}
                        />
                    </LocalizationProvider>
                    </motion.div>
                    
                    <motion.div variants={formFieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.32, duration: 0.4 }}>
                      <TextField
                        label="Additional Notes"
                        placeholder="Any additional details about this expense..."
                        fullWidth
                        multiline
                        rows={4}
                        value={debitNotes}
                        onChange={(e) => setDebitNotes(e.target.value)}
                        helperText="Optional: Add any notes or description"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            minHeight: '120px',
                            borderRadius: 2,
                            alignItems: 'flex-start',
                            '&:hover fieldset': {
                              borderColor: '#f44336',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f44336',
                              borderWidth: 2,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#f44336',
                          },
                          '& .MuiInputBase-input': {
                            padding: '16px 14px',
                          }
                        }}
                      />
                    </motion.div>
                  </Box>
                  
                  <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4, duration: 0.4 }}>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="inherit" 
                        component={Link}
                        to="/"
                        sx={{ 
                          flex: 1,
                          py: 1.75,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained"
                        onClick={handleDebitSubmit}
                        sx={{ 
                          flex: 2,
                          py: 1.75,
                          borderRadius: 2,
                          backgroundColor: '#f44336',
                          color: '#fff',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0px 8px 16px rgba(244, 67, 54, 0.25)',
                          '&:hover': {
                            backgroundColor: '#e53935',
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 10px 20px rgba(244, 67, 54, 0.38)',
                          }
                        }}
                      >
                        Save Expense
                      </Button>
                    </Box>
                  </motion.div>
                </Paper>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Success Modals */}
        <CreditSavedModal 
          open={showCreditSuccessModal}
          onClose={() => {
            setShowCreditSuccessModal(false);
            setCreditAmount('');
            setCreditSource('');
            setCreditCustomSource('');
            setCreditNotes('');
            setCreditAmountError('');
            setCreditSourceError('');
            setCreditCustomSourceError('');
          }}
          onAddAnother={() => {
            setShowCreditSuccessModal(false);
            setCreditAmount('');
            setCreditSource('');
            setCreditCustomSource('');
            setCreditNotes('');
            setCreditAmountError('');
            setCreditSourceError('');
            setCreditCustomSourceError('');
          }}
          onGoToDashboard={() => {
            setShowCreditSuccessModal(false);
            navigate('/');
          }}
          amount={parseFloat(creditAmount) || 0}
        />

        <ExpenseSavedModal 
          open={showDebitSuccessModal}
          onClose={() => {
            setShowDebitSuccessModal(false);
            setDebitAmount('');
            setDebitCategory('');
            setDebitCustomCategory('');
            setDebitNotes('');
            setDebitAmountError('');
            setDebitCategoryError('');
            setDebitCustomCategoryError('');
          }}
          onAddAnother={() => {
            setShowDebitSuccessModal(false);
            setDebitAmount('');
            setDebitCategory('');
            setDebitCustomCategory('');
            setDebitNotes('');
            setDebitAmountError('');
            setDebitCategoryError('');
            setDebitCustomCategoryError('');
          }}
          onGoToDashboard={() => {
            setShowDebitSuccessModal(false);
            navigate('/');
          }}
          amount={parseFloat(debitAmount) || 0}
        />
        </motion.div>
      </Container>
    </Box>
  );
};

export default AddTransaction;
