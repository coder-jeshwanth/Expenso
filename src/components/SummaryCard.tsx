import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-4px)'
        },
        transition: 'all 0.3s ease-in-out'
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, transparent 50%, ${color}15 50%)`,
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              mr: 1.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: `${color}15`,
              color: color
            }}>
              {icon}
            </Box>
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 'medium' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            ₹{amount.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;