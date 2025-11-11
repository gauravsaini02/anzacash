import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  commission: number;
  location: string;
  country: string;
  date: string;
  image: string | null;
  seller: {
    id: number;
    username: string;
    fullName: string;
    country: string;
    photo: string;
    businessName?: string;
    verificationStatus: string;
    rating: number;
  };
}

interface Filters {
  search: string;
  category: string;
  priceRange: string;
  vendors: string[];
  commission: string[];
  rating: string[];
  sortBy: string;
}

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Product-related state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false
  });

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    priceRange: '',
    vendors: [],
    commission: [],
    rating: [],
    sortBy: 'featured'
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', pagination.currentPage.toString());
      params.append('limit', '20');

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }

      const response = await fetch(`http://localhost:3000/api/products/public?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

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

    // Fetch initial products
    fetchProducts();
  }, []);

  // Fetch products when filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.search, pagination.currentPage]);

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

  // Filter and interaction handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setFilters({ ...filters, priceRange });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.name);
  };

  const handleQuickView = (productId: number) => {
    // Open product detail page in new tab
    window.open(`/product/${productId}`, '_blank');
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: '',
      vendors: [],
      commission: [],
      rating: [],
      sortBy: 'featured'
    });
    setSearchQuery('');
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleViewChange = (viewType: 'grid' | 'list') => {
    // Handle view change logic here
    console.log('Changing view to:', viewType);
  };

  // Get unique categories from products
  const getCategories = () => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories);
  };

  // Get unique vendors from products
  const getVendors = () => {
    const vendors = new Map();
    products.forEach(p => {
      vendors.set(p.seller.id, {
        id: p.seller.id,
        name: p.seller.businessName || p.seller.fullName || p.seller.username
      });
    });
    return Array.from(vendors.values());
  };

  // Filter products based on current filters (client-side filtering for price range, vendors, commission, rating)
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Price range filtering
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'under-25':
          filtered = filtered.filter(p => p.price < 25);
          break;
        case '25-50':
          filtered = filtered.filter(p => p.price >= 25 && p.price <= 50);
          break;
        case '50-100':
          filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
          break;
        case '100-500':
          filtered = filtered.filter(p => p.price >= 100 && p.price <= 500);
          break;
        case 'over-500':
          filtered = filtered.filter(p => p.price > 500);
          break;
      }
    }

    // Vendor filtering
    if (filters.vendors.length > 0) {
      filtered = filtered.filter(p => filters.vendors.includes(p.seller.id.toString()));
    }

    // Commission filtering
    if (filters.commission.length > 0) {
      filtered = filtered.filter(p => {
        const commission = p.commission;
        return filters.commission.some(range => {
          switch (range) {
            case '5-10': return commission >= 5 && commission <= 10;
            case '10-15': return commission >= 10 && commission <= 15;
            case '15-20': return commission >= 15 && commission <= 20;
            case '20+': return commission >= 20;
            default: return false;
          }
        });
      });
    }

    // Rating filtering
    if (filters.rating.length > 0) {
      filtered = filtered.filter(p => {
        const rating = p.seller.rating;
        return filters.rating.some(r => {
          switch (r) {
            case '5-stars': return rating === 5;
            case '4-plus-stars': return rating >= 4;
            default: return false;
          }
        });
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      case 'commission-high':
        filtered.sort((a, b) => b.commission - a.commission);
        break;
      default: // featured - keep original order
        break;
    }

    return filtered;
  };

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
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-primary text-lg"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition font-medium"
                >
                  Search
                </button>
              </form>
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
                        type="radio"
                        name="category"
                        className="text-primary focus:ring-primary mr-3"
                        checked={filters.category === 'all'}
                        onChange={() => handleCategoryChange('all')}
                      />
                      <span className="text-sm text-gray-700">All Categories</span>
                    </label>
                    {getCategories().map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          className="text-primary focus:ring-primary mr-3"
                          checked={filters.category === category}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div id="price-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'under-25', label: 'Under $25' },
                      { value: '25-50', label: '$25 - $50' },
                      { value: '50-100', label: '$50 - $100' },
                      { value: '100-500', label: '$100 - $500' },
                      { value: 'over-500', label: 'Over $500' }
                    ].map((range) => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          className="text-primary focus:ring-primary mr-3"
                          checked={filters.priceRange === range.value}
                          onChange={() => handlePriceRangeChange(range.value)}
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Vendor Filter */}
                <div id="vendor-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Vendors</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getVendors().map((vendor: any) => (
                      <label key={vendor.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary focus:ring-primary mr-3"
                          checked={filters.vendors.includes(vendor.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, vendors: [...filters.vendors, vendor.id.toString()] });
                            } else {
                              setFilters({ ...filters, vendors: filters.vendors.filter(v => v !== vendor.id.toString()) });
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{vendor.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commission Filter */}
                <div id="commission-filter">
                  <h4 className="font-medium text-gray-900 mb-3">MLM Commission</h4>
                  <div className="space-y-2">
                    {[
                      { value: '5-10', label: '5% - 10%' },
                      { value: '10-15', label: '10% - 15%' },
                      { value: '15-20', label: '15% - 20%' },
                      { value: '20+', label: '20%+' }
                    ].map((range) => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary focus:ring-primary mr-3"
                          checked={filters.commission.includes(range.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, commission: [...filters.commission, range.value] });
                            } else {
                              setFilters({ ...filters, commission: filters.commission.filter(c => c !== range.value) });
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div id="rating-filter">
                  <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[
                      { value: '5-stars', label: '5 Stars', stars: 5 },
                      { value: '4-plus-stars', label: '4+ Stars', stars: 4 }
                    ].map((rating) => (
                      <label key={rating.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary focus:ring-primary mr-3"
                          checked={filters.rating.includes(rating.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, rating: [...filters.rating, rating.value] });
                            } else {
                              setFilters({ ...filters, rating: filters.rating.filter(r => r !== rating.value) });
                            }
                          }}
                        />
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa-solid fa-star text-xs ${i < rating.stars ? '' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                        <span className="text-sm text-gray-700">{rating.label}</span>
                      </label>
                    ))}
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
                    <span className="text-gray-700 font-medium">
                      Showing {getFilteredProducts().length} {getFilteredProducts().length === 1 ? 'product' : 'products'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {filters.category === 'all' ? 'All Categories' : filters.category}
                    </span>
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
                      value={filters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Best Rating</option>
                      <option value="commission-high">Highest Commission</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl mb-4"></i>
                    <p className="text-red-700 font-medium mb-2">Error loading products</p>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && (
                <>
                  {getFilteredProducts().length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fa-solid fa-search text-gray-300 text-6xl mb-4"></i>
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      {getFilteredProducts().map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                          <div className="relative">
                            {product.image ? (
                              <img
                                className="w-full h-48 object-cover"
                                src={`http://localhost:3000${product.image}`}
                                alt={product.name}
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <i className="fa-solid fa-image text-gray-400 text-3xl"></i>
                              </div>
                            )}
                            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              {product.commission}% MLM
                            </span>
                            <i className="fa-regular fa-heart absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer"></i>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-primary font-medium mb-1">
                              {product.seller.businessName || product.seller.fullName || product.seller.username}
                            </p>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center mb-3">
                              <span className="text-lg font-bold text-gray-900">
                                ${product.price.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <i
                                      key={i}
                                      className={`fa-solid fa-star text-xs ${i < Math.floor(Number(product.seller.rating || 0)) ? '' : 'text-gray-300'}`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-1">({Number(product.seller.rating || 0).toFixed(1)})</span>
                              </div>
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                                ${((product.price * product.commission) / 100).toFixed(2)} Commission
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => handleQuickView(product.id)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                              >
                                Quick View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fa-solid fa-chevron-left mr-2"></i>
                          Previous
                        </button>
                        <div className="flex space-x-2">
                          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                            let pageNum = i + 1;
                            if (pagination.totalPages > 5) {
                              if (pagination.currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = pagination.currentPage - 2 + i;
                              }
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg transition ${
                                  pagination.currentPage === pageNum
                                    ? 'bg-primary text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <i className="fa-solid fa-chevron-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;