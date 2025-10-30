import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();

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

    // Add Highcharts script
    const highchartsScript = document.createElement('script');
    highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
    document.head.appendChild(highchartsScript);

    // Add custom functionality script
    const functionalityScript = document.createElement('script');
    functionalityScript.textContent = `
      document.addEventListener('DOMContentLoaded', function() {
        const toggleBalanceBtn = document.getElementById('toggle-balance');
        const balanceAmount = document.getElementById('balance-amount');
        let balanceVisible = true;

        if (toggleBalanceBtn) {
          toggleBalanceBtn.addEventListener('click', function() {
            if (balanceVisible) {
              balanceAmount.textContent = '••••••••';
              this.innerHTML = '<i class="fa-solid fa-eye-slash text-xl"></i>';
            } else {
              balanceAmount.textContent = '2,450,000';
              this.innerHTML = '<i class="fa-solid fa-eye text-xl"></i>';
            }
            balanceVisible = !balanceVisible;
          });
        }

        // Initialize Highcharts
        if (typeof Highcharts !== 'undefined') {
          Highcharts.chart('sales-chart-container', {
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
              data: [420000, 680000, 540000, 890000, 750000, 920000, 1200000],
              color: '#4169E1',
              lineWidth: 3
            }],
            tooltip: {
              formatter: function() {
                return '<b>' + this.x + '</b><br/>' +
                       'Sales: ' + Highcharts.numberFormat(this.y, 0) + ' TZS';
              }
            }
          });
        }
      });
    `;
    document.head.appendChild(functionalityScript);

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
      if (document.head.contains(highchartsScript)) {
        document.head.removeChild(highchartsScript);
      }
      if (document.head.contains(functionalityScript)) {
        document.head.removeChild(functionalityScript);
      }
    };
  }, []);

  const handleWithdraw = () => {
    console.log('Processing withdrawal');
  };

  const handleAddProduct = () => {
    console.log('Adding new product');
  };

  const handleViewAllOrders = () => {
    console.log('Viewing all orders');
  };

  const handleViewAllProducts = () => {
    console.log('Viewing all products');
  };

  const handleChartPeriodChange = (period: string) => {
    console.log('Changing chart period to:', period);
  };

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
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Orders</span>
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
        {/* Profile and Balance Card */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-primary via-blue-600 to-secondary rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                  alt="Vendor"
                  className="w-16 h-16 rounded-full border-4 border-white/20"
                />
                <div>
                  <h1 className="text-2xl font-bold">TechHub Electronics</h1>
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-circle-check text-green-400"></i>
                    <span className="text-sm font-medium">Verified Vendor</span>
                  </div>
                </div>
              </div>
              <button id="toggle-balance" className="text-white/80 hover:text-white">
                <i className="fa-solid fa-eye text-xl"></i>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-white/80 mb-2">Your Balance</p>
              <div className="flex items-center space-x-4">
                <span id="balance-amount" className="text-5xl font-bold">2,450,000</span>
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
            <p className="text-3xl font-bold text-gray-900">5,890,000</p>
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
            <p className="text-3xl font-bold text-gray-900">247</p>
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
            <p className="text-3xl font-bold text-gray-900">156</p>
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
            <p className="text-3xl font-bold text-gray-900">850,000</p>
            <p className="text-xs text-gray-500 mt-1">TZS pending</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={handleViewAllOrders}
                className="text-primary font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Order ID</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Customer</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Product</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Amount</th>
                    <th className="text-left text-sm font-medium text-gray-600 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr className="border-b border-gray-50">
                    <td className="py-4 text-sm font-medium text-gray-900">#ANZ-1847</td>
                    <td className="py-4 text-sm text-gray-700">Sarah Johnson</td>
                    <td className="py-4 text-sm text-gray-700">Wireless Headphones</td>
                    <td className="py-4 text-sm font-medium text-gray-900">235,000 TZS</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-green-100 text-success text-xs font-medium rounded-full">Delivered</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 text-sm font-medium text-gray-900">#ANZ-1846</td>
                    <td className="py-4 text-sm text-gray-700">Michael Brown</td>
                    <td className="py-4 text-sm text-gray-700">Smart Watch</td>
                    <td className="py-4 text-sm font-medium text-gray-900">450,000 TZS</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-100 text-primary text-xs font-medium rounded-full">Processing</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 text-sm font-medium text-gray-900">#ANZ-1845</td>
                    <td className="py-4 text-sm text-gray-700">Emma Davis</td>
                    <td className="py-4 text-sm text-gray-700">Bluetooth Speaker</td>
                    <td className="py-4 text-sm font-medium text-gray-900">180,000 TZS</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Shipped</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-sm font-medium text-gray-900">#ANZ-1844</td>
                    <td className="py-4 text-sm text-gray-700">James Wilson</td>
                    <td className="py-4 text-sm text-gray-700">Gaming Mouse</td>
                    <td className="py-4 text-sm font-medium text-gray-900">95,000 TZS</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Cancelled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Products */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Selling</h2>
              <button
                onClick={handleViewAllProducts}
                className="text-primary font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Wireless Headphones</h4>
                  <p className="text-xs text-gray-600">45 sold this month</p>
                </div>
                <span className="text-sm font-bold text-gray-900">235,000 TZS</span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Smart Watch</h4>
                  <p className="text-xs text-gray-600">38 sold this month</p>
                </div>
                <span className="text-sm font-bold text-gray-900">450,000 TZS</span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Bluetooth Speaker</h4>
                  <p className="text-xs text-gray-600">32 sold this month</p>
                </div>
                <span className="text-sm font-bold text-gray-900">180,000 TZS</span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Gaming Mouse</h4>
                  <p className="text-xs text-gray-600">28 sold this month</p>
                </div>
                <span className="text-sm font-bold text-gray-900">95,000 TZS</span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">USB Cable</h4>
                  <p className="text-xs text-gray-600">25 sold this month</p>
                </div>
                <span className="text-sm font-bold text-gray-900">35,000 TZS</span>
              </div>
            </div>
          </section>
        </div>

        {/* Sales Chart */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleChartPeriodChange('7days')}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                7 Days
              </button>
              <button
                onClick={() => handleChartPeriodChange('30days')}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
              >
                30 Days
              </button>
              <button
                onClick={() => handleChartPeriodChange('3months')}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
              >
                3 Months
              </button>
            </div>
          </div>
          <div id="sales-chart-container" style={{ height: '300px' }}></div>
        </section>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 md:hidden">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-home text-primary text-xl"></i>
            <span className="text-xs font-medium text-primary">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-box text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Products</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-shopping-bag text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Orders</span>
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

export default VendorDashboard;