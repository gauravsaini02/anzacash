import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../shared/AdminHeader';
import AdminSidebar from '../shared/AdminSidebar';

interface AdminStats {
  totalRevenue: number;
  activeVendors: number;
  mlmMembers: number;
  revenueChange: number;
  vendorsChange: number;
  membersChange: number;
}

interface TopVendor {
  id: number;
  name: string;
  revenue: number;
  avatar: string;
  rank: number;
}

interface Activity {
  id: number;
  type: 'vendor' | 'payout' | 'review' | 'report';
  title: string;
  description: string;
  time: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  useEffect(() => {
    // Load Font Awesome and Highcharts
    const loadScripts = () => {
      // Font Awesome
      const fontAwesomeScript = document.createElement('script');
      fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
      fontAwesomeScript.crossOrigin = 'anonymous';
      fontAwesomeScript.referrerPolicy = 'no-referrer';
      document.head.appendChild(fontAwesomeScript);

      // Highcharts
      const highchartsScript = document.createElement('script');
      highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
      document.head.appendChild(highchartsScript);

      // Configure Font Awesome
      if (window.FontAwesome) {
        window.FontAwesome.config = { autoReplaceSvg: 'nest' };
      }

      // Initialize charts once Highcharts is loaded
      highchartsScript.onload = () => {
        initializeCharts();
      };
    };

    const loadMockData = () => {
      // Mock stats
      setStats({
        totalRevenue: 45680000,
        activeVendors: 2847,
        mlmMembers: 18542,
        revenueChange: 12.5,
        vendorsChange: 8.3,
        membersChange: 15.7
      });

      // Mock top vendors
      setTopVendors([
        { id: 1, name: 'TechWorld Electronics', revenue: 8450000, avatar: 'avatar-2', rank: 1 },
        { id: 2, name: 'Fashion Hub', revenue: 6230000, avatar: 'avatar-4', rank: 2 },
        { id: 3, name: 'Home & Garden', revenue: 4870000, avatar: 'avatar-8', rank: 3 },
        { id: 4, name: 'Sports Central', revenue: 3650000, avatar: 'avatar-9', rank: 4 }
      ]);

      // Mock activities
      setActivities([
        { id: 1, type: 'vendor', title: 'John Mwangi', description: 'registered as a new vendor', time: '2 minutes ago' },
        { id: 2, type: 'payout', title: '125,000 TSH', description: 'Commission payout processed to MLM members', time: '5 minutes ago' },
        { id: 3, type: 'review', title: 'TechWorld Electronics', description: 'received a 5-star review', time: '10 minutes ago' },
        { id: 4, type: 'report', title: 'iPhone 15 Pro', description: 'Product reported for suspicious pricing', time: '15 minutes ago' }
      ]);

      setLoading(false);
    };

    loadScripts();
    loadMockData();
  }, []);

  const initializeCharts = () => {
    // Revenue Chart
    if (window.Highcharts) {
      window.Highcharts.chart('revenue-chart-container', {
        chart: {
          type: 'line',
          backgroundColor: 'transparent'
        },
        credits: { enabled: false },
        title: { text: null },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          gridLineWidth: 0,
          lineWidth: 0,
          tickWidth: 0
        },
        yAxis: {
          title: { text: null },
          gridLineWidth: 1,
          gridLineColor: '#f3f4f6'
        },
        plotOptions: {
          line: {
            lineWidth: 3,
            marker: {
              radius: 6,
              fillColor: '#ffffff',
              lineWidth: 3
            }
          }
        },
        series: [{
          name: 'Revenue (Million TSH)',
          data: [25, 28, 32, 35, 38, 42, 45, 48, 44, 46, 50, 52],
          color: '#4169E1'
        }],
        legend: { enabled: false }
      });

      // Registrations Chart
      window.Highcharts.chart('registrations-chart-container', {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        credits: { enabled: false },
        title: { text: null },
        xAxis: {
          categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          gridLineWidth: 0,
          lineWidth: 0,
          tickWidth: 0
        },
        yAxis: {
          title: { text: null },
          gridLineWidth: 1,
          gridLineColor: '#f3f4f6'
        },
        plotOptions: {
          column: {
            borderRadius: 4,
            pointPadding: 0.1,
            groupPadding: 0.2
          }
        },
        series: [{
          name: 'Vendors',
          data: [45, 52, 38, 67],
          color: '#4169E1'
        }, {
          name: 'MLM Members',
          data: [123, 145, 167, 189],
          color: '#7C3AED'
        }],
        legend: { enabled: false }
      });
    }
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-TZ');
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'vendor': return 'fa-user-plus';
      case 'payout': return 'fa-money-bill';
      case 'review': return 'fa-star';
      case 'report': return 'fa-exclamation-triangle';
      default: return 'fa-circle';
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'vendor': return 'bg-green-100 text-green-600';
      case 'payout': return 'bg-purple-100 text-purple-600';
      case 'review': return 'bg-orange-100 text-orange-600';
      case 'report': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityBadgeColor = (type: string): string => {
    switch (type) {
      case 'vendor': return 'bg-green-100 text-green-800';
      case 'payout': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'report': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-500';
      case 2: return 'from-gray-400 to-gray-500';
      case 3: return 'from-orange-400 to-orange-500';
      case 4: return 'from-blue-400 to-blue-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform overview and management center</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center space-x-2">
              <i className="fa-solid fa-download"></i>
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-dollar-sign text-white text-xl"></i>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="text-success text-sm font-medium">+{stats?.revenueChange}%</span>
                <i className="fa-solid fa-arrow-up text-success text-xs"></i>
              </div>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
          <p className="text-gray-500 text-sm">TSH this month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-purple-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-store text-white text-xl"></i>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="text-success text-sm font-medium">+{stats?.vendorsChange}%</span>
                <i className="fa-solid fa-arrow-up text-success text-xs"></i>
              </div>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Active Vendors</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.activeVendors || 0)}</p>
          <p className="text-gray-500 text-sm">Verified sellers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-users text-white text-xl"></i>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className="text-success text-sm font-medium">+{stats?.membersChange}%</span>
                <i className="fa-solid fa-arrow-up text-success text-xs"></i>
              </div>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">MLM Members</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.mlmMembers || 0)}</p>
          <p className="text-gray-500 text-sm">Active referrers</p>
        </div>
      </section>

