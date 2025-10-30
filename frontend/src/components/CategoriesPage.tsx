import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    priceRange: '',
    vendors: [] as string[],
    commission: [] as string[],
    rating: [] as string[]
  });

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

    return () => {
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
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    const newCategories = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter(c => c !== category)
      : [...selectedFilters.categories, category];
    setSelectedFilters({ ...selectedFilters, categories: newCategories });
  };

  const handleVendorClick = (vendor: string) => {
    const newVendors = selectedFilters.vendors.includes(vendor)
      ? selectedFilters.vendors.filter(v => v !== vendor)
      : [...selectedFilters.vendors, vendor];
    setSelectedFilters({ ...selectedFilters, vendors: newVendors });
  };

  const handleCommissionClick = (commission: string) => {
    const newCommission = selectedFilters.commission.includes(commission)
      ? selectedFilters.commission.filter(c => c !== commission)
      : [...selectedFilters.commission, commission];
    setSelectedFilters({ ...selectedFilters, commission: newCommission });
  };

  const handleRatingClick = (rating: string) => {
    const newRating = selectedFilters.rating.includes(rating)
      ? selectedFilters.rating.filter(r => r !== rating)
      : [...selectedFilters.rating, rating];
    setSelectedFilters({ ...selectedFilters, rating: newRating });
  };

  const handlePriceChange = (priceRange: string) => {
    setSelectedFilters({ ...selectedFilters, priceRange });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      priceRange: '',
      vendors: [],
      commission: [],
      rating: []
    });
  };

  const handleViewChange = (viewType: 'grid' | 'list') => {
    // Handle view change logic here
    console.log('Changing view to:', viewType);
  };

  const handleSortChange = (sortOption: string) => {
    // Handle sort change logic here
    console.log('Sorting by:', sortOption);
  };

  
  const handleAddToCart = (productName: string) => {
    // Handle add to cart logic here
    console.log('Adding to cart:', productName);
  };

  const handleQuickView = (productName: string) => {
    // Map product names to product IDs
    const productId = productName === 'Premium Wireless Headphones' ? '1' :
                     productName === 'Fitness Smart Watch Pro' ? '2' :
                     productName === 'Gaming Laptop Ultra Pro' ? '3' :
                     productName === 'Latest Smartphone Pro Max' ? '4' :
                     productName === 'Premium Wireless Earbuds' ? '5' :
                     productName === 'Professional Tablet 12.9"' ? '6' : '1';

    // Open product detail page in new tab
    window.open(`/product/${productId}`, '_blank');
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('anzacash_token');
    localStorage.removeItem('anzacash_user');

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

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header id="header" className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
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
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer transition-colors"
                  onClick={() => navigate('/')}
                >
                  Home
                </span>
                <span className="text-primary font-medium cursor-pointer border-b-2 border-primary pb-1">Categories</span>
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

      <main className="pt-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar Section */}
          <div className="mb-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  className="w-full px-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-primary text-lg"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <aside id="filter-sidebar" className="w-1/4 bg-white rounded-2xl p-6 h-fit sticky top-24 shadow-sm border border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:text-blue-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div id="category-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.categories.includes('electronics')}
                        onChange={() => handleCategoryClick('electronics')}
                      />
                      <span className="text-sm text-gray-700">Electronics (125,430)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.categories.includes('fashion')}
                        onChange={() => handleCategoryClick('fashion')}
                      />
                      <span className="text-sm text-gray-700">Fashion (89,250)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.categories.includes('home-garden')}
                        onChange={() => handleCategoryClick('home-garden')}
                      />
                      <span className="text-sm text-gray-700">Home & Garden (67,890)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.categories.includes('sports-fitness')}
                        onChange={() => handleCategoryClick('sports-fitness')}
                      />
                      <span className="text-sm text-gray-700">Sports & Fitness (45,670)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.categories.includes('health-beauty')}
                        onChange={() => handleCategoryClick('health-beauty')}
                      />
                      <span className="text-sm text-gray-700">Health & Beauty (78,920)</span>
                    </label>
                  </div>
                </div>

                {/* Price Filter */}
                <div id="price-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.priceRange === 'under-25'}
                        onChange={() => handlePriceChange('under-25')}
                      />
                      <span className="text-sm text-gray-700">Under $25</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.priceRange === '25-50'}
                        onChange={() => handlePriceChange('25-50')}
                      />
                      <span className="text-sm text-gray-700">$25 - $50</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.priceRange === '50-100'}
                        onChange={() => handlePriceChange('50-100')}
                      />
                      <span className="text-sm text-gray-700">$50 - $100</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.priceRange === '100-500'}
                        onChange={() => handlePriceChange('100-500')}
                      />
                      <span className="text-sm text-gray-700">$100 - $500</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        className="text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.priceRange === 'over-500'}
                        onChange={() => handlePriceChange('over-500')}
                      />
                      <span className="text-sm text-gray-700">Over $500</span>
                    </label>
                  </div>
                </div>

                {/* Vendor Filter */}
                <div id="vendor-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Vendors</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.vendors.includes('techstore-pro')}
                        onChange={() => handleVendorClick('techstore-pro')}
                      />
                      <span className="text-sm text-gray-700">TechStore Pro</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.vendors.includes('fashion-hub')}
                        onChange={() => handleVendorClick('fashion-hub')}
                      />
                      <span className="text-sm text-gray-700">Fashion Hub</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.vendors.includes('smarttech')}
                        onChange={() => handleVendorClick('smarttech')}
                      />
                      <span className="text-sm text-gray-700">SmartTech</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.vendors.includes('home-essentials')}
                        onChange={() => handleVendorClick('home-essentials')}
                      />
                      <span className="text-sm text-gray-700">Home Essentials</span>
                    </label>
                  </div>
                </div>

                {/* Commission Filter */}
                <div id="commission-filter">
                  <h4 className="font-medium text-gray-900 mb-3">MLM Commission</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.commission.includes('5-10')}
                        onChange={() => handleCommissionClick('5-10')}
                      />
                      <span className="text-sm text-gray-700">5% - 10%</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.commission.includes('10-15')}
                        onChange={() => handleCommissionClick('10-15')}
                      />
                      <span className="text-sm text-gray-700">10% - 15%</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.commission.includes('15-20')}
                        onChange={() => handleCommissionClick('15-20')}
                      />
                      <span className="text-sm text-gray-700">15% - 20%</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.commission.includes('20+')}
                        onChange={() => handleCommissionClick('20+')}
                      />
                      <span className="text-sm text-gray-700">20%+</span>
                    </label>
                  </div>
                </div>

                {/* Rating Filter */}
                <div id="rating-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.rating.includes('5-stars')}
                        onChange={() => handleRatingClick('5-stars')}
                      />
                      <div className="flex text-yellow-400 mr-2">
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                      </div>
                      <span className="text-sm text-gray-700">5 Stars</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-3"
                        checked={selectedFilters.rating.includes('4-plus-stars')}
                        onChange={() => handleRatingClick('4-plus-stars')}
                      />
                      <div className="flex text-yellow-400 mr-2">
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-solid fa-star text-xs"></i>
                        <i className="fa-regular fa-star text-xs"></i>
                      </div>
                      <span className="text-sm text-gray-700">4+ Stars</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div id="main-content" className="flex-1">
              {/* Top Bar */}
              <div id="top-bar" className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Showing 1-24 of 2,456 results</span>
                    <span className="text-sm text-gray-500">for "All Products"</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">View:</span>
                      <button
                        onClick={() => handleViewChange('grid')}
                        className="p-2 bg-primary text-white rounded-lg"
                      >
                        <i className="fa-solid fa-th text-sm"></i>
                      </button>
                      <button
                        onClick={() => handleViewChange('list')}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      >
                        <i className="fa-solid fa-list text-sm"></i>
                      </button>
                    </div>
                    <select
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option>Sort by: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                      <option>Best Rating</option>
                      <option>Highest Commission</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div id="product-grid" className="grid grid-cols-3 gap-6 mb-8">
                {/* Product 1 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/714d0225c5-0b639c7375fd9648f21f.png"
                      alt="wireless bluetooth headphones product photography white background modern style"
                    />
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">12% MLM</span>
                    <i className="fa-regular fa-heart absolute bottom-3 right-3 text-white bg-black bg-opacity-50 p-2 rounded-full hover:text-red-500 cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">TechStore Pro</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Premium Wireless Headphones</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$89.99</span>
                      <span className="text-sm text-gray-500 line-through ml-2">$129.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
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
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$10.80 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Premium Wireless Headphones')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Premium Wireless Headphones')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4b6e5aa4f3-818344d273083ae53233.png"
                      alt="smartwatch fitness tracker product photography white background sleek design"
                    />
                    <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">15% MLM</span>
                    <i className="fa-regular fa-heart absolute bottom-3 right-3 text-white bg-black bg-opacity-50 p-2 rounded-full hover:text-red-500 cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">SmartTech</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Fitness Smart Watch Pro</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$199.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
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
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$30.00 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Fitness Smart Watch Pro')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Fitness Smart Watch Pro')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/db85eaa0c2-0bfd73510a097e66e332.png"
                      alt="modern laptop computer gaming setup product photography white background"
                    />
                    <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded">Trending</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">8% MLM</span>
                    <i className="fa-solid fa-heart absolute bottom-3 right-3 text-red-500 bg-white p-2 rounded-full cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">CompuWorld</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Gaming Laptop Ultra Pro</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$1,299.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
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
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$104.00 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Gaming Laptop Ultra Pro')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Gaming Laptop Ultra Pro')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product 4 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/de4a6b8f58-31b72c9f9f944e3d635e.png"
                      alt="premium smartphone mobile phone product photography white background modern design"
                    />
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">Best Seller</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">10% MLM</span>
                    <i className="fa-regular fa-heart absolute bottom-3 right-3 text-white bg-black bg-opacity-50 p-2 rounded-full hover:text-red-500 cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">MobileHub</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Latest Smartphone Pro Max</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$699.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
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
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$70.00 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Latest Smartphone Pro Max')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Latest Smartphone Pro Max')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product 5 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ed769be79-94926f0f7957fe5f9f93.png"
                      alt="wireless earbuds bluetooth headphones product photography white background premium style"
                    />
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">Eco-Friendly</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">14% MLM</span>
                    <i className="fa-regular fa-heart absolute bottom-3 right-3 text-white bg-black bg-opacity-50 p-2 rounded-full hover:text-red-500 cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">AudioTech</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Premium Wireless Earbuds</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$149.99</span>
                      <span className="text-sm text-gray-500 line-through ml-2">$199.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-regular fa-star text-xs"></i>
                        </div>
                        <span className="text-sm text-gray-500 ml-1">(178)</span>
                      </div>
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$21.00 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Premium Wireless Earbuds')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Premium Wireless Earbuds')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product 6 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a3c28fca87-136f0e073b5230c5f610.png"
                      alt="tablet computer device product photography white background modern sleek design"
                    />
                    <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">Limited</span>
                    <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">9% MLM</span>
                    <i className="fa-regular fa-heart absolute bottom-3 right-3 text-white bg-black bg-opacity-50 p-2 rounded-full hover:text-red-500 cursor-pointer"></i>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary font-medium mb-1">TabletPro</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">Professional Tablet 12.9"</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">$799.99</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                          <i className="fa-solid fa-star text-xs"></i>
                        </div>
                        <span className="text-sm text-gray-500 ml-1">(267)</span>
                      </div>
                      <span className="bg-success text-white text-xs px-2 py-1 rounded">$72.00 Commission</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart('Professional Tablet 12.9"')}
                        className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleQuickView('Professional Tablet 12.9"')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div id="pagination" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <i className="fa-solid fa-chevron-left mr-2"></i>
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 bg-primary text-white rounded-lg">1</button>
                    <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
                    <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition">3</button>
                    <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                    <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition">102</button>
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Next
                    <i className="fa-solid fa-chevron-right ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;