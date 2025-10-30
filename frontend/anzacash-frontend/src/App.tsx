import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerHomePage from './components/CustomerHomePage';
import LoginPage from './components/LoginPage';

function App() {
  const [userPosition, setUserPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and get their position from localStorage
    const storedUser = localStorage.getItem('anzacash_user');
    const token = localStorage.getItem('anzacash_token');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserPosition(user.usr_posio || null);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              userPosition === 'customer' ?
              <CustomerHomePage /> :
              <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