      {/* Revenue Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-gray-600">Monthly revenue trend</p>
            </div>
          </div>
          <div id="revenue-chart-container" className="h-80"></div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Platform management</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-tasks text-green-500"></i>
                <div>
                  <p className="font-medium text-gray-900">Task Management</p>
                  <p className="text-sm text-gray-600">Manage tasks and upload videos</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
              >
                Open
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-user-check text-red-500"></i>
                <div>
                  <p className="font-medium text-gray-900">Pending Vendors</p>
                  <p className="text-sm text-gray-600">23 awaiting approval</p>
                </div>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600">
                Review
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-flag text-yellow-500"></i>
                <div>
                  <p className="font-medium text-gray-900">Reported Content</p>
                  <p className="text-sm text-gray-600">8 reports to review</p>
                </div>
              </div>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600">
                Review
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-money-bill text-blue-500"></i>
                <div>
                  <p className="font-medium text-gray-900">Commission Payouts</p>
                  <p className="text-sm text-gray-600">156 pending payments</p>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
                Process
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-cog text-purple-500"></i>
                <div>
                  <p className="font-medium text-gray-900">System Settings</p>
                  <p className="text-sm text-gray-600">Platform configuration</p>
                </div>
              </div>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600">
                Manage
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Registrations Chart and Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">New Registrations</h2>
              <p className="text-gray-600">Weekly user acquisition</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm text-gray-600">Vendors</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm text-gray-600">MLM</span>
              </div>
            </div>
          </div>
          <div id="registrations-chart-container" className="h-64"></div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Vendors</h2>
              <p className="text-gray-600">By revenue this month</p>
            </div>
            <button className="text-primary hover:text-blue-600 text-sm font-medium">View All</button>
          </div>

          <div className="space-y-4">
            {topVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(vendor.rank)} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">{vendor.rank}</span>
                </div>
                <img
                  src={`https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/${vendor.avatar}.jpg`}
                  alt={vendor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                  <p className="text-sm text-gray-600">Top performing vendor</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(vendor.revenue)}</p>
                  <p className="text-sm text-gray-600">TSH</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Activity Feed */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600">Platform activity feed</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-lg text-sm font-medium">All</button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100">Users</button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100">Payments</button>
          </div>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                <i className={`fa-solid ${getActivityIcon(activity.type)}`}></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-900">
                  {activity.type === 'vendor' && <span className="font-medium">{activity.title}</span>}
                  {activity.type === 'payout' && <span>Commission payout of <span className="font-medium">{activity.title}</span> processed</span>}
                  {activity.type === 'review' && <span><span className="font-medium">{activity.title}</span> received a 5-star review</span>}
                  {activity.type === 'report' && <span>Product <span className="font-medium">"{activity.title}"</span> reported</span>}
                  {' '}{activity.description}
                </p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
              <span className={`text-xs ${getActivityBadgeColor(activity.type)} px-2 py-1 rounded-full capitalize`}>
                {activity.type === 'vendor' && 'New Vendor'}
                {activity.type === 'payout' && 'Payout'}
                {activity.type === 'review' && 'Review'}
                {activity.type === 'report' && 'Report'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-primary hover:text-blue-600 font-medium">View All Activity</button>
        </div>
      </section>
      </main>

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Floating Action Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 flex items-center justify-center z-30"
        title="Open Task Management"
      >
        <i className="fa-solid fa-tasks text-xl"></i>
      </button>
    </div>
  );
};

export default AdminDashboard;