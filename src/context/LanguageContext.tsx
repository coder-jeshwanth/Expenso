import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'English' | 'Kannada' | 'Telugu';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('English');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations object
const translations: Record<Language, Record<string, string>> = {
  English: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.addExpense': 'Add Expense',
    'nav.addCredit': 'Add Credit',
    'nav.passbook': 'Passbook',
    'nav.goals': 'Goals',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalBalance': 'Total Balance',
    'dashboard.totalIncome': 'Total Income',
    'dashboard.totalExpenses': 'Total Expenses',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.expenseBreakdown': 'Expense Breakdown',
    'dashboard.monthlyTrend': 'Monthly Trend',
    'dashboard.income': 'Income',
    'dashboard.expenses': 'Expenses',
    'dashboard.noTransactions': 'No transactions yet',
    'dashboard.viewAll': 'View All',
    
    // Settings
    'settings.title': 'Settings',
    'settings.backToDashboard': 'Back to Dashboard',
    'settings.myProfile': 'My Profile',
    'settings.myProfileDesc': 'Manage your personal information',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeEnabled': 'Dark theme enabled',
    'settings.lightModeEnabled': 'Light theme enabled',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Get alerts for budget limits',
    'settings.language': 'Language',
    'settings.security': 'Security',
    'settings.securityDesc': 'Password & authentication',
    'settings.helpSupport': 'Help & Support',
    'settings.about': 'About',
    'settings.version': 'Version 1.0.0',
    
    // Profile Modal
    'profile.title': 'My Profile',
    'profile.name': 'Name',
    'profile.dateOfBirth': 'Date of Birth',
    'profile.phoneNumber': 'Phone Number',
    'profile.email': 'Email Address',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save Profile',
    'profile.savedSuccess': 'Profile saved successfully!',
    
    // Language Modal
    'language.title': 'Select Language',
    
    // Add Expense
    'addExpense.title': 'Add Expense',
    'addExpense.amount': 'Amount',
    'addExpense.category': 'Category',
    'addExpense.description': 'Description',
    'addExpense.date': 'Date',
    'addExpense.submit': 'Add Expense',
    'addExpense.cancel': 'Cancel',
    
    // Add Credit
    'addCredit.title': 'Add Credit',
    'addCredit.amount': 'Amount',
    'addCredit.source': 'Source',
    'addCredit.description': 'Description',
    'addCredit.date': 'Date',
    'addCredit.submit': 'Add Credit',
    'addCredit.cancel': 'Cancel',
    
    // Passbook
    'passbook.title': 'Passbook',
    'passbook.allTransactions': 'All Transactions',
    'passbook.filter': 'Filter',
    'passbook.search': 'Search',
    'passbook.credit': 'Credit',
    'passbook.debit': 'Debit',
    'passbook.noTransactions': 'No transactions found',
    
    // Goals
    'goals.title': 'Financial Goals',
    'goals.addGoal': 'Add Goal',
    'goals.goalName': 'Goal Name',
    'goals.targetAmount': 'Target Amount',
    'goals.currentAmount': 'Current Amount',
    'goals.deadline': 'Deadline',
    'goals.progress': 'Progress',
    'goals.noGoals': 'No goals yet',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  
  Kannada: {
    // Navigation
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.addExpense': 'ಖರ್ಚು ಸೇರಿಸಿ',
    'nav.addCredit': 'ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ',
    'nav.passbook': 'ಪಾಸ್‌ಬುಕ್',
    'nav.goals': 'ಗುರಿಗಳು',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    
    // Dashboard
    'dashboard.title': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'dashboard.totalBalance': 'ಒಟ್ಟು ಬ್ಯಾಲೆನ್ಸ್',
    'dashboard.totalIncome': 'ಒಟ್ಟು ಆದಾಯ',
    'dashboard.totalExpenses': 'ಒಟ್ಟು ಖರ್ಚುಗಳು',
    'dashboard.recentTransactions': 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು',
    'dashboard.expenseBreakdown': 'ಖರ್ಚು ವಿವರಣೆ',
    'dashboard.monthlyTrend': 'ಮಾಸಿಕ ಟ್ರೆಂಡ್',
    'dashboard.income': 'ಆದಾಯ',
    'dashboard.expenses': 'ಖರ್ಚುಗಳು',
    'dashboard.noTransactions': 'ಇನ್ನೂ ವಹಿವಾಟುಗಳಿಲ್ಲ',
    'dashboard.viewAll': 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    
    // Settings
    'settings.title': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'settings.backToDashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    'settings.myProfile': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    'settings.myProfileDesc': 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
    'settings.darkMode': 'ಡಾರ್ಕ್ ಮೋಡ್',
    'settings.darkModeEnabled': 'ಡಾರ್ಕ್ ಥೀಮ್ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
    'settings.lightModeEnabled': 'ಲೈಟ್ ಥೀಮ್ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
    'settings.notifications': 'ಅಧಿಸೂಚನೆಗಳು',
    'settings.notificationsDesc': 'ಬಜೆಟ್ ಮಿತಿಗಳಿಗಾಗಿ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ',
    'settings.language': 'ಭಾಷೆ',
    'settings.security': 'ಭದ್ರತೆ',
    'settings.securityDesc': 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ದೃಢೀಕರಣ',
    'settings.helpSupport': 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    'settings.about': 'ಕುರಿತು',
    'settings.version': 'ಆವೃತ್ತಿ 1.0.0',
    
    // Profile Modal
    'profile.title': 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    'profile.name': 'ಹೆಸರು',
    'profile.dateOfBirth': 'ಹುಟ್ಟಿದ ದಿನಾಂಕ',
    'profile.phoneNumber': 'ಫೋನ್ ಸಂಖ್ಯೆ',
    'profile.email': 'ಇಮೇಲ್ ವಿಳಾಸ',
    'profile.cancel': 'ರದ್ದುಮಾಡಿ',
    'profile.save': 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    'profile.savedSuccess': 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',
    
    // Language Modal
    'language.title': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    
    // Add Expense
    'addExpense.title': 'ಖರ್ಚು ಸೇರಿಸಿ',
    'addExpense.amount': 'ಮೊತ್ತ',
    'addExpense.category': 'ವರ್ಗ',
    'addExpense.description': 'ವಿವರಣೆ',
    'addExpense.date': 'ದಿನಾಂಕ',
    'addExpense.submit': 'ಖರ್ಚು ಸೇರಿಸಿ',
    'addExpense.cancel': 'ರದ್ದುಮಾಡಿ',
    
    // Add Credit
    'addCredit.title': 'ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ',
    'addCredit.amount': 'ಮೊತ್ತ',
    'addCredit.source': 'ಮೂಲ',
    'addCredit.description': 'ವಿವರಣೆ',
    'addCredit.date': 'ದಿನಾಂಕ',
    'addCredit.submit': 'ಕ್ರೆಡಿಟ್ ಸೇರಿಸಿ',
    'addCredit.cancel': 'ರದ್ದುಮಾಡಿ',
    
    // Passbook
    'passbook.title': 'ಪಾಸ್‌ಬುಕ್',
    'passbook.allTransactions': 'ಎಲ್ಲಾ ವಹಿವಾಟುಗಳು',
    'passbook.filter': 'ಫಿಲ್ಟರ್',
    'passbook.search': 'ಹುಡುಕಿ',
    'passbook.credit': 'ಕ್ರೆಡಿಟ್',
    'passbook.debit': 'ಡೆಬಿಟ್',
    'passbook.noTransactions': 'ಯಾವುದೇ ವಹಿವಾಟುಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    
    // Goals
    'goals.title': 'ಆರ್ಥಿಕ ಗುರಿಗಳು',
    'goals.addGoal': 'ಗುರಿ ಸೇರಿಸಿ',
    'goals.goalName': 'ಗುರಿಯ ಹೆಸರು',
    'goals.targetAmount': 'ಗುರಿ ಮೊತ್ತ',
    'goals.currentAmount': 'ಪ್ರಸ್ತುತ ಮೊತ್ತ',
    'goals.deadline': 'ಕಡೆಯ ದಿನಾಂಕ',
    'goals.progress': 'ಪ್ರಗತಿ',
    'goals.noGoals': 'ಇನ್ನೂ ಗುರಿಗಳಿಲ್ಲ',
    
    // Common
    'common.save': 'ಉಳಿಸಿ',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.delete': 'ಅಳಿಸಿ',
    'common.edit': 'ಸಂಪಾದಿಸಿ',
    'common.add': 'ಸೇರಿಸಿ',
    'common.close': 'ಮುಚ್ಚಿ',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ದೋಷ',
    'common.success': 'ಯಶಸ್ವಿ',
  },
  
  Telugu: {
    // Navigation
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.addExpense': 'ఖర్చు జోడించండి',
    'nav.addCredit': 'క్రెడిట్ జోడించండి',
    'nav.passbook': 'పాస్‌బుక్',
    'nav.goals': 'లక్ష్యాలు',
    'nav.settings': 'సెట్టింగ్‌లు',
    
    // Dashboard
    'dashboard.title': 'డ్యాష్‌బోర్డ్',
    'dashboard.totalBalance': 'మొత్తం బ్యాలెన్స్',
    'dashboard.totalIncome': 'మొత్తం ఆదాయం',
    'dashboard.totalExpenses': 'మొత్తం ఖర్చులు',
    'dashboard.recentTransactions': 'ఇటీవలి లావాదేవీలు',
    'dashboard.expenseBreakdown': 'ఖర్చు వివరణ',
    'dashboard.monthlyTrend': 'నెలవారీ ట్రెండ్',
    'dashboard.income': 'ఆదాయం',
    'dashboard.expenses': 'ఖర్చులు',
    'dashboard.noTransactions': 'ఇంకా లావాదేవీలు లేవు',
    'dashboard.viewAll': 'అన్నీ చూడండి',
    
    // Settings
    'settings.title': 'సెట్టింగ్‌లు',
    'settings.backToDashboard': 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు',
    'settings.myProfile': 'నా ప్రొఫైల్',
    'settings.myProfileDesc': 'మీ వ్యక్తిగత సమాచారాన్ని నిర్వహించండి',
    'settings.darkMode': 'డార్క్ మోడ్',
    'settings.darkModeEnabled': 'డార్క్ థీమ్ ప్రారంభించబడింది',
    'settings.lightModeEnabled': 'లైట్ థీమ్ ప్రారంభించబడింది',
    'settings.notifications': 'నోటిఫికేషన్‌లు',
    'settings.notificationsDesc': 'బడ్జెట్ పరిమితుల కోసం హెచ్చరికలు పొందండి',
    'settings.language': 'భాష',
    'settings.security': 'భద్రత',
    'settings.securityDesc': 'పాస్‌వర్డ్ మరియు ప్రామాణీకరణ',
    'settings.helpSupport': 'సహాయం & మద్దతు',
    'settings.about': 'గురించి',
    'settings.version': 'వెర్షన్ 1.0.0',
    
    // Profile Modal
    'profile.title': 'నా ప్రొఫైల్',
    'profile.name': 'పేరు',
    'profile.dateOfBirth': 'పుట్టిన తేదీ',
    'profile.phoneNumber': 'ఫోన్ నంబర్',
    'profile.email': 'ఇమెయిల్ చిరునామా',
    'profile.cancel': 'రద్దు చేయండి',
    'profile.save': 'ప్రొఫైల్ సేవ్ చేయండి',
    'profile.savedSuccess': 'ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!',
    
    // Language Modal
    'language.title': 'భాషను ఎంచుకోండి',
    
    // Add Expense
    'addExpense.title': 'ఖర్చు జోడించండి',
    'addExpense.amount': 'మొత్తం',
    'addExpense.category': 'వర్గం',
    'addExpense.description': 'వివరణ',
    'addExpense.date': 'తేదీ',
    'addExpense.submit': 'ఖర్చు జోడించండి',
    'addExpense.cancel': 'రద్దు చేయండి',
    
    // Add Credit
    'addCredit.title': 'క్రెడిట్ జోడించండి',
    'addCredit.amount': 'మొత్తం',
    'addCredit.source': 'మూలం',
    'addCredit.description': 'వివరణ',
    'addCredit.date': 'తేదీ',
    'addCredit.submit': 'క్రెడిట్ జోడించండి',
    'addCredit.cancel': 'రద్దు చేయండి',
    
    // Passbook
    'passbook.title': 'పాస్‌బుక్',
    'passbook.allTransactions': 'అన్ని లావాదేవీలు',
    'passbook.filter': 'ఫిల్టర్',
    'passbook.search': 'వెతకండి',
    'passbook.credit': 'క్రెడిట్',
    'passbook.debit': 'డెబిట్',
    'passbook.noTransactions': 'లావాదేవీలు కనుగొనబడలేదు',
    
    // Goals
    'goals.title': 'ఆర్థిక లక్ష్యాలు',
    'goals.addGoal': 'లక్ష్యం జోడించండి',
    'goals.goalName': 'లక్ష్యం పేరు',
    'goals.targetAmount': 'లక్ష్య మొత్తం',
    'goals.currentAmount': 'ప్రస్తుత మొత్తం',
    'goals.deadline': 'గడువు',
    'goals.progress': 'పురోగతి',
    'goals.noGoals': 'ఇంకా లక్ష్యాలు లేవు',
    
    // Common
    'common.save': 'సేవ్ చేయండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.delete': 'తొలగించండి',
    'common.edit': 'సవరించండి',
    'common.add': 'జోడించండి',
    'common.close': 'మూసివేయండి',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
  },
};
