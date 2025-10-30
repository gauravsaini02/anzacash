import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [cartItems, setCartItems] = useState<VendorGroup[]>([
    {
      vendorId: '1',
      vendorName: 'TechWorld Electronics',
      vendorAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      vendorRating: 4.8,
      vendorReviews: 245,
      vendorVerified: true,
      items: [
        {
          id: '1',
          vendorId: '1',
          vendorName: 'TechWorld Electronics',
          vendorAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
          vendorRating: 4.8,
          vendorReviews: 245,
          vendorVerified: true,
          productName: 'Premium Wireless Headphones',
          productImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png',
          productDetails: 'Color: Black | Model: WH-1000XM4',
          price: 129.99,
          originalPrice: 159.99,
          mlmCommission: '$8.50',
          mlmAmount: '8.50',
          quantity: 1
        },
        {
          id: '2',
          vendorId: '1',
          vendorName: 'TechWorld Electronics',
          vendorAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
          vendorRating: 4.8,
          vendorReviews: 245,
          vendorVerified: true,
          productName: 'Smart Fitness Watch',
          productImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png',
          productDetails: 'Color: Silver | Size: 42mm',
          price: 199.99,
          mlmCommission: '$15.00',
          mlmAmount: '15.00',
          quantity: 1
        }
      ],
      subtotal: 329.98
    },
    {
      vendorId: '2',
      vendorName: 'Fashion Hub',
      vendorAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      vendorRating: 4.6,
      vendorReviews: 189,
      vendorVerified: true,
      items: [
        {
          id: '3',
          vendorId: '2',
          vendorName: 'Fashion Hub',
          vendorAvatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
          vendorRating: 4.6,
          vendorReviews: 189,
          vendorVerified: true,
          productName: 'Designer Leather Handbag',
          productImage: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png',
          productDetails: 'Color: Brown | Material: Genuine Leather',
          price: 89.99,
          mlmCommission: '$12.00',
          mlmAmount: '12.00',
          quantity: 1
        }
      ],
      subtotal: 89.99
    }
  ]);

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
    navigate('/checkout');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star${i < Math.floor(rating) ? '' : i < rating ? '-half-stroke' : '-regular'} text-yellow-400 text-sm`}
      ></i>
    ));
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
              {cartItems.map((vendor) => (
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
              ))}
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