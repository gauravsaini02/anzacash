import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SharedHeaderProps {
  currentPage?: string;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('anzacash_token');
    const storedUser = localStorage.getItem('anzacash_user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('anzacash_token');
    localStorage.removeItem('anzacash_user');

    // Trigger custom event to notify App component about auth change
    window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: false } }));

    // Update state
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileDropdownOpen(false);

    // Redirect to login page
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const getNavItems = () => {
    if (currentPage === 'home') {
      return [
        { label: 'Home', active: true, onClick: () => navigate('/') },
        { label: 'Categories', active: false, onClick: () => navigate('/categories') },
        { label: 'Vendors', active: false, onClick: () => {} },
        { label: 'Deals', active: false, onClick: () => {} },
        { label: 'Support', active: false, onClick: () => {} }
      ];
    } else if (currentPage === 'categories') {
      return [
        { label: 'Home', active: false, onClick: () => navigate('/') },
        { label: 'Categories', active: true, onClick: () => navigate('/categories') },
        { label: 'Vendors', active: false, onClick: () => {} },
        { label: 'Deals', active: false, onClick: () => {} },
        { label: 'Support', active: false, onClick: () => {} }
      ];
    } else if (currentPage === 'dashboard') {
      return [
        { label: 'Dashboard', active: true, onClick: () => navigate('/dashboard') },
        { label: 'Shop', active: false, onClick: () => navigate('/categories') },
        { label: 'Orders', active: false, onClick: () => {} },
        { label: 'Rewards', active: false, onClick: () => {} }
      ];
    } else if (currentPage === 'product') {
      return [
        { label: 'Home', active: false, onClick: () => navigate('/') },
        { label: 'Categories', active: true, onClick: () => navigate('/categories') },
        { label: 'Vendors', active: false, onClick: () => {} },
        { label: 'MLM Program', active: false, onClick: () => {} },
        { label: 'Support', active: false, onClick: () => {} }
      ];
    }
    // Default navigation
    return [
      { label: 'Home', active: currentPage === 'home', onClick: () => navigate('/') },
      { label: 'Categories', active: currentPage === 'categories', onClick: () => navigate('/categories') },
      { label: 'Vendors', active: false, onClick: () => {} },
      { label: 'Deals', active: false, onClick: () => {} },
      { label: 'Support', active: false, onClick: () => {} }
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="w-full px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate('/')}
            >
              ANZACASH
            </div>
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item, index) => (
                <span
                  key={index}
                  className={`${
                    item.active
                      ? 'text-primary font-medium cursor-pointer border-b-2 border-primary pb-1'
                      : 'text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors'
                  }`}
                  onClick={item.onClick}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 ml-auto">
            <div className="relative p-2 hover:bg-gray-50 rounded-lg transition">
              <i className="fa-regular fa-heart text-xl text-gray-600 cursor-pointer hover:text-primary"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </div>
            <div
              className="relative p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer"
              onClick={() => navigate('/cart')}
            >
              <i className="fa-solid fa-shopping-cart text-xl text-gray-600 hover:text-primary"></i>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">7</span>
            </div>
            <div className="border-l border-gray-300 h-6 mx-1 sm:mx-2"></div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                  <p className="text-xs text-gray-500">{userData?.full_name || userData?.usr_uname || 'Customer'}</p>
                </div>
                <div className="relative profile-dropdown">
                  <button
                    onClick={handleProfileClick}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition relative"
                  >
                    <i className="fa-solid fa-user text-gray-600"></i>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {userData?.full_name || userData?.usr_uname || 'Customer'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userData?.usr_email || 'No email'}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            window.location.href = '/dashboard';
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center"
                        >
                          <i className="fa-solid fa-chart-line mr-3 text-gray-400"></i>
                          Dashboard
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                          <i className="fa-solid fa-user-gear mr-3 text-gray-400"></i>
                          Account Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                          <i className="fa-solid fa-box mr-3 text-gray-400"></i>
                          My Orders
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                          <i className="fa-solid fa-heart mr-3 text-gray-400"></i>
                          Wishlist
                        </button>
                      </div>

                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center"
                        >
                          <i className="fa-solid fa-right-from-bracket mr-3"></i>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;