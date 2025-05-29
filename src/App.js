// App.js
import React, { useState, useEffect } from 'react';
import LoginPage from './loginpage/Login';
import MainLayout from './layout/MainLayout';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check session storage on load
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const roleId = sessionStorage.getItem('roleId');
    if (userId && roleId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? <MainLayout /> : <LoginPage onLogin={handleLogin} />}
    </BrowserRouter>
  );
}

export default App;
