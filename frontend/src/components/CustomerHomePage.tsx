import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerHomePage: React.FC = () => {
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

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('anzacash_token');
    localStorage.removeItem('anzacash_user');

    // Update state
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileDropdownOpen(false);

    // Redirect to login page
    window.location.href = '/login';
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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

  useEffect(() => {
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

    return () => {
      document.head.removeChild(fontAwesomeScript);
    };
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">ANZACASH</div>
              <nav className="hidden md:flex items-center gap-4">
                <span className="text-primary font-medium cursor-pointer border-b-2 border-primary pb-1">Home</span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors"
                  onClick={() => navigate('/categories')}
                >
                  Categories
                </span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors">Vendors</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors">Deals</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors">Support</span>
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

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Connect with <span className="text-primary">Thousands</span> of Trusted Vendors
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
                  Discover amazing products from verified sellers worldwide. Shop with confidence on ANZACASH marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-blue-600 transition">
                    Start Shopping
                  </button>
                  <button className="border-2 border-primary text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition">
                    Become a Vendor
                  </button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <img
                  className="w-full max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7e3f106e14-e52cd00cde547f28f653.png"
                  alt="modern e-commerce shopping illustration with tech devices, shopping bags, and digital elements in vibrant colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-store text-white text-2xl"></i>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">15,000+</div>
                <div className="text-gray-600">Active Vendors</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-box text-white text-2xl"></i>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">2.5M+</div>
                <div className="text-gray-600">Products Listed</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-users text-white text-2xl"></i>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">850K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-truck text-white text-2xl"></i>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">5.2M+</div>
                <div className="text-gray-600">Orders Delivered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 lg:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">Explore our wide range of product categories</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div
                className="bg-blue-50 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                <div className="text-center">
                  <i className="fa-solid fa-mobile-alt text-4xl text-blue-600 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Electronics</h3>
                  <p className="text-gray-600">125,430 items</p>
                </div>
              </div>
              <div
                className="bg-green-50 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                <div className="text-center">
                  <i className="fa-solid fa-tshirt text-4xl text-green-600 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fashion</h3>
                  <p className="text-gray-600">89,250 items</p>
                </div>
              </div>
              <div
                className="bg-purple-50 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                <div className="text-center">
                  <i className="fa-solid fa-home text-4xl text-purple-600 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Home & Garden</h3>
                  <p className="text-gray-600">67,890 items</p>
                </div>
              </div>
              <div
                className="bg-orange-50 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                <div className="text-center">
                  <i className="fa-solid fa-dumbbell text-4xl text-orange-600 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sports</h3>
                  <p className="text-gray-600">45,670 items</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">Discover trending items from top vendors</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d190b692f0-85cc176c4865bd058878.png"
                    alt="modern wireless headphones product photography white background"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
                  <i className="fa-regular fa-heart absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer"></i>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">TechStore Pro</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Wireless Headphones</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">$89.99</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$129.99</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(245)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/19dba40a1e-d6efe654e15bd00a6b12.png"
                    alt="modern smartwatch product photography white background"
                  />
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                  <i className="fa-regular fa-heart absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer"></i>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">SmartTech</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Watch Pro</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">$199.99</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-regular fa-star text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(89)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e8796dd9de-9cd59523e0e1cf0aec6c.png"
                    alt="modern laptop computer product photography white background"
                  />
                  <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">Trending</span>
                  <i className="fa-solid fa-heart absolute top-3 right-3 text-red-500 cursor-pointer"></i>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">CompuWorld</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Gaming Laptop</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">$1,299.99</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(156)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6687b03202-dac34171c1dfe56a50c8.png"
                    alt="modern smartphone product photography white background"
                  />
                  <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded">Best Seller</span>
                  <i className="fa-regular fa-heart absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer"></i>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">MobileHub</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Latest Smartphone</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">$699.99</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                      <i className="fa-solid fa-star text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(423)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Vendors */}
        <section className="py-12 lg:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Top Vendors</h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">Shop from our most trusted and popular vendors</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  alt="TechStore Pro"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">TechStore Pro</h3>
                <div className="flex items-center justify-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-600">4.9 (1,245 reviews)</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p>2,450 Products • 125K Sales</p>
                  <p className="mt-2">Premium electronics and gadgets with fast shipping</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Visit Store</button>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                  alt="Fashion Hub"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fashion Hub</h3>
                <div className="flex items-center justify-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-regular fa-star text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-600">4.7 (890 reviews)</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p>1,850 Products • 89K Sales</p>
                  <p className="mt-2">Trendy fashion for all ages with worldwide shipping</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Visit Store</button>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                  alt="Home Essentials"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Essentials</h3>
                <div className="flex items-center justify-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-600">4.8 (2,156 reviews)</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <p>3,200 Products • 156K Sales</p>
                  <p className="mt-2">Quality home and garden products for modern living</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Visit Store</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">ANZACASH</div>
              <p className="text-gray-400 mb-4">Connect buyers with thousands of trusted vendors worldwide.</p>
              <div className="flex space-x-4">
                <i className="fa-brands fa-facebook text-xl hover:text-primary cursor-pointer"></i>
                <i className="fa-brands fa-twitter text-xl hover:text-primary cursor-pointer"></i>
                <i className="fa-brands fa-instagram text-xl hover:text-primary cursor-pointer"></i>
                <i className="fa-brands fa-linkedin text-xl hover:text-primary cursor-pointer"></i>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white cursor-pointer">Categories</span></li>
                <li><span className="hover:text-white cursor-pointer">Vendors</span></li>
                <li><span className="hover:text-white cursor-pointer">Deals</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to get updates on deals and new products</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary text-white"
                />
                <button className="bg-primary px-6 py-2 rounded-r-lg hover:bg-blue-600 transition">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ANZACASH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHomePage;