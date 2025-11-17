import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  useTheme,
  Alert
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', loginData.email);
    navigate('/');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', signupData.email);
    localStorage.setItem('userName', signupData.name);
    if (signupData.phone) {
      localStorage.setItem('userPhone', signupData.phone);
    }
    navigate('/');
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: { xs: 4, sm: 6 },
        perspective: '1000px'
      }}
    >
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Login Side (Front) */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 10px 40px rgba(0, 0, 0, 0.5)'
              : '0px 10px 40px rgba(0, 0, 0, 0.1)',
            backfaceVisibility: 'hidden',
            position: isFlipped ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: isFlipped ? 1 : 2
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img 
              src={theme.palette.mode === 'dark' ? '/dark.png' : '/light.png'} 
              alt="Expenso Logo" 
              style={{ height: isMobile ? '50px' : '60px', width: 'auto', marginBottom: '16px' }}
            />
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to continue to Expenso
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && !isFlipped && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              size={isMobile ? "small" : "medium"}
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              sx={{ 
                mb: 3,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              size={isMobile ? "small" : "medium"}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              sx={{ 
                mb: 2,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <MuiLink
                component="button"
                variant="body2"
                type="button"
                onClick={() => alert('Password reset functionality coming soon!')}
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                Forgot Password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size={isMobile ? "medium" : "large"}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 600,
                boxShadow: `0px 8px 16px ${theme.palette.primary.main}40`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0px 10px 20px ${theme.palette.primary.main}60`,
                }
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={handleFlip}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign Up
              </MuiLink>
            </Typography>
          </Box>
        </Paper>

        {/* Signup Side (Back) */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 10px 40px rgba(0, 0, 0, 0.5)'
              : '0px 10px 40px rgba(0, 0, 0, 0.1)',
            backfaceVisibility: 'hidden',
            position: isFlipped ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'rotateY(180deg)',
            zIndex: isFlipped ? 2 : 1
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img 
              src={theme.palette.mode === 'dark' ? '/dark.png' : '/light.png'} 
              alt="Expenso Logo" 
              style={{ height: isMobile ? '50px' : '60px', width: 'auto', marginBottom: '16px' }}
            />
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign up to start managing your expenses
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && isFlipped && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignupSubmit}>
            <TextField
              label="Full Name"
              fullWidth
              required
              size={isMobile ? "small" : "medium"}
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              sx={{ 
                mb: 2,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              size={isMobile ? "small" : "medium"}
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              sx={{ 
                mb: 2,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Phone Number (Optional)"
              type="tel"
              fullWidth
              size={isMobile ? "small" : "medium"}
              value={signupData.phone}
              onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
              sx={{ 
                mb: 2,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              size={isMobile ? "small" : "medium"}
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              sx={{ 
                mb: 2,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              helperText="Must be at least 6 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              size={isMobile ? "small" : "medium"}
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              sx={{ 
                mb: 3,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                  WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                  caretColor: theme.palette.text.primary,
                  borderRadius: 'inherit',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
                '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size={isMobile ? "medium" : "large"}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 600,
                boxShadow: `0px 8px 16px ${theme.palette.primary.main}40`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0px 10px 20px ${theme.palette.primary.main}60`,
                }
              }}
            >
              Sign Up
            </Button>
          </form>

          {/* Login Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={handleFlip}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;
