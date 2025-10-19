import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Define the theme context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Define light and dark theme configurations
const getTheme = (isDarkMode: boolean): Theme => {
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
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
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B', // Amber
      },
      info: {
        main: '#3B82F6', // Blue
      },
      success: {
        main: '#10B981', // Green
        light: '#34D399',
        dark: '#059669',
      },
      background: {
        default: isDarkMode ? '#0f0f23' : '#F9FAFB',
        paper: isDarkMode ? '#1a1a2e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#111827',
        secondary: isDarkMode ? '#a1a1aa' : '#6B7280',
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
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDarkMode 
              ? '0px 4px 20px rgba(0, 0, 0, 0.3)'
              : '0px 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1a1a2e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#111827',
          },
        },
      },
    },
  });
};

// Theme provider component
interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  // Get initial dark mode state from localStorage
  const getInitialDarkMode = (): boolean => {
    const saved = localStorage.getItem('expenso-dark-mode');
    return saved ? JSON.parse(saved) : false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode);

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenso-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = getTheme(isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};