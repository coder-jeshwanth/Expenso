import React from 'react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Passbook from './pages/Passbook';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Layout wrapper that conditionally shows Navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <>
      {!isAuthPage && <Navigation />}
      {children}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <CssBaseline />
        <TransactionProvider>
          <Router>
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/auth" 
                  element={
                    <PublicRoute>
                      <Auth />
                    </PublicRoute>
                  } 
                />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-transaction" 
                element={
                  <ProtectedRoute>
                    <AddTransaction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/passbook" 
                element={
                  <ProtectedRoute>
                    <Passbook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AppLayout>
          </Router>
        </TransactionProvider>
      </CustomThemeProvider>
    </LanguageProvider>
  );
}

export default App;
