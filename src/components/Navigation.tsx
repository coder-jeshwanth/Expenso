import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalanceWallet as PassbookIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuOpen = Boolean(anchorEl);
  
  const navItems = [
    { name: t('nav.dashboard'), path: '/', icon: <DashboardIcon /> },
    { name: t('nav.passbook'), path: '/passbook', icon: <PassbookIcon /> },
    { name: t('nav.settings'), path: '/settings', icon: <SettingsIcon /> }
  ];
  
  // Desktop nav order: Dashboard, Passbook, Add Transaction (dropdown), Settings
  
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddIncome = () => {
    handleMenuClose();
    navigate('/add-transaction?type=credit');
  };

  const handleAddExpense = () => {
    handleMenuClose();
    navigate('/add-transaction?type=debit');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      {/* Close button at the top of drawer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton 
          onClick={toggleDrawer(false)}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(90deg)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box 
        sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <img 
          src={isDarkMode ? '/dark.png' : '/light.png'} 
          alt="Expenso Logo" 
          style={{ height: '40px', width: 'auto' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Expenzo
        </Typography>
      </Box>
      <List
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              sx={{
                bgcolor: isActiveRoute(item.path) 
                  ? `${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '20' : '10'}` 
                  : 'transparent',
                color: isActiveRoute(item.path) ? theme.palette.primary.main : 'inherit',
                borderRight: isActiveRoute(item.path) ? `4px solid ${theme.palette.primary.main}` : 'none',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '15' : '05'}`
                }
              }}
            >
              <ListItemIcon sx={{ color: isActiveRoute(item.path) ? theme.palette.primary.main : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Add Transaction Menu Item - positioned after Passbook, before Settings */}
        <ListItem disablePadding>
          <ListItemButton 
            component={Link}
            to="/add-transaction?type=credit"
            onClick={() => setDrawerOpen(false)}
            sx={{
              bgcolor: location.pathname === '/add-transaction'
                ? `${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '20' : '10'}` 
                : 'transparent',
              color: location.pathname === '/add-transaction' ? theme.palette.primary.main : 'inherit',
              borderRight: location.pathname === '/add-transaction' ? `4px solid ${theme.palette.primary.main}` : 'none',
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '15' : '05'}`
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === '/add-transaction' ? theme.palette.primary.main : 'inherit' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Transaction" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0} 
        sx={{ 
          borderBottom: 'none',
          width: { 
            xs: 'calc(100% - 32px)',    // Mobile: small margins
            sm: 'calc(100% - 80px)',     // Tablet: medium margins
            md: 'calc(100% - 200px)',    // Desktop: large margins
            lg: 'calc(100% - 400px)',    // Large desktop: extra large margins
            xl: 'calc(100% - 570px)'     // Extra large: maximum margins
          },
          maxWidth: '1400px',            // Maximum width cap
          margin: '0 auto',
          marginTop: { xs: '12px', sm: '16px', md: '20px', lg: '24px' },
          marginBottom: { xs: '8px', sm: '12px', md: '16px' },
          borderRadius: { xs: '50px', sm: '50px', md: '50px' },
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : '#ffffff',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                transition: 'transform 0.3s ease',
                transform: drawerOpen ? 'rotate(90deg)' : 'rotate(0deg)'
              }}
              onClick={toggleDrawer(!drawerOpen)}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <img 
                src={isDarkMode ? '/dark.png' : '/light.png'} 
                alt="Expenso Logo" 
                style={{ height: '32px', width: 'auto' }}
              />
              Expenzo
            </Box>
          </Typography>
          
          {!isMobile && (
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center',
                '&:hover > *': {
                  opacity: 0.5,
                },
                '& > *:hover': {
                  opacity: '1 !important',
                }
              }}
            >
              {/* Dashboard */}
              <Button 
                component={Link}
                to="/"
                variant="text"
                color="inherit"
                startIcon={<DashboardIcon />}
                sx={{ 
                  px: 2,
                  borderRadius: 0,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#9c27b0',
                    transform: isActiveRoute('/') ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  }
                }}
              >
                {t('nav.dashboard')}
              </Button>

              {/* Passbook */}
              <Button 
                component={Link}
                to="/passbook"
                variant="text"
                color="inherit"
                startIcon={<PassbookIcon />}
                sx={{ 
                  px: 2,
                  borderRadius: 0,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#9c27b0',
                    transform: isActiveRoute('/passbook') ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  }
                }}
              >
                {t('nav.passbook')}
              </Button>
              
              {/* Add Transaction Button with Dropdown */}
              <Box onMouseLeave={handleMenuClose}>
                <Button 
                  variant="text"
                  color="inherit"
                  startIcon={<AddIcon />}
                  onMouseEnter={handleMenuOpen}
                  sx={{ 
                    px: 2,
                    borderRadius: 0,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#9c27b0',
                      transform: location.pathname === '/add-transaction' ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  Add Transaction
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    onMouseLeave: handleMenuClose,
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 0,
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0px 8px 32px rgba(0, 0, 0, 0.4)' 
                        : '0px 8px 32px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={handleAddIncome}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: `${theme.palette.success.main}15`,
                      }
                    }}
                  >
                    <ListItemIcon>
                      <IncomeIcon sx={{ color: theme.palette.success.main }} />
                    </ListItemIcon>
                    <ListItemText primary="Add Income" />
                  </MenuItem>
                  <MenuItem 
                    onClick={handleAddExpense}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#9c27b015',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ExpenseIcon sx={{ color: '#9c27b0' }} />
                    </ListItemIcon>
                    <ListItemText primary="Add Expense" />
                  </MenuItem>
                </Menu>
              </Box>

              {/* Settings */}
              <Button 
                component={Link}
                to="/settings"
                variant="text"
                color="inherit"
                startIcon={<SettingsIcon />}
                sx={{ 
                  px: 2,
                  borderRadius: 0,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#9c27b0',
                    transform: isActiveRoute('/settings') ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  }
                }}
              >
                {t('nav.settings')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;