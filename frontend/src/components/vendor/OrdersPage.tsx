import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  customer: string;
  total: number;
  earning: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  itemsList?: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    phone: string;
  };
  paymentInfo?: {
    method: string;
    transactionId: string;
    status: string;
  };
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    console.log('OrdersPage mounted');
  }, []);

  // Mock orders data
  const orders: Order[] = [
    {
      id: 'order-1',
      orderNumber: '#ORD-2024-001',
      date: 'January 15, 2024',
      time: '2:30 PM',
      customer: 'Sarah Johnson',
      total: 125000,
      earning: 98750,
      status: 'pending',
      items: 3,
      itemsList: [
        {
          name: 'Wireless Headphones',
          quantity: 1,
          price: 75000,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
        },
        {
          name: 'Phone Case',
          quantity: 2,
          price: 25000,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
        }
      ],
      shippingAddress: {
        name: 'Sarah Johnson',
        street: '123 Uhuru Street',
        city: 'Dar es Salaam, Tanzania',
        phone: '+255 123 456 789'
      },
      paymentInfo: {
        method: 'Mobile Money',
        transactionId: 'TXN123456789',
        status: 'Paid'
      }
    },
    {
      id: 'order-2',
      orderNumber: '#ORD-2024-002',
      date: 'January 14, 2024',
      time: '11:45 AM',
      customer: 'Michael Brown',
      total: 89500,
      earning: 71600,
      status: 'processing',
      items: 2,
      itemsList: [
        {
          name: 'Laptop Stand',
          quantity: 1,
          price: 55000,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
        },
        {
          name: 'USB Hub',
          quantity: 1,
          price: 34500,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
        }
      ]
    },
    {
      id: 'order-3',
      orderNumber: '#ORD-2024-003',
      date: 'January 13, 2024',
      time: '4:20 PM',
      customer: 'Emma Davis',
      total: 156800,
      earning: 125440,
      status: 'shipped',
      items: 1,
      itemsList: [
        {
          name: 'Gaming Keyboard',
          quantity: 1,
          price: 156800,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
        }
      ]
    },
    {
      id: 'order-4',
      orderNumber: '#ORD-2024-004',
      date: 'January 12, 2024',
      time: '9:15 AM',
      customer: 'David Wilson',
      total: 67200,
      earning: 53760,
      status: 'delivered',
      items: 2,
      itemsList: [
        {
          name: 'Webcam HD',
          quantity: 1,
          price: 45000,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg'
        },
        {
          name: 'Mouse Pad',
          quantity: 1,
          price: 22200,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg'
        }
      ]
    }
  ];

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

  const toggleOrderDetails = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-600';
      case 'processing':
        return 'bg-blue-100 text-blue-600';
      case 'shipped':
        return 'bg-purple-100 text-purple-600';
      case 'delivered':
        return 'bg-green-100 text-success';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-primary';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-success';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFilterCount = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  const handleExport = () => {
    console.log('Exporting orders...');
  };

  const handlePrintAll = () => {
    console.log('Printing all orders...');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const handlePrintInvoice = (orderId: string) => {
    console.log(`Printing invoice for order ${orderId}`);
  };

  const handleContactCustomer = (orderId: string) => {
    console.log(`Contacting customer for order ${orderId}`);
  };

  return (
    <div className="bg-background min-h-screen pb-20 md:pb-0">
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
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/vendor')}
                >
                  Dashboard
                </span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/products')}
                >
                  Products
                </span>
                <span className="text-primary font-medium cursor-pointer">Orders</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Analytics</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-2">Track and fulfill your customer orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
              >
                <i className="fa-solid fa-download mr-2"></i>Export
              </button>
              <button
                onClick={handlePrintAll}
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-blue-700"
              >
                <i className="fa-solid fa-print mr-2"></i>Print All
              </button>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Orders
                <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                  {getFilterCount('all')}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'pending'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                  {getFilterCount('pending')}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('processing')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'processing'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Processing
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {getFilterCount('processing')}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('shipped')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'shipped'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Shipped
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                  {getFilterCount('shipped')}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('delivered')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'delivered'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Delivered
                <span className="ml-2 px-2 py-1 bg-green-100 text-success rounded-full text-xs">
                  {getFilterCount('delivered')}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('cancelled')}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === 'cancelled'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancelled
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  {getFilterCount('cancelled')}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Orders List */}
        <section className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getStatusIcon(order.id === 'order-1' ? 'pending' : order.status)} bg-opacity-10 rounded-full flex items-center justify-center`}>
                      <i className={`fa-solid fa-shopping-bag ${getStatusIcon(order.id === 'order-1' ? 'pending' : order.status)} text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.date} • {order.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-gray-900">{order.total.toLocaleString()} TZS</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Your Earning</p>
                      <p className="font-bold text-success">{order.earning.toLocaleString()} TZS</p>
                    </div>
                    <span className={`px-3 py-1 ${getStatusColor(order.status)} rounded-full text-sm font-medium`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <i
                      className={`fa-solid fa-chevron-down text-gray-400 transform transition-transform ${
                        expandedOrders.has(order.id) ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {order.itemsList?.slice(0, 2).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                      />
                    ))}
                    {order.items > 2 && (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">+{order.items - 2}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{order.items} items</span>
                  <button
                    className="ml-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderDetails(order.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrders.has(order.id) && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {order.itemsList && order.itemsList.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                          <div className="space-y-3">
                            {order.itemsList.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-xl">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg" />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity} × {item.price.toLocaleString()} TZS</p>
                                </div>
                                <span className="font-bold text-gray-900">
                                  {(item.quantity * item.price).toLocaleString()} TZS
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.shippingAddress && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Shipping Address</h4>
                          <div className="p-4 bg-white rounded-xl">
                            <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                            <p className="text-gray-600">{order.shippingAddress.street}</p>
                            <p className="text-gray-600">{order.shippingAddress.city}</p>
                            <p className="text-gray-600">{order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {order.paymentInfo && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Payment Status</h4>
                          <div className="p-4 bg-white rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Payment Method</span>
                              <span className="font-medium">{order.paymentInfo.method}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Transaction ID</span>
                              <span className="font-medium">{order.paymentInfo.transactionId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Status</span>
                              <span className="px-2 py-1 bg-green-100 text-success rounded-full text-sm font-medium">
                                {order.paymentInfo.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">Order Actions</h4>
                        <div className="space-y-3">
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option>Update Status</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrintInvoice(order.id);
                              }}
                              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
                            >
                              <i className="fa-solid fa-print mr-2"></i>Print Invoice
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactCustomer(order.id);
                              }}
                              className="px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700"
                            >
                              <i className="fa-solid fa-message mr-2"></i>Contact Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Pagination */}
        <section className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-600 hover:bg-white rounded-lg">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">1</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg">2</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg">10</button>
            <button className="px-3 py-2 text-gray-600 hover:bg-white rounded-lg">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 md:hidden">
        <div className="flex items-center justify-around">
          <div
            className="flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => navigate('/vendor')}
          >
            <i className="fa-solid fa-home text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div
            className="flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => navigate('/products')}
          >
            <i className="fa-solid fa-box text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Products</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-shopping-bag text-primary text-xl"></i>
            <span className="text-xs font-medium text-primary">Orders</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-chart-bar text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Analytics</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-user text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OrdersPage;