import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeRating, createStarElements } from '../../utils/ratingUtils';

interface CartItem {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  vendorRating: number;
  vendorReviews: number;
  vendorVerified: boolean;
  productName: string;
  productImage: string;
  productDetails: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  originalPrice?: number;
  mlmCommission: string;
  mlmAmount: string;
  quantity: number;
}

interface VendorGroup {
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  vendorRating: number;
  vendorReviews: number;
  vendorVerified: boolean;
  items: CartItem[];
  subtotal: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  // Local renderStars function using the utility helper
  const renderStars = (rating: any, className: string = "text-sm") => {
    const starElements = createStarElements(rating, className);
    return (
      <div className="flex text-yellow-400">
        {starElements.map((star) => (
          <i key={star.key} className={star.className}></i>
        ))}
      </div>
    );
  };
  const [cartItems, setCartItems] = useState<VendorGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showRemoveAnimation, setShowRemoveAnimation] = useState<string | null>(null);

  const totalItems = cartItems.reduce((sum, vendor) => sum + vendor.items.length, 0);
  const subtotal = cartItems.reduce((sum, vendor) => sum + vendor.subtotal, 0);
  const platformFee = 2.50;
  const shipping = 0; // Calculated at checkout
  const total = subtotal + platformFee + shipping;
  const totalMlmCommission = cartItems.reduce((sum, vendor) => {
    return sum + vendor.items.reduce((itemSum, item) => itemSum + parseFloat(item.mlmAmount), 0);
  }, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem('anzacash_cart');
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          // Group cart items by vendor
          const vendorGroups = groupItemsByVendor(cart.items || []);
          setCartItems(vendorGroups);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const saveCart = () => {
        try {
          const allItems = cartItems.flatMap(vendor => vendor.items);
          const cartData = {
            items: allItems,
            totalItems: allItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: cartItems.reduce((sum, vendor) => sum + vendor.subtotal, 0)
          };
          localStorage.setItem('anzacash_cart', JSON.stringify(cartData));
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      };

      saveCart();
    }
  }, [cartItems, loading]);

  // Load scripts
  useEffect(() => {
    // Add Font Awesome script to the document
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    fontAwesomeScript.onload = () => {
      // Configure FontAwesome after loading
      if ((window as any).FontAwesome) {
        (window as any).FontAwesome.config = { autoReplaceSvg: 'nest' };
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

  // Helper function to group items by vendor
  const groupItemsByVendor = (items: CartItem[]): VendorGroup[] => {
    const vendorMap = new Map<string, CartItem[]>();

    items.forEach(item => {
      const vendorId = item.vendorId;
      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, []);
      }
      vendorMap.get(vendorId)!.push(item);
    });

    return Array.from(vendorMap.entries()).map(([vendorId, items]) => {
      const vendor = items[0]; // All items have same vendor info
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        vendorId,
        vendorName: vendor.vendorName,
        vendorAvatar: vendor.vendorAvatar,
        vendorRating: vendor.vendorRating,
        vendorReviews: vendor.vendorReviews,
        vendorVerified: vendor.vendorVerified,
        items,
        subtotal
      };
    });
  };

  const handleQuantityChange = (vendorId: string, itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(vendor => {
        if (vendor.vendorId === vendorId) {
          const updatedItems = vendor.items.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return { ...vendor, items: updatedItems, subtotal: newSubtotal };
        }
        return vendor;
      })
    );
  };

  const handleRemoveItem = (vendorId: string, itemId: string) => {
    setShowRemoveAnimation(itemId);
    setTimeout(() => {
      setCartItems(prevItems => {
        const updatedVendors = prevItems.map(vendor => {
          if (vendor.vendorId === vendorId) {
            const updatedItems = vendor.items.filter(item => item.id !== itemId);
            const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (updatedItems.length === 0) {
              return null; // Remove vendor if no items left
            }
            return { ...vendor, items: updatedItems, subtotal: newSubtotal };
          }
          return vendor;
        }).filter((vendor): vendor is VendorGroup => vendor !== null); // Remove null vendors
        return updatedVendors;
      });
      setShowRemoveAnimation(null);
    }, 300);
  };

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setTimeout(() => setPromoApplied(false), 2000);
    }
  };

  const handleCheckout = () => {
    // Get all cart items to pass to checkout
    const allItems = cartItems.flatMap(vendor => vendor.items);
    navigate('/checkout', { state: { cartItems: allItems } });
  };

  
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
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
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </span>
                <span className="text-primary font-medium cursor-pointer">Shop</span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/categories')}
                >
                  Categories
                </span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Orders</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Rewards</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-shopping-cart text-primary text-xl cursor-pointer"></i>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => navigate('/dashboard')}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Cart Header */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <i className="fa-solid fa-shopping-cart text-primary text-2xl"></i>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600">{totalItems} items in your cart</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <section className="space-y-6">
              {loading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center justify-center space-x-3">
                    <i className="fa-solid fa-spinner fa-spin text-primary text-xl"></i>
                    <span className="text-gray-600">Loading cart...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="text-center">
                    <i className="fa-solid fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Cart</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="text-center">
                    <i className="fa-solid fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                    <button
                      onClick={() => navigate('/categories')}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
                    >
                      <i className="fa-solid fa-shopping-bag mr-2"></i>
                      Start Shopping
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map((vendor) => (
                <div key={vendor.vendorId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Vendor Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={vendor.vendorAvatar}
                        alt={vendor.vendorName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{vendor.vendorName}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400 text-sm">
                            {renderStars(vendor.vendorRating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {vendor.vendorRating} ({vendor.vendorReviews} reviews)
                          </span>
                          {vendor.vendorVerified && (
                            <i className="fa-solid fa-check-circle text-success text-sm"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y divide-gray-100">
                    {vendor.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-6 transition-opacity duration-300 ${
                          showRemoveAnimation === item.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{item.productName}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.productDetails}</p>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-green-100 text-success text-xs font-medium rounded-full">
                                MLM Commission: {item.mlmCommission}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                            {item.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                ${item.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(vendor.vendorId, item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 text-gray-600"
                                disabled={item.quantity <= 1}
                              >
                                <i className="fa-solid fa-minus text-sm"></i>
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(vendor.vendorId, item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 text-gray-600"
                              >
                                <i className="fa-solid fa-plus text-sm"></i>
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(vendor.vendorId, item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <i className="fa-solid fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vendor Subtotal */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Vendor Subtotal:</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${vendor.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )))}
            </section>

            {/* Continue Shopping */}
            <section className="mt-6">
              <button
                onClick={() => navigate('/categories')}
                className="flex items-center space-x-2 text-primary font-semibold hover:underline"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Continue Shopping</span>
              </button>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {!loading && !error && cartItems.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                </div>

                <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-gray-900">${platformFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-coins text-success"></i>
                      <span className="text-sm font-medium text-success">
                        Total MLM Commission: ${totalMlmCommission.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      className={`px-6 py-3 rounded-lg font-semibold transition ${
                        promoApplied
                          ? 'bg-success text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {promoApplied ? 'Applied!' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  <i className="fa-solid fa-lock mr-2"></i>
                  Proceed to Checkout
                </button>

                {/* Security Badges */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <i className="fa-solid fa-shield-alt text-success"></i>
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                    <i className="fa-brands fa-cc-visa text-xl"></i>
                    <i className="fa-brands fa-cc-mastercard text-xl"></i>
                    <i className="fa-brands fa-cc-paypal text-xl"></i>
                    <i className="fa-brands fa-apple-pay text-xl"></i>
                  </div>
                </div>
              </div>
            </section>
            )}

            {/* Trust Signals */}
            <section className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-4">Why Shop with ANZACASH?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-truck text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">Free shipping over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-undo text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">30-day return policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-star text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">Earn rewards on every purchase</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;