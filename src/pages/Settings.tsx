import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowBack as ArrowBackIcon,
  Brightness4 as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Settings
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
              mb: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <List sx={{ py: 0 }}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <DarkModeIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode" 
                  secondary={isDarkMode ? "Dark theme enabled" : "Light theme enabled"} 
                />
                <Switch 
                  edge="end" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  color="primary"
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" secondary="Get alerts for budget limits" />
                <Switch edge="end" defaultChecked />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Language" secondary="English" />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" secondary="Password & authentication" />
              </ListItem>
            </List>
          </Paper>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              mb: 4
            }}
          >
            <List sx={{ py: 0 }}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" secondary="Version 1.0.0" />
              </ListItem>
            </List>
          </Paper>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="error"
              sx={{ borderRadius: 2 }}
            >
              Clear All Data
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Settings;