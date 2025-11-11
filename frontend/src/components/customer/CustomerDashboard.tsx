import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [customerStats, setCustomerStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalSpent: 0,
    rewardPoints: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load customer data
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load customer orders
        console.log('📊 Loading customer orders...');
        const ordersData = await orderService.getCustomerOrders(1, 10); // Load first page with 10 orders
        console.log('✅ Customer orders loaded:', ordersData);

        setCustomerOrders(ordersData.orders);

        // Calculate statistics
        const totalSpent = ordersData.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
        const activeOrders = ordersData.orders.filter((order: any) =>
          order.status === 'Pending' || order.status === 'Processing' || order.status === 'Shipped'
        ).length;

        setCustomerStats({
          totalOrders: ordersData.pagination.totalOrders,
          activeOrders: activeOrders,
          totalSpent: totalSpent,
          rewardPoints: Math.floor(totalSpent * 0.1) // Estimate: 10% of spending as reward points
        });

        console.log('📈 Customer stats calculated:', {
          totalOrders: ordersData.pagination.totalOrders,
          activeOrders: activeOrders,
          totalSpent: totalSpent
        });

      } catch (error) {
        console.error('❌ Error loading customer data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load customer data');

        // Fallback to mock data for demo purposes
        setCustomerOrders([
          {
            orderId: 1,
            orderNumber: 'ORD-2024-001',
            product: { id: 1, name: 'Sample Product', price: 100 },
            seller: { id: 1, username: 'seller1', fullName: 'Sample Seller' },
            quantity: 1,
            totalAmount: 100,
            status: 'Delivered',
            orderDate: new Date().toISOString()
          }
        ]);

        setCustomerStats({
          totalOrders: 1,
          activeOrders: 0,
          totalSpent: 100,
          rewardPoints: 10
        });
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();

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

    // Add custom animations script
    const animationScript = document.createElement('script');
    animationScript.textContent = `
      document.addEventListener('DOMContentLoaded', function() {
          const profileCompletion = 75;
          const circle = document.querySelector('path[stroke="#4169E1"]');
          if (circle) {
              const circumference = 2 * Math.PI * 15.9155;
              const strokeDasharray = \`\${(profileCompletion / 100) * circumference}, \${circumference}\`;
              circle.setAttribute('stroke-dasharray', strokeDasharray);
          }

          const statCards = document.querySelectorAll('#stats-cards > div');
          statCards.forEach((card, index) => {
              card.style.animationDelay = \`\${index * 0.1}s\`;
              card.classList.add('animate-pulse');
              setTimeout(() => {
                  card.classList.remove('animate-pulse');
              }, 1000 + (index * 100));
          });

          const orderRows = document.querySelectorAll('tbody tr');
          orderRows.forEach(row => {
              row.addEventListener('mouseenter', function() {
                  this.classList.add('bg-gray-50');
              });
              row.addEventListener('mouseleave', function() {
                  this.classList.remove('bg-gray-50');
              });
          });
      });
    `;
    document.head.appendChild(animationScript);

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
      if (document.head.contains(animationScript)) {
        document.head.removeChild(animationScript);
      }
    };
  }, []);

  const handleViewAllOrders = () => {
    // Navigate to orders page
    console.log('Viewing all orders');
  };

  const handleViewOrderDetails = (orderNumber: string) => {
    // Navigate to order details
    console.log('Viewing order details for:', orderNumber);
  };

  const handleTrackOrder = (orderNumber: string) => {
    // Track order
    console.log('Tracking order:', orderNumber);
  };

  const handleReorder = (orderNumber: string) => {
    // Reorder items
    console.log('Reordering from:', orderNumber);
  };

  const handleCompleteProfile = () => {
    // Navigate to profile completion
    console.log('Completing profile');
  };

  const handleViewAllRecommended = () => {
    // View all recommended products
    console.log('Viewing all recommended products');
  };

  const handleShareInviteLink = () => {
    // Share invite link
    if (navigator.share) {
      navigator.share({
        title: 'Join ANZACASH',
        text: 'Join ANZACASH and earn rewards!',
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      alert('Invite link copied to clipboard!');
    }
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
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Dashboard</span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/categories')}
                >
                  Shop
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
              <div
                className="relative cursor-pointer"
                onClick={() => navigate('/cart')}
              >
                <i className="fa-solid fa-shopping-cart text-gray-600 text-xl hover:text-primary"></i>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hi, Sarah Johnson! 👋</h1>
              <p className="text-blue-100 text-lg">Welcome back to your dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Account Balance</p>
              <p className="text-3xl font-bold">$2,450.00</p>
              <div className="flex items-center justify-end mt-2">
                <i className="fa-solid fa-arrow-up text-green-300 mr-1"></i>
                <span className="text-green-300 text-sm">+12.5% this month</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Loading/Error State */}
            {loading && (
              <div className="flex justify-center items-center h-32 mb-8">
                <div className="flex flex-col items-center">
                  <i className="fa-solid fa-spinner fa-spin text-primary text-3xl mb-2"></i>
                  <span className="text-gray-600">Loading your dashboard...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-exclamation-triangle text-red-500"></i>
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {!loading && (
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-shopping-bag text-primary text-xl"></i>
                    </div>
                    <div className="flex items-center text-success text-sm">
                      <i className="fa-solid fa-arrow-up mr-1"></i>
                      <span>New</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{customerStats.totalOrders}</h3>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-clock text-orange-500 text-xl"></i>
                    </div>
                    <div className={`flex items-center text-sm ${customerStats.activeOrders > 0 ? 'text-orange-500' : 'text-success'}`}>
                      <i className={`fa-solid fa-${customerStats.activeOrders > 0 ? 'minus' : 'check'} mr-1`}></i>
                      <span>{customerStats.activeOrders}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{customerStats.activeOrders}</h3>
                  <p className="text-gray-600 text-sm">Active Orders</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-dollar-sign text-success text-xl"></i>
                    </div>
                    <div className="flex items-center text-success text-sm">
                      <i className="fa-solid fa-arrow-up mr-1"></i>
                      <span>Total</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    ${customerStats.totalSpent.toFixed(2)}
                  </h3>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-star text-secondary text-xl"></i>
                    </div>
                    <div className="flex items-center text-success text-sm">
                      <i className="fa-solid fa-arrow-up mr-1"></i>
                      <span>Earned</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{customerStats.rewardPoints}</h3>
                  <p className="text-gray-600 text-sm">Reward Points</p>
                </div>
              </section>
            )}

            {/* Recent Orders */}
            {!loading && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button
                      onClick={handleViewAllOrders}
                      className="text-primary font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order #</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customerOrders.length > 0 ? (
                        customerOrders.slice(0, 5).map((order) => (
                          <tr key={order.orderId}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="max-w-xs truncate" title={order.product.name}>
                                {order.product.name}
                              </div>
                              <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              ${order.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${orderService.getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleViewOrderDetails(order.orderNumber)}
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <i className="fa-solid fa-shopping-bag text-gray-300 text-4xl mb-3"></i>
                              <p className="text-lg font-medium">No orders yet</p>
                              <p className="text-sm">Start shopping to see your orders here</p>
                              <button
                                onClick={() => navigate('/categories')}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                              >
                                Start Shopping
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Profile Completion */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Completion</h3>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4169E1" strokeWidth="3" strokeDasharray="75, 100"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">75%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">Complete your profile to unlock more features</p>
              <button
                onClick={handleCompleteProfile}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Complete Profile
              </button>
            </section>

            {/* Recommended Products */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png" alt="Product" className="w-12 h-12 rounded-lg object-cover"/>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">Wireless Headphones</h4>
                    <p className="text-primary font-bold text-sm">$79.99</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png" alt="Product" className="w-12 h-12 rounded-lg object-cover"/>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">Smart Watch</h4>
                    <p className="text-primary font-bold text-sm">$199.99</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png" alt="Product" className="w-12 h-12 rounded-lg object-cover"/>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">Phone Case</h4>
                    <p className="text-primary font-bold text-sm">$24.99</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleViewAllRecommended}
                className="w-full mt-4 text-primary font-semibold hover:underline"
              >
                View All
              </button>
            </section>

            {/* Invite Friends */}
            <section className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-users text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Invite Friends</h3>
                <p className="text-gray-600 text-sm mb-4">Earn $10 for every friend who joins and makes their first purchase</p>
                <button
                  onClick={handleShareInviteLink}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  <i className="fa-solid fa-share mr-2"></i>
                  Share Invite Link
                </button>
                <p className="text-xs text-gray-500 mt-3">You've earned $50 from referrals this month!</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;