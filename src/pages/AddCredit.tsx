import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon, 
  CurrencyRupee as RupeeIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import CreditSavedModal from '../components/CreditSavedModal';

const AddCredit: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const { t } = useLanguage();
  
  const [source, setSource] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState<string>('');
  
  const [sourceError, setSourceError] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
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
    setSourceError('');
    setAmountError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!source.trim()) {
      setSourceError('Please enter the source of income');
      isValid = false;
    }
    
    if (!amount.trim()) {
      setAmountError('Please enter an amount');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid positive amount');
      isValid = false;
    }
    
    if (isValid) {
      addTransaction({
        amount: parseFloat(amount),
        date: date || new Date(),
        type: 'credit',
        source,
        notes
      });
      
      // Show success modal
      setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Clear form when close button is clicked
    setSource('');
    setAmount('');
    setNotes('');
    setSourceError('');
    setAmountError('');
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
    // Reset form to add another credit
    setSource('');
    setAmount('');
    setNotes('');
    setSourceError('');
    setAmountError('');
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                component={Link} 
                to="/" 
                startIcon={<ArrowBackIcon />}
                sx={{ mr: { xs: 2, sm: 3 } }}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              >
                Back to Dashboard
              </Button>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Add Credit
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Main Form Container */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: { xs: 3, sm: 4 },
              boxShadow: theme.palette.mode === 'dark' 
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
            }}
          >
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 600, color: theme.palette.text.primary }}>
              Credit Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
              <TextField
                label="Income Source"
                placeholder="e.g., Salary, Freelance, Investment"
                fullWidth
                size={isMobile ? "small" : "medium"}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                error={!!sourceError}
                helperText={sourceError || "Enter the source of your income"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.success.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.success.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.success.main,
                  }
                }}
              />
              
              <TextField
                label="Amount"
                placeholder="0.00"
                fullWidth
                size={isMobile ? "small" : "medium"}
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
                helperText={amountError || "Enter the amount in rupees"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RupeeIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.success.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.success.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.success.main,
                  }
                }}
              />
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Received"
                  value={date}
                  onChange={(newDate: Date | null) => setDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: false,
                      helperText: "Select the date when you received this income",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.success.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.success.main,
                            borderWidth: 2,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.success.main,
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
              
              <TextField
                label="Additional Notes"
                placeholder="Any additional details about this income..."
                fullWidth
                size={isMobile ? "small" : "medium"}
                multiline
                rows={isMobile ? 3 : 4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                helperText="Optional: Add any notes or description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.success.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.success.main,
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.success.main,
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                size={isMobile ? "medium" : "large"}
                component={Link}
                to="/"
                fullWidth={isMobile}
                sx={{ 
                  flex: { sm: 1 },
                  py: { xs: 1.2, sm: 1.5 }, 
                  borderRadius: 2,
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                size={isMobile ? "medium" : "large"}
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{ 
                  flex: { sm: 2 },
                  py: { xs: 1.2, sm: 1.5 }, 
                  borderRadius: 2,
                  boxShadow: `0px 8px 16px ${theme.palette.success.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0px 10px 20px ${theme.palette.success.main}60`,
                  }
                }}
              >
                Save Credit
              </Button>
            </Box>
          </Paper>
        </motion.div>
        
        {/* Professional Tip Section */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 2, sm: 3 },
              border: `1px solid ${theme.palette.success.light}`,
              backgroundColor: `${theme.palette.success.main}08`,
              textAlign: 'center'
            }}
          >
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 1, color: theme.palette.success.dark, fontWeight: 600 }}>
              💡 Pro Tip
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
              Track all your income sources to get a complete picture of your financial health.
              Regular income tracking helps in better budgeting and financial planning!
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <CreditSavedModal 
        open={showSuccessModal}
        onClose={handleModalClose}
        onAddAnother={handleAddAnother}
        onGoToDashboard={handleGoToDashboard}
        amount={parseFloat(amount) || 0}
      />
    </Container>
  );
};

export default AddCredit;