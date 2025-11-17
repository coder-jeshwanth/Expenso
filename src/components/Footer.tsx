import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Favorite as HeartIcon } from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 6,
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.5)' 
          : 'rgba(255, 255, 255, 0.5)',
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: theme.palette.text.secondary,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        Made by <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Jeshy</span>
        <HeartIcon
          sx={{
            fontSize: { xs: 14, sm: 16 },
            color: theme.palette.error.main,
            animation: 'heartbeat 1.5s ease-in-out infinite',
            '@keyframes heartbeat': {
              '0%': { transform: 'scale(1)' },
              '14%': { transform: 'scale(1.2)' },
              '28%': { transform: 'scale(1)' },
              '42%': { transform: 'scale(1.2)' },
              '70%': { transform: 'scale(1)' },
            },
          }}
        />
        with love
      </Typography>
    </Box>
  );
};

export default Footer;
