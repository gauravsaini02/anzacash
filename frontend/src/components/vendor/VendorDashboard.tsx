import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorData } from '../../hooks/useVendorData';
import ProfileEditModal from '../shared/ProfileEditModal';

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { vendorData, vendorStats, loading, error, formatBalance, formatCurrency, refetchData } = useVendorData();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.profile-dropdown-container')) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Add Font Awesome script to the document
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    fontAwesomeScript.onload = () => {
      // Configure FontAwesome after loading
      if (window.FontAwesome) {
        window.FontAwesome.config = { autoReplaceSvg: 'nest' };
      }
    };
    document.head.appendChild(fontAwesomeScript);

    // Add Tailwind config
    const tailwindScript = document.createElement('script');
    tailwindScript.textContent = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#4169E1',
              secondary: '#7C3AED',
              success: '#00C853',
              background: '#F5F5F5'
            }
          }
        }
      }
    `;
    document.head.appendChild(tailwindScript);

    // Add Font Awesome config
    const fontAwesomeConfig = document.createElement('script');
    fontAwesomeConfig.textContent = `
      window.FontAwesomeConfig = { autoReplaceSvg: 'nest'};
    `;
    document.head.appendChild(fontAwesomeConfig);

    // Add Highcharts script
    const highchartsScript = document.createElement('script');
    highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
    document.head.appendChild(highchartsScript);

    return () => {
      // Clean up event listener
      document.removeEventListener('mousedown', handleClickOutside);

      // Clean up scripts
      if (document.head.contains(fontAwesomeScript)) {
        document.head.removeChild(fontAwesomeScript);
      }
      if (document.head.contains(tailwindScript)) {
        document.head.removeChild(tailwindScript);
      }
      if (document.head.contains(fontAwesomeConfig)) {
        document.head.removeChild(fontAwesomeConfig);
      }
      if (document.head.contains(highchartsScript)) {
        document.head.removeChild(highchartsScript);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Highcharts when data is loaded
    if (vendorStats && !loading && typeof window !== 'undefined' && window.Highcharts) {
      window.Highcharts.chart('sales-chart-container', {
        credits: { enabled: false },
        chart: {
          type: 'line',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          gridLineWidth: 0,
          lineWidth: 0,
          tickWidth: 0
        },
        yAxis: {
          title: { text: null },
          gridLineWidth: 1,
          gridLineColor: '#f1f5f9'
        },
        legend: { enabled: false },
        plotOptions: {
          line: {
            dataLabels: { enabled: false },
            enableMouseTracking: true,
            marker: {
              radius: 6,
              fillColor: '#4169E1',
              lineWidth: 3,
              lineColor: '#ffffff'
            }
          }
        },
        series: [{
          name: 'Sales',
          data: [420000, 680000, 540000, 890000, 750000, 920000, 1200000], // You can calculate this from real data
          color: '#4169E1',
          lineWidth: 3
        }],
        tooltip: {
          formatter: function() {
            return '<b>' + this.x + '</b><br/>' +
                   'Sales: ' + window.Highcharts.numberFormat(this.y, 0) + ' TZS';
          }
        }
      });
    }
  }, [vendorStats, loading]);

  const handleWithdraw = () => {
    console.log('Processing withdrawal');
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleViewAllProducts = () => {
    console.log('Viewing all products');
  };

  const handleChartPeriodChange = (period: string) => {
    console.log('Changing chart period to:', period);
  };

  const toggleBalance = () => {
    setBalanceVisible(!balanceVisible);
  };

  const handleProfileUpdate = (updatedData: any) => {
    console.log('Profile updated:', updatedData);
    // Optionally, you can update local state or show a success message
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('anzacash_token');
    localStorage.removeItem('anzacash_user');

    // Dispatch custom auth change event
    window.dispatchEvent(new CustomEvent('authChange', {
      detail: { isAuthenticated: false }
    }));

    // Navigate to login page
    navigate('/login');
  };

  const getProfileImageUrl = () => {
    if (vendorData?.user?.photo && vendorData.user.photo !== 'N/A') {
      return `http://localhost:3000${vendorData.user.photo}`;
    }
    return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    // Check if error is 404 (authentication issue) and handle accordingly
    const isAuthError = error.includes('404');

    const handleRetry = () => {
      if (isAuthError) {
        // Clear authentication data and redirect to login
        localStorage.removeItem('anzacash_token');
        localStorage.removeItem('anzacash_user');
        navigate('/login');
      } else {
        
        // For other errors, retry the request
        window.location.reload();
      }
    };

    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600">{error}</p>
          {isAuthError && (
            <p className="text-sm text-gray-500 mb-4">
              Authentication failed. Please log in again.
            </p>
          )}
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            {isAuthError ? 'Go back to Login' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const displayName = vendorData?.user?.fullName || vendorData?.user?.username || 'Vendor';
  const balance = formatBalance(vendorData?.finances?.balance || '0');
  const monthlySales = formatCurrency(vendorStats?.revenue?.monthly || '0');
  const totalOrders = vendorStats?.orders?.total || 0;
  const activeProducts = vendorStats?.products?.active || 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                ANZACASH
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <span className="text-primary font-medium cursor-pointer">Dashboard</span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/products')}
                >
                  Products
                </span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => {
                    console.log('Orders clicked, navigating to /orders');
                    navigate('/orders');
                  }}
                >
                  Orders
                </span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => {
                    console.log('Analytics clicked, navigating to /analytics');
                    navigate('/analytics');
                  }}
                >
                  Analytics
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
                  src={getProfileImageUrl()}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-white/50 transition"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                />

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsProfileEditModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-user text-sm"></i>
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-sign-out-alt text-sm"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile and Balance Card */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-primary via-blue-600 to-secondary rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <img
                    src={getProfileImageUrl()}
                    alt="Vendor"
                    className="w-16 h-16 rounded-full border-4 border-white/20 cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => setIsProfileEditModalOpen(true)}
                  />
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer" onClick={() => setIsProfileEditModalOpen(true)}>
                    <i className="fa-solid fa-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <button
                      onClick={() => setIsProfileEditModalOpen(true)}
                      className="text-white/80 hover:text-white transition"
                      title="Edit Profile"
                    >
                      <i className="fa-solid fa-edit text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-circle-check text-green-400"></i>
                    <span className="text-sm font-medium">
                      {vendorData?.user?.status === 'Active' ? 'Verified Vendor' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleBalance}
                className="text-white/80 hover:text-white"
              >
                <i className={`fa-solid ${balanceVisible ? 'fa-eye' : 'fa-eye-slash'} text-xl`}></i>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-white/80 mb-2">Your Balance</p>
              <div className="flex items-center space-x-4">
                <span className="text-5xl font-bold">
                  {balanceVisible ? balance : '••••••••'}
                </span>
                <span className="text-lg font-medium">TZS</span>
              </div>
              <p className="text-sm text-white/70 mt-2">
                <i className="fa-solid fa-info-circle mr-2"></i>
                Next payout on January 30th, 2024
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleWithdraw}
                className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center space-x-2"
              >
                <i className="fa-solid fa-money-bill-transfer"></i>
                <span>Withdraw</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition flex items-center space-x-2"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-success text-xl"></i>
              </div>
              <div className="flex items-center space-x-1 text-success text-sm font-medium">
                <i className="fa-solid fa-arrow-up"></i>
                <span>+12.5%</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-900">{monthlySales}</p>
            <p className="text-xs text-gray-500 mt-1">TZS this month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-shopping-bag text-primary text-xl"></i>
              </div>
              <div className="flex items-center space-x-1 text-success text-sm font-medium">
                <i className="fa-solid fa-arrow-up"></i>
                <span>+8.2%</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Orders this month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-box text-secondary text-xl"></i>
              </div>
              <div className="flex items-center space-x-1 text-red-500 text-sm font-medium">
                <i className="fa-solid fa-arrow-down"></i>
                <span>-2.1%</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Active Products</h3>
            <p className="text-3xl font-bold text-gray-900">{activeProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Products listed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-clock text-orange-500 text-xl"></i>
              </div>
              <div className="flex items-center space-x-1 text-orange-500 text-sm font-medium">
                <i className="fa-solid fa-minus"></i>
                <span>0%</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Payouts</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(vendorData?.finances?.profit || '0')}</p>
            <p className="text-xs text-gray-500 mt-1">TZS pending</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
              <div className="flex items-center space-x-2">
                {['Day', 'Week', 'Month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleChartPeriodChange(period)}
                    className="px-3 py-1 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div id="sales-chart-container" style={{ height: '300px' }}></div>
          </section>

          {/* Quick Stats */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-eye text-blue-600"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Profile Views</span>
                </div>
                <span className="text-lg font-bold text-gray-900">1,284</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-star text-green-600"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Avg Rating</span>
                </div>
                <span className="text-lg font-bold text-gray-900">4.8</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-users text-purple-600"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Customers</span>
                </div>
                <span className="text-lg font-bold text-gray-900">892</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-clock text-orange-600"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Response Time</span>
                </div>
                <span className="text-lg font-bold text-gray-900">2h</span>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Orders Preview */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-primary font-medium hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-check text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">New order received</p>
                  <p className="text-sm text-gray-500">Wireless Headphones - 2 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">+235,000 TZS</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-plus text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Product listed</p>
                  <p className="text-sm text-gray-500">Smartphone Pro Max - 5 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-star text-purple-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">New review</p>
                  <p className="text-sm text-gray-500">5 stars on Laptop UltraBook - 1 day ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-purple-600">Excellent</span>
            </div>
          </div>
        </section>
      </main>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileEditModalOpen}
        onClose={() => setIsProfileEditModalOpen(false)}
        vendorData={vendorData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default VendorDashboard;