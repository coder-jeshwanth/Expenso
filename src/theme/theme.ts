import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#AC1BD7', // Purple
      light: '#C855E8',
      dark: '#8B15B3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // Red
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    info: {
      main: '#3B82F6', // Blue
    },
    success: {
      main: '#10B981', // Green
    },
    background: {
      default: '#F9FAFB',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 6px 8px rgba(0, 0, 0, 0.05)',
    '0px 8px 12px rgba(0, 0, 0, 0.05)',
    '0px 10px 16px rgba(0, 0, 0, 0.05)',
    '0px 12px 18px rgba(0, 0, 0, 0.05)',
    '0px 14px 20px rgba(0, 0, 0, 0.05)',
    '0px 16px 24px rgba(0, 0, 0, 0.05)',
    '0px 18px 28px rgba(0, 0, 0, 0.05)',
    '0px 20px 32px rgba(0, 0, 0, 0.05)',
    '0px 22px 36px rgba(0, 0, 0, 0.05)',
    '0px 24px 38px rgba(0, 0, 0, 0.05)',
    '0px 26px 40px rgba(0, 0, 0, 0.05)',
    '0px 28px 42px rgba(0, 0, 0, 0.05)',
    '0px 30px 44px rgba(0, 0, 0, 0.05)',
    '0px 32px 46px rgba(0, 0, 0, 0.05)',
    '0px 34px 48px rgba(0, 0, 0, 0.05)',
    '0px 36px 50px rgba(0, 0, 0, 0.05)',
    '0px 38px 52px rgba(0, 0, 0, 0.05)',
    '0px 40px 54px rgba(0, 0, 0, 0.05)',
    '0px 42px 56px rgba(0, 0, 0, 0.05)',
    '0px 44px 58px rgba(0, 0, 0, 0.05)',
    '0px 46px 60px rgba(0, 0, 0, 0.05)',
    '0px 48px 62px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
        contained: {
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;