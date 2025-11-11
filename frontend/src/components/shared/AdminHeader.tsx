import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('anzacash_token');
    localStorage.removeItem('anzacash_user');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              ANZACASH
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <span
                className="text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin')}
              >
                Admin Dashboard
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/vendors')}
              >
                Vendors
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/members')}
              >
                Members
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/orders')}
              >
                Orders
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/revenue')}
              >
                Revenue
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/reports')}
              >
                Reports
              </span>
              <span
                className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                onClick={() => navigate('/admin/settings')}
              >
                Settings
              </span>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <div className="relative profile-dropdown-container">
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                alt="Admin Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={() => {
                      navigate('/admin/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;