import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingQuotes: React.FC = () => {
  const theme = useTheme();
  
  const quotes = [
    "Save money, and money will save you.",
    "Track it today, enjoy it tomorrow!",
    "Small savings lead to big dreams.",
    "Control your money, don't let it control you.",
    "Spend smart, live better!",
    "Every rupee counts — literally!",
    "Make your expenses make sense.",
    "Budgeting is self-care for your wallet.",
    "Plan. Save. Smile.",
    "Your balance reflects your mindset."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <Box
      sx={{
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
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
            variant="h5"
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.main,
              fontStyle: 'italic',
              textAlign: 'center',
              px: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: theme.palette.mode === 'dark' 
                ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' 
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            💸 {quotes[currentQuoteIndex]}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default RotatingQuotes;