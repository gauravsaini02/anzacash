import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerHomePage from './components/CustomerHomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import CategoriesPage from './components/CategoriesPage';
import ProductDetailPage from './components/ProductDetailPage';
import CustomerDashboard from './components/CustomerDashboard';
import VendorDashboard from './components/VendorDashboard';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';

function App() {
  const [userPosition, setUserPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for storage changes (when login happens in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anzacash_user' || e.key === 'anzacash_token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = () => {
    // Check if user is logged in and get their position from localStorage
    const storedUser = localStorage.getItem('anzacash_user');
    const token = localStorage.getItem('anzacash_token');

    console.log('checkAuthStatus - checking localStorage');
    console.log('Token found:', !!token);
    console.log('User data found:', !!storedUser);

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('User data from localStorage:', user);
        setUserPosition(user.usr_posio || null);
        console.log('User position:', user.usr_posio);
        console.log('Set userPosition to:', user.usr_posio);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('No token or user data found in localStorage');
      setUserPosition(null);
    }

    setIsLoading(false);
    console.log('Loading set to false');
  };

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

  console.log('Rendering App - userPosition:', userPosition, 'isLoading:', isLoading);

  // Check if user should have access to customer home page
  const hasAccess = userPosition === 'customer' || userPosition === 'traders';
  console.log('Has access to customer home page:', hasAccess);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route
            path="/dashboard"
            element={
              userPosition === 'traders' ? <VendorDashboard /> : <CustomerDashboard />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<OrderConfirmationPage />} />

          {/* Development route - access customer homepage without login */}
          <Route path="/preview" element={<CustomerHomePage />} />

          <Route
            path="/"
            element={
              hasAccess ? <CustomerHomePage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App