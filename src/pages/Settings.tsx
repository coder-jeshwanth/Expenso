import React, { useState, useEffect } from 'react';
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
  useTheme,
  TextField,
  Modal,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowBack as ArrowBackIcon,
  Brightness4 as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import useMediaQuery from '@mui/material/useMediaQuery';

interface UserProfile {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

const Settings: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [openSecurityModal, setOpenSecurityModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: ''
  });

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert(t('profile.savedSuccess'));
    setOpenProfileModal(false);
  };

  const handleLanguageSelect = (lang: 'English' | 'Kannada' | 'Telugu') => {
    setLanguage(lang);
    setOpenLanguageModal(false);
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    // Save password logic here
    localStorage.setItem('userPassword', newPassword);
    alert('Password changed successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOpenSecurityModal(false);
  };
  
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
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
                {t('settings.backToDashboard')}
              </Button>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {t('settings.title')}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={1}
            sx={{
              borderRadius: { xs: 3, sm: 4 },
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0px 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0px 8px 32px rgba(0, 0, 0, 0.08)',
              mb: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <List sx={{ py: 0 }}>
              <ListItem 
                sx={{ py: { xs: 1.5, sm: 2 }, cursor: 'pointer' }}
                onClick={() => setOpenProfileModal(true)}
              >
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.myProfile')} 
                  secondary={t('settings.myProfileDesc')}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
                <ChevronRightIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: { xs: 1.5, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <DarkModeIcon sx={{ color: theme.palette.primary.main, fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.darkMode')} 
                  secondary={isDarkMode ? t('settings.darkModeEnabled') : t('settings.lightModeEnabled')}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
                <Switch 
                  edge="end" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: { xs: 1.5, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.notifications')} 
                  secondary={t('settings.notificationsDesc')}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
                <Switch edge="end" defaultChecked size={isMobile ? "small" : "medium"} />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem 
                sx={{ py: { xs: 1.5, sm: 2 }, cursor: 'pointer' }}
                onClick={() => setOpenLanguageModal(true)}
              >
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <LanguageIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.language')} 
                  secondary={language}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
                <ChevronRightIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem 
                sx={{ py: { xs: 1.5, sm: 2 }, cursor: 'pointer' }}
                onClick={() => setOpenSecurityModal(true)}
              >
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <SecurityIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.security')} 
                  secondary={t('settings.securityDesc')}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
                <ChevronRightIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem sx={{ py: { xs: 1.5, sm: 2 } }}>
                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <InfoIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('settings.about')} 
                  secondary={t('settings.version')}
                  primaryTypographyProps={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
                  secondaryTypographyProps={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                />
              </ListItem>
            </List>
          </Paper>
        </motion.div>
      </motion.div>

      {/* Profile Modal */}
      <Modal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        aria-labelledby="profile-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 600 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: 24,
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ color: theme.palette.primary.main, mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 28, sm: 32 } }} />
              <Typography id="profile-modal-title" variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
                {t('profile.title')}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenProfileModal(false)} size={isMobile ? "small" : "medium"}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label={t('profile.name')}
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
              
              <TextField
                fullWidth
                label={t('profile.dateOfBirth')}
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label={t('profile.phoneNumber')}
                value={profile.phoneNumber}
                onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
              
              <TextField
                fullWidth
                label={t('profile.email')}
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: { xs: 1, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                onClick={() => setOpenProfileModal(false)}
                sx={{ borderRadius: 2, px: 3 }}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                {t('profile.cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                }}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                {t('profile.save')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Language Modal */}
      <Modal
        open={openLanguageModal}
        onClose={() => setOpenLanguageModal(false)}
        aria-labelledby="language-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: 24,
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon sx={{ color: theme.palette.primary.main, mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 28, sm: 32 } }} />
              <Typography id="language-modal-title" variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
                {t('language.title')}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenLanguageModal(false)} size={isMobile ? "small" : "medium"}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ py: 0 }}>
            {['English', 'Kannada', 'Telugu'].map((lang) => (
              <React.Fragment key={lang}>
                <ListItem 
                  sx={{ 
                    py: { xs: 1.5, sm: 2 }, 
                    cursor: 'pointer',
                    bgcolor: language === lang ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderRadius: 2,
                    mb: 1
                  }}
                  onClick={() => handleLanguageSelect(lang as 'English' | 'Kannada' | 'Telugu')}
                >
                  <ListItemText 
                    primary={lang} 
                    primaryTypographyProps={{
                      fontWeight: language === lang ? 600 : 400,
                      color: language === lang ? 'primary.main' : 'text.primary',
                      fontSize: { xs: '0.95rem', sm: '1rem' }
                    }}
                  />
                  {language === lang && (
                    <Box 
                      sx={{ 
                        width: { xs: 6, sm: 8 }, 
                        height: { xs: 6, sm: 8 }, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main' 
                      }} 
                    />
                  )}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Modal>

      {/* Security/Password Change Modal */}
      <Modal
        open={openSecurityModal}
        onClose={() => setOpenSecurityModal(false)}
        aria-labelledby="security-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 500 },
            bgcolor: 'background.paper',
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: 24,
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ color: theme.palette.primary.main, mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 28, sm: 32 } }} />
              <Typography id="security-modal-title" variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
                Change Password
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenSecurityModal(false)} size={isMobile ? "small" : "medium"}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: { xs: 1, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                onClick={() => setOpenSecurityModal(false)}
                sx={{ borderRadius: 2, px: 3 }}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                }}
                size={isMobile ? "small" : "medium"}
                fullWidth={isMobile}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Settings;