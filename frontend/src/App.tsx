import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Auth components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';

// Customer components
import CustomerHomePage from './components/customer/CustomerHomePage';
import CategoriesPage from './components/customer/CategoriesPage';
import CustomerDashboard from './components/customer/CustomerDashboard';
import CartPage from './components/customer/CartPage';
import CheckoutPage from './components/customer/CheckoutPage';
import OrderConfirmationPage from './components/customer/OrderConfirmationPage';

// Vendor components
import VendorDashboard from './components/vendor/VendorDashboard';
import AddProductPage from './components/vendor/AddProductPage';
import ProductsPage from './components/vendor/ProductsPage';
import OrdersPage from './components/vendor/OrdersPage';
import AnalyticsPage from './components/vendor/AnalyticsPage';

// Product components
import ProductDetailPage from './components/product/ProductDetailPage';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import VendorManagement from './components/admin/VendorManagement';

function App() {
  const [userPosition, setUserPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for storage changes and custom auth events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anzacash_user' || e.key === 'anzacash_token') {
        checkAuthStatus();
      }
    };

    const handleAuthChange = (e: CustomEvent) => {
      console.log('🎯 Received authChange event:', e.detail);
      checkAuthStatus();
    };

    // Listen for storage events (other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom auth change events (same tab)
    window.addEventListener('authChange', handleAuthChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange as EventListener);
    };
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
  const hasAccess = userPosition === 'customer';
  console.log('Has access to customer home page:', hasAccess);
  console.log('User can access vendor dashboard:', userPosition === 'vendor' || userPosition === 'traders');

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
              userPosition === 'vendor' ? <VendorDashboard /> :
              userPosition === 'customer' ? <CustomerDashboard /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/vendor"
            element={
              userPosition === 'vendor' || userPosition === 'traders' ? <VendorDashboard /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/orders"
            element={
              userPosition === 'vendor' || userPosition === 'traders' ? <OrdersPage /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/analytics"
            element={
              userPosition === 'vendor' || userPosition === 'traders' ? <AnalyticsPage /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/add-product"
            element={
              (() => {
                console.log('=== ADD PRODUCT ROUTE DEBUG ===');
                const storedUser = localStorage.getItem('anzacash_user');
                const token = localStorage.getItem('anzacash_token');

                console.log('Token exists:', !!token);
                console.log('User data exists:', !!storedUser);
                console.log('Raw user data:', storedUser);

                if (!token || !storedUser) {
                  console.log('❌ No auth data found for add-product route');
                  return <Navigate to="/login" replace />;
                }

                try {
                  const user = JSON.parse(storedUser);
                  console.log('✅ Parsed user data:', user);
                  console.log('📍 User role (usr_posio):', user.usr_posio);
                  console.log('📍 User position type:', typeof user.usr_posio);

                  if (user.usr_posio === 'vendor') {
                    console.log('✅ Vendor role detected - showing Add Product page');
                    return <AddProductPage />;
                  } else if (user.usr_posio === 'traders') {
                    console.log('✅ Traders role detected - showing Add Product page');
                    return <AddProductPage />;
                  } else {
                    console.log('❌ User role not authorized for add-product:', user.usr_posio);
                    console.log('❌ Available roles that work: vendor, traders');
                    return <Navigate to="/login" replace />;
                  }
                } catch (error) {
                  console.error('❌ Error parsing user data for add-product:', error);
                  return <Navigate to="/login" replace />;
                }
              })()
            }
          />
          <Route
            path="/products"
            element={
              (() => {
                const storedUser = localStorage.getItem('anzacash_user');
                const token = localStorage.getItem('anzacash_token');

                if (!token || !storedUser) {
                  return <Navigate to="/login" replace />;
                }

                try {
                  const user = JSON.parse(storedUser);

                  if (user.usr_posio === 'vendor' || user.usr_posio === 'traders') {
                    return <ProductsPage />;
                  } else {
                    return <Navigate to="/login" replace />;
                  }
                } catch (error) {
                  return <Navigate to="/login" replace />;
                }
              })()
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<OrderConfirmationPage />} />

          {/* Admin route */}
          <Route
            path="/admin"
            element={
              userPosition === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* Admin Vendor Management route */}
          <Route
            path="/admin/vendors"
            element={
              userPosition === 'admin' ? <VendorManagement /> : <Navigate to="/login" replace />
            }
          />

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