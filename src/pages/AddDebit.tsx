import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  ArrowBack as ArrowBackIcon,
  CurrencyRupee as RupeeIcon,
  Event as EventIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import ExpenseSavedModal from '../components/ExpenseSavedModal';

const AddDebit: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];
  
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState<string>('');
  
  const [amountError, setAmountError] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');
  const [customCategoryError, setCustomCategoryError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
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

  const handleSubmit = () => {
    // Reset errors
    setAmountError('');
    setCategoryError('');
    setCustomCategoryError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!amount.trim()) {
      setAmountError('Please enter an amount');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid positive amount');
      isValid = false;
    }
    
    if (!category) {
      setCategoryError('Please select a category');
      isValid = false;
    } else if (category === 'Others' && !customCategory.trim()) {
      setCustomCategoryError('Please enter a custom category name');
      isValid = false;
    }
    
    if (isValid) {
      const finalCategory = category === 'Others' ? customCategory : category;
      addTransaction({
        amount: parseFloat(amount),
        date: date || new Date(),
        type: 'debit',
        category: finalCategory,
        notes
      });
      
      // Show success modal
      setShowSuccessModal(true);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // Clear custom category and its error when switching away from "Others"
    if (value !== 'Others') {
      setCustomCategory('');
      setCustomCategoryError('');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Clear form when close button is clicked
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setNotes('');
    setAmountError('');
    setCategoryError('');
    setCustomCategoryError('');
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    // Reset form to add another expense
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setNotes('');
    setAmountError('');
    setCategoryError('');
    setCustomCategoryError('');
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                Add Expense
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Main Form Container */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fff8f8 100%)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
              Expense Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Amount"
                placeholder="0.00"
                fullWidth
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and single decimal point
                  const numericValue = value.replace(/[^0-9.]/g, '');
                  // Prevent multiple decimal points
                  const parts = numericValue.split('.');
                  if (parts.length > 2) {
                    setAmount(parts[0] + '.' + parts.slice(1).join(''));
                  } else {
                    setAmount(numericValue);
                  }
                }}
                onKeyPress={(e) => {
                  // Prevent non-numeric characters (except decimal point)
                  if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                error={!!amountError}
                helperText={amountError || "Enter the expense amount in rupees"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeeIcon sx={{ color: theme.palette.error.main }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.error.main,
                  }
                }}
              />
              
              <FormControl 
                fullWidth 
                error={!!categoryError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.error.main,
                  }
                }}
              >
                <InputLabel id="category-label">Expense Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Expense Category"
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: theme.palette.error.main }} />
                    </InputAdornment>
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {categoryError || "Select the category that best describes this expense"}
                </FormHelperText>
              </FormControl>

              {/* Custom Category Input - Shows when "Others" is selected */}
              {category === 'Others' && (
                <TextField
                  label="Custom Category"
                  placeholder="Enter your custom category name"
                  fullWidth
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  error={!!customCategoryError}
                  helperText={customCategoryError || "Enter a name for your custom category"}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.error.main,
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.error.main,
                    }
                  }}
                />
              )}
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Expense"
                  value={date}
                  onChange={(newDate: Date | null) => setDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: false,
                      helperText: "Select the date when this expense occurred",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon sx={{ color: theme.palette.error.main }} />
                          </InputAdornment>
                        ),
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.error.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.error.main,
                            borderWidth: 2,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.error.main,
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
              
              <TextField
                label="Additional Notes"
                placeholder="Any additional details about this expense..."
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                helperText="Optional: Add any notes or description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.error.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.error.main,
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                component={Link}
                to="/"
                sx={{ 
                  flex: 1,
                  py: 1.5, 
                  borderRadius: 2,
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                size="large"
                onClick={handleSubmit}
                sx={{ 
                  flex: 2,
                  py: 1.5, 
                  borderRadius: 2,
                  boxShadow: `0px 8px 16px ${theme.palette.error.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 10px 20px ${theme.palette.error.main}60`,
                  }
                }}
              >
                Save Expense
              </Button>
            </Box>
          </Paper>
        </motion.div>
        
        {/* Professional Tip Section */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.error.light}`,
              backgroundColor: `${theme.palette.error.main}08`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.error.dark, fontWeight: 600 }}>
              💡 Pro Tip
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Categorize your expenses to track spending patterns and identify areas for savings.
              Detailed expense tracking is the key to effective budgeting and financial control!
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <ExpenseSavedModal 
        open={showSuccessModal}
        onClose={handleModalClose}
        onAddAnother={handleAddAnother}
        onGoToDashboard={handleGoToDashboard}
        amount={parseFloat(amount) || 0}
      />
    </Container>
  );
};

export default AddDebit;