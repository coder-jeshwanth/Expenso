import React from 'react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AddCredit from './pages/AddCredit';
import AddDebit from './pages/AddDebit';
import Passbook from './pages/Passbook';
import Settings from './pages/Settings';

function App() {
  return (
    <LanguageProvider>
      <CustomThemeProvider>
        <CssBaseline />
        <TransactionProvider>
          <Router>
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-credit" element={<AddCredit />} />
              <Route path="/add-debit" element={<AddDebit />} />
              <Route path="/passbook" element={<Passbook />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Router>
        </TransactionProvider>
      </CustomThemeProvider>
    </LanguageProvider>
  );
}

export default App;
