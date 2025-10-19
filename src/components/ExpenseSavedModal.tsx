import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  useTheme,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseSavedModalProps {
  open: boolean;
  onClose: () => void;
  onAddAnother: () => void;
  onGoToDashboard: () => void;
  amount: number;
}

const ExpenseSavedModal: React.FC<ExpenseSavedModalProps> = ({ open, onClose, onAddAnother, onGoToDashboard, amount }) => {
  const theme = useTheme();
  
  const motivationalMessages = [
    "Easy there, big spender 😅 — keep an eye on your wallet!",
    "Money gone, lesson learned 💭 — spend wisely next time!",
    "Every rupee counts! Try to save a little more tomorrow 💰",
    "Nice tracking! Awareness is the first step to control 💪",
    "Oof! That expense stings a bit — stay smart with your budget 📉",
    "Your expense is noted! Don't forget to treat your savings too 💸",
    "Small spends add up fast — keep a close watch 👀",
    "Tracking is winning — you're already managing better 🧾",
    "Be proud! Most people don't even track their spending 🎯",
    "Try skipping a small expense tomorrow — your balance will thank you 🙌",
    "Good job logging it! Now let's aim for fewer red entries 🔴",
    "Expense saved! Stay strong against temptations 😎",
    "Your wallet whispered: 'Please slow down a bit!' 😂",
    "Expense recorded — don't let it become a habit 💡",
    "Nice! Awareness today means freedom tomorrow 💼"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % motivationalMessages.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [open, motivationalMessages.length]);

  // Reset to first message when modal opens
  useEffect(() => {
    if (open) {
      setCurrentMessageIndex(0);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #fff8f8 100%)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0px 12px 40px rgba(0, 0, 0, 0.5)'
            : '0px 12px 40px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: theme.palette.text.secondary
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 10,
            delay: 0.1 
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: `0 8px 24px ${theme.palette.error.main}40`
            }}
          >
            <CheckIcon 
              sx={{ 
                fontSize: 48, 
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} 
            />
          </Box>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.error.main,
              mb: 1
            }}
          >
            Expense Saved!
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 3
            }}
          >
            ₹{amount.toLocaleString('en-IN')} has been recorded
          </Typography>
        </motion.div>

        {/* Rotating Messages */}
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  px: 2,
                  lineHeight: 1.6,
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: theme.palette.mode === 'dark' 
                    ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' 
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              >
                💸 {motivationalMessages[currentMessageIndex]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={onAddAnother}
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: `${theme.palette.error.main}08`
                }
              }}
            >
              Add Another
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onGoToDashboard}
              sx={{
                boxShadow: `0 4px 12px ${theme.palette.error.main}40`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${theme.palette.error.main}50`
                }
              }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseSavedModal;