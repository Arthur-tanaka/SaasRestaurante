import React, { useState } from 'react';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import SupportPage from './components/Support/SupportPage';
import ForgotPasswordPage from './components/ForgotPassword/ForgotPasswordPage';

type PageType = 'login' | 'register' | 'support' | 'forgot-password';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'login' && <LoginPage onNavigate={navigateTo} />}
      {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
      {currentPage === 'support' && <SupportPage onNavigate={navigateTo} />}
      {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={navigateTo} />}
    </div>
  );
}

export default App;