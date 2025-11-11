import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');

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

    // Add Highcharts scripts
    const highchartsScript = document.createElement('script');
    highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
    document.head.appendChild(highchartsScript);

    const highchartsExportingScript = document.createElement('script');
    highchartsExportingScript.src = 'https://code.highcharts.com/modules/exporting.js';
    document.head.appendChild(highchartsExportingScript);

    // Initialize charts after scripts load
    const initializeCharts = () => {
      if (typeof Highcharts !== 'undefined') {
        // Revenue Overview Chart
        Highcharts.chart('revenue-chart', {
          credits: { enabled: false },
          chart: {
            type: 'line',
            height: 350
          },
          title: {
            text: null
          },
          xAxis: {
            categories: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19']
          },
          yAxis: {
            title: {
              text: 'Revenue (TZS)'
            }
          },
          colors: ['#4169E1'],
          series: [{
            name: 'Revenue',
            data: [150000, 180000, 220000, 195000, 240000, 280000, 260000, 310000, 290000, 350000, 380000, 420000]
          }],
          plotOptions: {
            line: {
              marker: {
                enabled: true,
                radius: 4
              }
            }
          }
        });

        // Category Pie Chart
        Highcharts.chart('category-chart', {
          credits: { enabled: false },
          chart: {
            type: 'pie',
            height: 320
          },
          title: {
            text: null
          },
          colors: ['#4169E1', '#FB923C', '#7C3AED', '#00C853'],
          series: [{
            name: 'Revenue',
            data: [
              { name: 'Electronics', y: 1450000 },
              { name: 'Fashion', y: 650000 },
              { name: 'Home & Garden', y: 350000 },
              { name: 'Sports', y: 200000 }
            ]
          }],
          plotOptions: {
            pie: {
              showInLegend: false,
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.percentage:.1f}%'
              }
            }
          }
        });
      }
    };

    highchartsScript.onload = initializeCharts;

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
      if (document.head.contains(highchartsExportingScript)) {
        document.head.removeChild(highchartsExportingScript);
      }
    };
  }, []);

  const handleExportReport = () => {
    console.log('Exporting analytics report...');
  };

  const handleChartTypeChange = (type: 'revenue' | 'orders') => {
    setChartType(type);
    console.log(`Switching to ${type} chart`);
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
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/orders')}
                >
                  Orders
                </span>
                <span className="text-primary font-medium cursor-pointer">Analytics</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
              <p className="text-gray-600 mt-2">Track your business performance and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>This month</option>
                <option>Last 3 months</option>
                <option>This year</option>
                <option>Custom range</option>
              </select>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-blue-700"
              >
                <i className="fa-solid fa-download mr-2"></i>Export Report
              </button>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-dollar-sign text-xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-green-300">
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">2,450,000</p>
              <p className="text-sm opacity-75 mt-1">TZS</p>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-shopping-bag text-orange-600 text-xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-success">
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                  <span className="text-sm font-medium">+8.2%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>

            {/* Average Order Value Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-secondary text-xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-success">
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                  <span className="text-sm font-medium">+5.7%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average Order Value</h3>
              <p className="text-3xl font-bold text-gray-900">196,500</p>
              <p className="text-sm text-gray-500 mt-1">TZS</p>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-percentage text-success text-xl"></i>
                </div>
                <div className="flex items-center space-x-1 text-red-500">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                  <span className="text-sm font-medium">-2.1%</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-gray-900">3.24%</p>
              <p className="text-sm text-gray-500 mt-1">From visitors</p>
            </div>
          </div>
        </section>

        {/* Revenue Chart Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleChartTypeChange('revenue')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    chartType === 'revenue'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => handleChartTypeChange('orders')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${
                    chartType === 'orders'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
            <div id="revenue-chart" className="h-96"></div>
          </div>
        </section>

        {/* Analytics Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Wireless Headphones Pro</p>
                      <p className="text-sm text-gray-600">Electronics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">342 sales</p>
                    <p className="text-sm text-success">+15.2%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Smart Watch Series X</p>
                      <p className="text-sm text-gray-600">Electronics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">298 sales</p>
                    <p className="text-sm text-success">+8.7%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Premium Phone Case</p>
                      <p className="text-sm text-gray-600">Accessories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">234 sales</p>
                    <p className="text-sm text-success">+12.1%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-success font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bluetooth Speaker</p>
                      <p className="text-sm text-gray-600">Electronics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">187 sales</p>
                    <p className="text-sm text-red-500">-3.4%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-bold">5</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gaming Mouse</p>
                      <p className="text-sm text-gray-600">Electronics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">156 sales</p>
                    <p className="text-sm text-success">+6.8%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue by Category</h2>
              <div id="category-chart" className="h-80"></div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-4 h-4 bg-primary rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Electronics</p>
                  <p className="font-bold text-gray-900">1,450,000 TZS</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Fashion</p>
                  <p className="font-bold text-gray-900">650,000 TZS</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-secondary rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Home & Garden</p>
                  <p className="font-bold text-gray-900">350,000 TZS</p>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-success rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Sports</p>
                  <p className="font-bold text-gray-900">200,000 TZS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MLM Performance Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-secondary to-purple-600 text-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">MLM Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top MLM Referral Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4 opacity-90">Top MLM Referral Products</h3>
                <div className="space-y-3">
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Wireless Headphones Pro</p>
                        <p className="text-sm opacity-75">45% commission rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">156 referrals</p>
                        <p className="text-sm opacity-75">This month</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Smart Watch Series X</p>
                        <p className="text-sm opacity-75">40% commission rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">134 referrals</p>
                        <p className="text-sm opacity-75">This month</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Premium Phone Case</p>
                        <p className="text-sm opacity-75">35% commission rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">98 referrals</p>
                        <p className="text-sm opacity-75">This month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Payouts */}
              <div>
                <h3 className="text-lg font-semibold mb-4 opacity-90">Commission Payouts</h3>
                <div className="bg-white bg-opacity-10 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold">487,500</p>
                    <p className="text-sm opacity-75">TZS paid to MLM members</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">Active MLM Members</span>
                      <span className="font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">Average Commission per Sale</span>
                      <span className="font-medium">1,580 TZS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">Top Referrer Earnings</span>
                      <span className="font-medium">45,600 TZS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <div
            className="flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            <i className="fa-solid fa-shopping-bag text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Orders</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-chart-bar text-primary text-xl"></i>
            <span className="text-xs font-medium text-primary">Analytics</span>
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

export default AnalyticsPage;