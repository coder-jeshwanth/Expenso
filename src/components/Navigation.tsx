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
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AccountBalanceWallet as PassbookIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { name: 'Add Credit', path: '/add-credit', icon: <AddIcon /> },
    { name: 'Add Expense', path: '/add-debit', icon: <RemoveIcon /> },
    { name: 'Passbook', path: '/passbook', icon: <PassbookIcon /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon /> }
  ];
  
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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Expenso
        </Typography>
      </Box>
      <List>
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
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Box component={Link} to="/" sx={{ textDecoration: 'none', color: theme.palette.primary.main }}>
              Expenso
            </Box>
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.name}
                  component={Link}
                  to={item.path}
                  variant={isActiveRoute(item.path) ? "contained" : "text"}
                  color={isActiveRoute(item.path) ? "primary" : "inherit"}
                  startIcon={item.icon}
                  sx={{ 
                    px: 2,
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isActiveRoute(item.path) 
                        ? `0 4px 10px ${theme.palette.primary.main}${theme.palette.mode === 'dark' ? '40' : '20'}` 
                        : 'none'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
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