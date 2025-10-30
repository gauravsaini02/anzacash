import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const orderNumber = '#ANZ-2024-001847';
  const customerName = 'Sarah';
  const customerEmail = 'sarah.johnson@email.com';

  const orderItems: OrderItem[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      quantity: 1,
      price: 129.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      quantity: 1,
      price: 199.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    },
    {
      id: '3',
      name: 'Designer Leather Handbag',
      quantity: 1,
      price: 89.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 0; // FREE Standard Delivery
  const platformFee = 2.50;
  const mlmCommission = 35.50;
  const total = subtotal + shippingCost + platformFee;

  useEffect(() => {
    // Load FontAwesome and Tailwind config
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    fontAwesomeScript.onload = () => {
      if ((window as any).FontAwesome) {
        (window as any).FontAwesome.config = { autoReplaceSvg: 'nest' };
      }
    };
    document.head.appendChild(fontAwesomeScript);

    // Add Tailwind config
    if (!(window as any).tailwind) {
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
    }

    // Add custom animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-30px); }
        70% { transform: translateY(-15px); }
      }
      .bounce-animation { animation: bounce 2s ease-in-out; }
      @keyframes pulse-success {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      .pulse-success { animation: pulse-success 2s ease-in-out infinite; }
    `;
    document.head.appendChild(styleSheet);

    // Remove bounce animation after 2 seconds
    setTimeout(() => {
      const bounceElement = document.querySelector('.bounce-animation');
      if (bounceElement) {
        bounceElement.classList.remove('bounce-animation');
      }
    }, 2000);

    return () => {
      document.head.removeChild(fontAwesomeScript);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleTrackOrder = () => {
    // Navigate to order tracking page
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    // Navigate to shop page
    navigate('/categories');
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);

    // Simulate invoice generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setDownloadComplete(true);

    // Reset button state after 2 seconds
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(false);
    }, 2000);
  };

  const handleBecomeMLMMember = () => {
    // Navigate to MLM membership page
    navigate('/mlm-membership');
  };

  return (
    <div className="min-h-screen bg-background">
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
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Dashboard</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Shop</span>
                <span className="text-primary font-medium cursor-pointer">Orders</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Rewards</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-shopping-cart text-gray-600 text-xl cursor-pointer"></i>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 text-white text-xs rounded-full flex items-center justify-center">0</span>
              </div>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8">
        {/* Progress Indicator */}
        <section className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Cart</span>
            </div>
            <div className="w-16 h-0.5 bg-success"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-success"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-success"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold pulse-success">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Confirmation</span>
            </div>
          </div>
        </section>

        {/* Success Content */}
        <section className="text-center mb-8">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-12 mb-8">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 bounce-animation">
                <i className="fa-solid fa-check text-white text-4xl"></i>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-xl text-gray-600 mb-6">Thank you for your purchase, {customerName}!</p>
              <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-6">
                <p className="text-sm font-medium mb-2">Order Number</p>
                <p className="text-2xl sm:text-3xl font-bold">{orderNumber}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <i className="fa-solid fa-envelope text-success text-xl"></i>
                <h3 className="text-lg font-bold text-gray-900">Confirmation Email Sent</h3>
              </div>
              <p className="text-gray-700">
                A detailed confirmation has been sent to <span className="font-semibold">{customerEmail}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fa-solid fa-receipt text-primary mr-3"></i>
            Order Summary
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="fa-solid fa-truck text-primary text-xl"></i>
                    <h4 className="font-semibold text-gray-900">Delivery Information</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Method:</span> Standard Delivery (FREE)
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Estimated Delivery:</span> January 25-27, 2024
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Address:</span> 123 Main Street, Dar es Salaam
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="fa-solid fa-credit-card text-secondary text-xl"></i>
                    <h4 className="font-semibold text-gray-900">Payment Information</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Method:</span> Visa ending in 3456
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total Paid:</span> ${total.toFixed(2)}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="fa-solid fa-search text-success text-xl"></i>
                    <h4 className="font-semibold text-gray-900">Tracking Information</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Tracking Number:</span> ANZ2024001847TZ
                  </p>
                  <p className="text-xs text-gray-600">
                    You'll receive tracking updates via email and SMS
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-900">Total Amount Paid:</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-success mt-2">
              <span>MLM Commission Earned:</span>
              <span className="font-semibold">+${mlmCommission.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleTrackOrder}
            className="bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-truck-fast"></i>
            <span>Track Order</span>
          </button>

          <button
            onClick={handleContinueShopping}
            className="bg-white border-2 border-primary text-primary py-4 px-6 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-shopping-bag"></i>
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg hover:border-gray-400 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isDownloading && !downloadComplete ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Generating...</span>
              </>
            ) : downloadComplete ? (
              <>
                <i className="fa-solid fa-check"></i>
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-download"></i>
                <span>Download Invoice</span>
              </>
            )}
          </button>
        </section>

        {/* MLM Promotion */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-share-nodes text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Earning with Every Share!</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              You've just earned ${mlmCommission.toFixed(2)} from your purchase! Want to earn even more? Become an ANZACASH MLM member and earn commissions when you refer friends and family.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-users text-white"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Refer Friends</h4>
                <p className="text-sm text-gray-600">Share products and earn 15% commission on every sale</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-chart-line text-white"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Build Network</h4>
                <p className="text-sm text-gray-600">Grow your network and earn from multiple levels</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-coins text-white"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Passive Income</h4>
                <p className="text-sm text-gray-600">Create a sustainable income stream</p>
              </div>
            </div>

            <button
              onClick={handleBecomeMLMMember}
              className="bg-gradient-to-r from-secondary to-primary text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <i className="fa-solid fa-rocket mr-2"></i>
              Become MLM Member - Only $7/year
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-4">ANZACASH</div>
            <p className="text-gray-600 mb-4">
              Thank you for choosing ANZACASH. We're committed to providing you with the best shopping experience.
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-500">
              <span className="hover:text-primary cursor-pointer">Help Center</span>
              <span className="hover:text-primary cursor-pointer">Contact Us</span>
              <span className="hover:text-primary cursor-pointer">Track Order</span>
              <span className="hover:text-primary cursor-pointer">Returns</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderConfirmationPage;